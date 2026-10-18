/**
 * Ojas AI Enhanced Matching Engine
 * 
 * Capabilities:
 * 1. Input normalization (lowercase, strip punctuation, letter-deduping, extra whitespace removal).
 * 2. Synonym mapping for English, Hinglish, slang, and typo tokens.
 * 3. Levenshtein fuzzy distance matching to handle typos (e.g. 'softwzre' -> 'software', 'compiteter' -> 'competitor').
 * 4. Weighted scoring across English keywords, Hinglish keywords, phrase length, and exact matches.
 * 5. Multi-turn topic memory: retains last discussed product/service for follow-ups ("its price?", "its timeline?").
 * 6. Confidence threshold guard: below threshold triggers fallback chips, WhatsApp button, and logs to localStorage.
 */

import { OJAS_INTENTS, type OjasIntent } from '../data/ojasIntents';

export interface MatchResult {
  intent: OjasIntent | null;
  score: number;
  isConfident: boolean;
  matchedTopic: string;
  source: 'exact_phrase' | 'weighted_keywords' | 'fuzzy_match' | 'context_followup' | 'fallback';
}

export interface UnansweredQuestionRecord {
  id: string;
  question: string;
  normalized: string;
  timestamp: string;
  language: 'en' | 'hi';
}

// Global or module-level topic memory
let currentSessionTopic: string = '';

export class OjasMatchingEngine {
  private static CONFIDENCE_THRESHOLD = 16;

  // Synonyms map: variations -> canonical concept token
  private static SYNONYM_MAP: Record<string, string> = {
    // Software variations & typos
    'softwzre': 'software',
    'softwere': 'software',
    'sofware': 'software',
    'softwar': 'software',
    'softwares': 'software',
    'sftware': 'software',
    'system': 'software',
    'app': 'software',
    'application': 'software',

    // Competitor variations & typos
    'compiteter': 'competitor',
    'competeter': 'competitor',
    'compititor': 'competitor',
    'competator': 'competitor',
    'competitors': 'competitor',
    'rival': 'competitor',
    'rivals': 'competitor',
    'dusra': 'competitor',
    'dusre': 'competitor',
    'dusri': 'competitor',
    'other': 'competitor',
    'others': 'competitor',

    // Cheaper & low cost
    'cheaper': 'cheap',
    'cheapr': 'cheap',
    'cheep': 'cheap',
    'cheepest': 'cheap',
    'sasta': 'cheap',
    'saste': 'cheap',
    'sasti': 'cheap',
    'lowprice': 'cheap',
    'kamdaam': 'cheap',
    'kamrate': 'cheap',

    // Price & Cost
    'price': 'pricing',
    'pricing': 'pricing',
    'prices': 'pricing',
    'cost': 'pricing',
    'rate': 'pricing',
    'rates': 'pricing',
    'paisa': 'pricing',
    'paise': 'pricing',
    'rupaye': 'pricing',
    'rupees': 'pricing',
    'fees': 'pricing',
    'charge': 'pricing',
    'charges': 'pricing',
    'kharcha': 'pricing',
    'budget': 'pricing',

    // Expensive
    'expensive': 'expensive',
    'mehenga': 'expensive',
    'mehnga': 'expensive',
    'costly': 'expensive',

    // Founder / Owner
    'founder': 'founder',
    'funder': 'founder',
    'foundr': 'founder',
    'owner': 'founder',
    'malik': 'founder',
    'ceo': 'founder',
    'boss': 'founder',
    'creator': 'founder',
    'deepmehta': 'founder',

    // Time / Timeline
    'timeline': 'timeline',
    'time': 'timeline',
    'duration': 'timeline',
    'days': 'timeline',
    'speed': 'timeline',
    'kitnatime': 'timeline',
    'kitnedin': 'timeline',

    // Demo / Trial
    'demo': 'demo',
    'dmo': 'demo',
    'trial': 'demo',
    'sample': 'demo',
    'test': 'demo',
    'dikhao': 'demo',
    'dekhna': 'demo',

    // Buy / Purchase
    'buy': 'buy',
    'purchase': 'buy',
    'order': 'buy',
    'book': 'buy',
    'khareedna': 'buy',
    'lena': 'buy',
    'chahiye': 'buy',

    // Resto-X
    'restaurant': 'resto',
    'resturant': 'resto',
    'restro': 'resto',
    'resto': 'resto',
    'cafe': 'resto',
    'hotel': 'resto',
    'dining': 'resto',
    'kot': 'resto',

    // Event-X
    'wedding': 'event',
    'shaadi': 'event',
    'shadi': 'event',
    'vivah': 'event',
    'marriage': 'event',
    'event': 'event',

    // Fitness-X
    'gym': 'fitness',
    'fitness': 'fitness',
    'workout': 'fitness',
    'kasrat': 'fitness',

    // Competitors specific
    'zoho': 'zoho',
    'petpooja': 'petpooja',
    'petpuja': 'petpooja',
    'posist': 'posist',
    'vyapar': 'vyapar',
    'khatabook': 'khatabook'
  };

