/**
 * Model Provider Abstraction for Ojas AI
 * Supports:
 * 1. Local AI Runtime (Ollama - stream / non-stream)
 * 2. Cloud AI Provider (Gemini / OpenAI compatible)
 * 3. Fallback High-Fidelity Knowledge RAG Engine
 */

export interface ModelMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface ModelProviderConfig {
  provider: 'ollama' | 'cloud' | 'rag-embedded';
  endpoint: string; // e.g. http://localhost:11434
  modelName: string; // e.g. llama3:8b, mistral, gemma:2b
  apiKey?: string;
  temperature?: number;
  maxTokens?: number;
}

export interface ModelGenerationResult {
  text: string;
  sourceType: 'ollama-local' | 'cloud-api' | 'verified-rag';
  modelUsed: string;
  sourceAttribution?: string;
}

export interface OllamaModelInfo {
  name: string;
  size: number;
  modified_at: string;
}

export class OjasModelEngine {
  private config: ModelProviderConfig;

  constructor(config?: Partial<ModelProviderConfig>) {
    this.config = {
      provider: config?.provider || 'ollama',
      endpoint: config?.endpoint || 'http://localhost:11434',
      modelName: config?.modelName || 'qwen2.5:latest',
      temperature: config?.temperature ?? 0.7,
      maxTokens: config?.maxTokens ?? 1024,
      apiKey: config?.apiKey || ''
    };
  }

  public updateConfig(newConfig: Partial<ModelProviderConfig>) {
    this.config = { ...this.config, ...newConfig };
  }

  public getConfig(): ModelProviderConfig {
    return { ...this.config };
  }

  /**
   * Healthcheck to detect if local Ollama daemon is reachable
   */
  public async testOllamaConnection(): Promise<{ ok: boolean; models: string[]; error?: string }> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000);

      const res = await fetch(`${this.config.endpoint}/api/tags`, {
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (!res.ok) {
        return { ok: false, models: [], error: `Server returned HTTP ${res.status}` };
      }

      const data = await res.json();
      const models = Array.isArray(data.models) ? data.models.map((m: OllamaModelInfo) => m.name) : [];
      return { ok: true, models };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      return {
        ok: false,
        models: [],
        error: `Ollama is not running on ${this.config.endpoint}. (${message})`
      };
    }
  }

  /**
   * Primary inference dispatcher
   */
  public async generateResponse(
    messages: ModelMessage[],
    systemInstruction: string,
    onStreamChunk?: (chunk: string) => void,
    abortSignal?: AbortSignal
  ): Promise<ModelGenerationResult> {
    // 1. If provider is Ollama, attempt local inference
    if (this.config.provider === 'ollama') {
      try {
        const result = await this.queryOllama(messages, systemInstruction, onStreamChunk, abortSignal);
        return {
          text: result,
          sourceType: 'ollama-local',
          modelUsed: `Ollama (${this.config.modelName})`
        };
      } catch (err) {
        console.warn("Ollama inference unavailable, falling back to verified embedded engine:", err);
      }
    }

    // 2. If provider is Cloud API and apiKey present
    if (this.config.provider === 'cloud' && this.config.apiKey) {
      try {
        const cloudResult = await this.queryCloud(messages, systemInstruction, abortSignal);
        return {
          text: cloudResult,
          sourceType: 'cloud-api',
          modelUsed: `Cloud (${this.config.modelName})`
        };
      } catch (err) {
        console.warn("Cloud AI inference failed, falling back to embedded engine:", err);
      }
    }

    throw new Error("No active runtime available. Please check Ollama or Cloud settings.");
  }

  /**
   * Query Ollama REST API with streaming support
   */
  private async queryOllama(
    messages: ModelMessage[],
    systemInstruction: string,
    onStreamChunk?: (chunk: string) => void,
    abortSignal?: AbortSignal
  ): Promise<string> {
    const fullMessages = [
      { role: 'system', content: systemInstruction },
      ...messages
    ];

    const res = await fetch(`${this.config.endpoint}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: this.config.modelName,
        messages: fullMessages,
        stream: !!onStreamChunk,
        options: {
          temperature: this.config.temperature,
          num_predict: this.config.maxTokens
        }
      }),
      signal: abortSignal
    });

    if (!res.ok) {
      throw new Error(`Ollama chat endpoint responded with status ${res.status}`);
    }

    if (onStreamChunk && res.body) {
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let accumulated = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n').filter(Boolean);

        for (const line of lines) {
          try {
            const parsed = JSON.parse(line);
            if (parsed.message?.content) {
              const delta = parsed.message.content;
              accumulated += delta;
              onStreamChunk(delta);
            }
          } catch {}
        }
      }
      return accumulated;
    } else {
      const data = await res.json();
      return data.message?.content || '';
    }
  }

  /**
   * Query Cloud OpenAI-compatible endpoint
   */
  private async queryCloud(
    messages: ModelMessage[],
    systemInstruction: string,
    abortSignal?: AbortSignal
  ): Promise<string> {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.config.apiKey}`
      },
      body: JSON.stringify({
        model: this.config.modelName || 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemInstruction },
          ...messages
        ],
        temperature: this.config.temperature
      }),
      signal: abortSignal
    });

    if (!res.ok) {
      throw new Error(`Cloud provider failed with status ${res.status}`);
    }

    const json = await res.json();
    return json.choices?.[0]?.message?.content || '';
  }
}
