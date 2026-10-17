# Ojas AI — Intelligent Assistant for MyBooks

Ojas AI is the official, premium, context-grounded AI copilot engineered for **MyBooks**. It combines **authoritative verified knowledge**, **local model inference via Ollama**, **optional cloud fallback**, and **full conversation memory**.

---

## 1. Authoritative Identity & Verified Facts
- **Company / Organization:** MyBooks (MyBooksX)
- **Founder:** Deep Mehta
- **AI Assistant:** Ojas
- **Verified Facts Rule:** When asked *"Who is the founder of MyBooks?"*, Ojas always states **"Deep Mehta is the founder of MyBooks."** Unverified metrics (exact employee counts, private revenues, or unconfirmed awards) are never fabricated.

---

## 2. Architecture & Capabilities
1. **Left Navigation Sidebar:**
   - Conversation management: create new chats, search historical chats, rename, and delete sessions.
   - Live Ollama daemon connection indicator.
   - Fast access to **Model & Settings** and **MyBooks Knowledge Hub**.
2. **Main Application Area:**
   - Welcome screen with prompt suggestions (Company background, Resto-X pricing, Math evaluation, Python coding).
   - Rich Markdown renderer with syntax-highlighted code blocks, one-click code copy, and structured lists.
   - Message streaming and stop-generation support (`AbortController`).
3. **Local Ollama Integration:**
   - Supports local models (e.g. `llama3:latest`, `mistral`, `gemma:2b`).
   - Automatically detects whether Ollama is reachable on `http://localhost:11434`.
   - Allows users to select an installed model from the GUI.
4. **Retrieval-Augmented Generation (RAG):**
   - Grounded context retrieval from verified MyBooks documents.
   - Displays clear source attribution pills on factual answers.
5. **General Intelligence & Context Memory:**
   - Resolves math (`17 * 24 = 408`), programming questions, and logic.
   - Maintains multi-turn conversation memory.
   - Live system date injection (accurate day, date, and year).
   - Bilingual support for English, Hindi, and natural Hinglish.
6. **Buy-Intent Dispatch:**
   - When a user demonstrates purchase intent, an instant *"Connect with Founder Deep Mehta via WhatsApp"* action appears.

---

## 3. How to Run Locally with Ollama

### Step 1: Start Ollama Daemon
If you have Ollama installed on your machine:
```bash
ollama serve
```

### Step 2: Pull a Recommended Model
For optimal speed and reasoning:
```bash
ollama pull llama3:latest
# Or for lower RAM systems:
ollama pull gemma:2b
```

### Step 3: Start the MyBooks Website & Ojas AI
```bash
cd mybooksx-website
npm run dev
```
Open `http://localhost:5173/` in your browser. Click **"Ask Ojas AI"** in the top navigation or bottom-right floating trigger.

---

## 4. Production Build & Safety
```bash
npm run build
```
- Secrets (such as optional cloud API keys) are kept in local client memory and never committed or exposed in public bundles.
- Offline and disconnected server states are handled gracefully with verified RAG fallback.