  /**
   * Set or get the last discussed topic
   */
  public static setLastTopic(topic: string) {
    currentSessionTopic = topic;
    try {
      sessionStorage.setItem('ojas_last_topic', topic);
    } catch {}
  }

  public static getLastTopic(): string {
    if (!currentSessionTopic) {
      try {
        currentSessionTopic = sessionStorage.getItem('ojas_last_topic') || '';
      } catch {}
    }
    return currentSessionTopic;
  }

  /**
   * 1. Normalize text:
   * - Lowercase
   * - Strip punctuation & special symbols
   * - Collapse 3+ repeating characters (e.g. 'heyyyy' -> 'hey', 'soooo' -> 'soo', 'sastaaaa' -> 'sasta')
   * - Collapse multiple whitespaces
   */
  public static normalize(text: string): string {
    if (!text) return '';
    return text
      .toLowerCase()
      // remove punctuation and special characters
      .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?"'<>@+|[\]\\]/g, ' ')
      // collapse repeated letters (3 or more of same letter down to 1 or 2)
      .replace(/([a-z])\1{2,}/g, '$1')
      .replace(/\s+/g, ' ')
      .trim();
  }

  /**
   * Calculate Levenshtein edit distance between two strings
   */
  public static levenshtein(a: string, b: string): number {
    if (a === b) return 0;
    const al = a.length;
    const bl = b.length;
    if (al === 0) return bl;
    if (bl === 0) return al;

    const matrix: number[][] = [];
    for (let i = 0; i <= al; i++) {
      matrix[i] = [i];
    }
    for (let j = 0; j <= bl; j++) {
      matrix[0][j] = j;
    }

    for (let i = 1; i <= al; i++) {
      for (let j = 1; j <= bl; j++) {
        const cost = a[i - 1] === b[j - 1] ? 0 : 1;
        matrix[i][j] = Math.min(
          matrix[i - 1][j] + 1, // deletion
          matrix[i][j - 1] + 1, // insertion
          matrix[i - 1][j - 1] + cost // substitution
        );
      }
    }
    return matrix[al][bl];
  }

  /**
   * Fuzzy match comparison between token and keyword token
   */
  public static isFuzzyMatch(word1: string, word2: string): boolean {
    if (word1 === word2) return true;
    const len = Math.max(word1.length, word2.length);
    if (len < 4) return false;

    const dist = this.levenshtein(word1, word2);
    if (len <= 5) return dist <= 1;
    if (len <= 8) return dist <= 1;
    return dist <= 2;
  }

  /**
   * Map tokens through synonym map
   */
  public static applySynonyms(tokens: string[]): string[] {
    return tokens.map(t => this.SYNONYM_MAP[t] || t);
  }

  /**
   * Log unanswered query into localStorage
   */
  public static logUnansweredQuestion(rawQuestion: string, language: 'en' | 'hi' = 'en') {
    try {
      const existing = localStorage.getItem('ojas_unanswered_questions');
      const list: UnansweredQuestionRecord[] = existing ? JSON.parse(existing) : [];

      // Avoid duplicates in recent entries
      const normalized = this.normalize(rawQuestion);
      if (!list.some(item => item.normalized === normalized)) {
        list.unshift({
          id: `unans-${Date.now()}`,
          question: rawQuestion.trim(),
          normalized,
          timestamp: new Date().toISOString(),
          language
        });
        // Keep capped at 100 items
        if (list.length > 100) list.pop();
        localStorage.setItem('ojas_unanswered_questions', JSON.stringify(list));
      }
    } catch (e) {
      console.warn('Failed to save unanswered question to localStorage:', e);
    }
  }

