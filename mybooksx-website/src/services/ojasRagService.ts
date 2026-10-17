import { VERIFIED_KNOWLEDGE_DOCS, AUTHORITATIVE_COMPANY_PROFILE } from '../data/companyKnowledge';
import type { CompanyFact } from '../data/companyKnowledge';

export interface RagRetrievalMatch {
  fact: CompanyFact;
  score: number;
  source: string;
}

export class OjasRagService {
  private customDocuments: CompanyFact[] = [];

  constructor() {
    this.loadAdminDocs();
  }

  private loadAdminDocs() {
    try {
      const stored = localStorage.getItem('ojas_admin_custom_knowledge');
      if (stored) {
        this.customDocuments = JSON.parse(stored);
      }
    } catch {}
  }

  public saveCustomDocument(fact: CompanyFact) {
    this.customDocuments.push(fact);
    try {
      localStorage.setItem('ojas_admin_custom_knowledge', JSON.stringify(this.customDocuments));
    } catch {}
  }

  public deleteCustomDocument(id: string) {
    this.customDocuments = this.customDocuments.filter(d => d.id !== id);
    try {
      localStorage.setItem('ojas_admin_custom_knowledge', JSON.stringify(this.customDocuments));
    } catch {}
  }

  public getAllKnowledge(): CompanyFact[] {
    return [...VERIFIED_KNOWLEDGE_DOCS, ...this.customDocuments];
  }

  /**
   * Search knowledge base using token overlap & semantic intent scoring
   */
  public retrieveRelevantContext(query: string, threshold = 2): RagRetrievalMatch[] {
    const clean = query.toLowerCase().replace(/[?.,!]/g, ' ').trim();
    const queryTokens = clean.split(/\s+/).filter(w => w.length > 2);

    const allDocs = this.getAllKnowledge();
    const results: RagRetrievalMatch[] = [];

    for (const doc of allDocs) {
      let score = 0;
      for (const pat of doc.questionPatterns) {
        const patClean = pat.toLowerCase();
        if (clean.includes(patClean)) {
          score += 10;
        } else {
          const patTokens = patClean.split(/\s+/);
          for (const qt of queryTokens) {
            if (patTokens.includes(qt)) {
              score += 2;
            }
          }
        }
      }

      if (score >= threshold) {
        results.push({
          fact: doc,
          score,
          source: doc.source
        });
      }
    }

    return results.sort((a, b) => b.score - a.score);
  }

  /**
   * Construct grounded system prompt with authoritative identity & live date
   */
  public buildSystemPrompt(retrievedContexts: RagRetrievalMatch[], lang: 'en' | 'hi'): string {
    const now = new Date();
    const currentDateStr = now.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    let contextChunk = "";
    if (retrievedContexts.length > 0) {
      contextChunk = retrievedContexts
        .map(r => `[Source: ${r.source}]\nFact: ${lang === 'hi' ? r.fact.answerHi : r.fact.answerEn}`)
        .join('\n\n');
    }

    return `You are Ojas, the official intelligent AI assistant associated with MyBooks.
AUTHORITATIVE IDENTITY GUIDELINES:
- Company Name: ${AUTHORITATIVE_COMPANY_PROFILE.brandName} (${AUTHORITATIVE_COMPANY_PROFILE.officialName})
- Founder: ${AUTHORITATIVE_COMPANY_PROFILE.founder}
- AI Assistant Name: ${AUTHORITATIVE_COMPANY_PROFILE.aiAssistantName}
- Today's Live Date: ${currentDateStr}

CRITICAL RULES:
1. Always state truthfully that Deep Mehta is the founder of MyBooks when asked about the company founder.
2. If asked about unknown company financial metrics, exact launch dates, employee counts or awards that are not in the context, clearly admit the information is not publicly available rather than fabricating it.
3. Answer general knowledge, mathematics, programming, logic, and ordinary questions directly and intelligently.
4. If the user writes in Hindi or Hinglish, reply warmly in natural Hindi or Hinglish.
5. Keep explanations direct, professional, concise, and formatted with Markdown where helpful.

${contextChunk ? `GROUNDED VERIFIED COMPANY CONTEXT:\n${contextChunk}` : "No specific company context retrieved. Rely on general knowledge while maintaining verified identity."}`;
  }
}

export const ragService = new OjasRagService();
