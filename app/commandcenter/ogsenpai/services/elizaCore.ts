// Basic ELIZA implementation in pure TypeScript
export class ElizaCore {
  private readonly initialMessage = "Hello, I am ELIZA. How are you feeling today?";
  private readonly finalMessage = "Goodbye. It was nice talking to you.";
  
  private readonly patterns = [
    {
      pattern: /\b(I am|I'm) (.*)/i,
      response: ["Why are you $2?", "How long have you been $2?", "Do you believe it's good to be $2?"]
    },
    {
      pattern: /\b(I feel|I'm feeling) (.*)/i,
      response: ["Tell me more about feeling $2.", "Do you often feel $2?", "Why do you think you feel $2?"]
    },
    {
      pattern: /\b(I want|I need) (.*)/i,
      response: ["Why do you want $2?", "What would it mean to you if you got $2?", "How would getting $2 help you?"]
    },
    {
      pattern: /\b(what|who|when|where|why|how) (.*)/i,
      response: ["Why do you ask that?", "What do you think?", "What does that question mean to you?"]
    },
    {
      pattern: /\b(yes|no)\b/i,
      response: ["You seem quite certain.", "Are you sure?", "I see.", "I understand."]
    },
    {
      pattern: /\b(hello|hi|hey)\b/i,
      response: ["Hello... Please tell me what's on your mind.", "Hi. How are you feeling today?"]
    },
    {
      pattern: /\b(bye|goodbye)\b/i,
      response: ["Goodbye. It was nice talking to you."],
      final: true
    }
  ];

  private readonly fallbacks = [
    "Please tell me more.",
    "Let's explore that further.",
    "How does that make you feel?",
    "What do you think about that?",
    "I see. Please continue.",
    "Interesting. Can you elaborate?",
    "Why do you say that?",
    "I understand. Tell me more."
  ];

  public getInitial(): string {
    return this.initialMessage;
  }

  public getFinal(): string {
    return this.finalMessage;
  }

  public transform(input: string): { response: string; final: boolean } {
    if (!input.trim()) {
      return { response: this.getRandomFallback(), final: false };
    }

    // Check for exit commands
    if (/\b(bye|goodbye|quit|exit)\b/i.test(input)) {
      return { response: this.finalMessage, final: true };
    }

    // Try to match patterns
    for (const { pattern, response, final } of this.patterns) {
      const match = input.match(pattern);
      if (match) {
        const chosen = this.getRandomResponse(response);
        // Replace captured groups
        const finalResponse = chosen.replace(/\$(\d+)/g, (_, n) => match[n] || '');
        return { response: finalResponse, final: !!final };
      }
    }

    // If no pattern matches, use a fallback
    return { response: this.getRandomFallback(), final: false };
  }

  private getRandomResponse(responses: string[]): string {
    return responses[Math.floor(Math.random() * responses.length)];
  }

  private getRandomFallback(): string {
    return this.fallbacks[Math.floor(Math.random() * this.fallbacks.length)];
  }
} 