  /**
   * Core Intent Matching Algorithm
   */
  public static matchIntent(rawInput: string): MatchResult {
    const norm = this.normalize(rawInput);
    if (!norm) {
      return {
        intent: null,
        score: 0,
        isConfident: false,
        matchedTopic: '',
        source: 'fallback'
      };
    }

    const queryTokens = norm.split(' ').filter(Boolean);
    const mappedTokens = this.applySynonyms(queryTokens);
    const lastTopic = this.getLastTopic();

    // Check for follow-up questions referencing last topic
    const isPriceFollowup = /^(its|what is the|what is its|and its|uska|iski)\s*(price|pricing|cost|rate|paisa|charges)\??$/i.test(norm) ||
      /^(its price|how much|cost|kitne ka hai|price kya hai)\??$/i.test(norm);

    const isTimelineFollowup = /^(its|what is the|what is its|and its|iska|isme)\s*(timeline|time|duration|speed|kitna time|kitne din)\??$/i.test(norm) ||
      /^(its timeline|how long|delivery time|kitna time)\??$/i.test(norm);

    const isDemoFollowup = /^(show demo|its demo|can i see demo|demo dikhao|iska demo)\??$/i.test(norm);

    if (lastTopic) {
      if (isPriceFollowup) {
        // Find product specific pricing if applicable
        const targetId = lastTopic === 'resto_x' ? 'resto_x_pricing'
          : lastTopic === 'event_x' ? 'event_x_pricing'
          : lastTopic === 'fitness_x' ? 'fitness_x_pricing'
          : lastTopic === 'custom_software' ? 'custom_software_overview'
          : lastTopic === 'digital_growth' ? 'all_pricing_overview'
          : 'context_followup_price';

        const matched = OJAS_INTENTS.find(i => i.id === targetId) || OJAS_INTENTS.find(i => i.id === 'context_followup_price');
        if (matched) {
          return {
            intent: matched,
            score: 95,
            isConfident: true,
            matchedTopic: lastTopic,
            source: 'context_followup'
          };
        }
      }

      if (isTimelineFollowup) {
        const matched = OJAS_INTENTS.find(i => i.id === 'context_followup_timeline');
        if (matched) {
          return {
            intent: matched,
            score: 95,
            isConfident: true,
            matchedTopic: lastTopic,
            source: 'context_followup'
          };
        }
      }

      if (isDemoFollowup) {
        const matched = OJAS_INTENTS.find(i => i.id === 'context_followup_demo');
        if (matched) {
          return {
            intent: matched,
            score: 95,
            isConfident: true,
            matchedTopic: lastTopic,
            source: 'context_followup'
          };
        }
      }
    }

    let bestIntent: OjasIntent | null = null;
    let highestScore = 0;
    let bestSource: MatchResult['source'] = 'weighted_keywords';

    for (const intent of OJAS_INTENTS) {
      let score = 0;

      // 1. Exact phrase matches (highest priority)
      for (const kw of intent.keywords) {
        const normKw = this.normalize(kw);
        if (norm === normKw) {
          score += 100;
          bestSource = 'exact_phrase';
        } else if (norm.includes(normKw) && normKw.length > 5) {
          score += 45 + normKw.length * 2;
        }
      }

      for (const hkw of intent.hinglishKeywords) {
        const normHkw = this.normalize(hkw);
        if (norm === normHkw) {
          score += 100;
          bestSource = 'exact_phrase';
        } else if (norm.includes(normHkw) && normHkw.length > 4) {
          score += 45 + normHkw.length * 2;
        }
      }

      // 2. Token overlap & fuzzy matching
      const allKeywords = [...intent.keywords, ...intent.hinglishKeywords];
      for (const phrase of allKeywords) {
        const phraseNorm = this.normalize(phrase);
        const phraseTokens = phraseNorm.split(' ').filter(Boolean);
        const mappedPhraseTokens = this.applySynonyms(phraseTokens);

        let phraseMatchCount = 0;
        let fuzzyCount = 0;

        const stopWords = new Set(['what', 'is', 'are', 'the', 'a', 'an', 'and', 'or', 'in', 'of', 'for', 'to', 'can', 'you', 'we', 'our', 'my', 'me', 'it', 'its', 'do', 'does', 'how', 'kya', 'hai', 'hain', 'ka', 'ke', 'ki', 'ko', 'se', 'me', 'tell', 'about', 'who']);

        for (let i = 0; i < mappedTokens.length; i++) {
          const qTok = mappedTokens[i];
          if (qTok.length <= 2 || stopWords.has(qTok)) continue; // skip tiny stop words

          // Exact token or mapped synonym match
          if (mappedPhraseTokens.includes(qTok)) {
            phraseMatchCount++;
            score += 14;
          } else {
            // Check fuzzy match against phrase tokens
            for (const pTok of mappedPhraseTokens) {
              if (pTok.length > 3 && !stopWords.has(pTok) && this.isFuzzyMatch(qTok, pTok)) {
                fuzzyCount++;
                score += 8;
                bestSource = 'fuzzy_match';
                break;
              }
            }
          }
        }

        // Full phrase matched
        if (phraseTokens.length > 1 && phraseMatchCount === phraseTokens.length) {
          score += 25;
        }
      }

      // Bonus if this matches the currently active topic
      if (lastTopic && intent.topic === lastTopic) {
        score += 8;
      }

      if (score > highestScore) {
        highestScore = score;
        bestIntent = intent;
      }
    }

    const isConfident = highestScore >= this.CONFIDENCE_THRESHOLD;

    if (bestIntent && isConfident) {
      // Update session topic memory
      if (bestIntent.topic && bestIntent.topic !== 'smalltalk' && bestIntent.topic !== 'context_followup') {
        this.setLastTopic(bestIntent.topic);
      }

      return {
        intent: bestIntent,
        score: highestScore,
        isConfident: true,
        matchedTopic: bestIntent.topic,
        source: bestSource
      };
    }

    return {
      intent: null,
      score: highestScore,
      isConfident: false,
      matchedTopic: '',
      source: 'fallback'
    };
  }
}
