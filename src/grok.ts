export interface GrokConversation {
  data: {
    create_grok_conversation: {
      conversation_id: string;
    };
  };
}

export interface GrokRequest {
  responses: GrokResponseMessage[];
  systemPromptName: string;
  grokModelOptionId: string;
  conversationId: string;
  returnSearchResults: boolean;
  returnCitations: boolean;
  promptMetadata: {
    promptSource: string;
    action: string;
  };
  imageGenerationCount: number;
  requestFeatures: {
    eagerTweets: boolean;
    serverHistory: boolean;
  };
}

// Types for the user-facing API
export interface GrokMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface GrokChatOptions {
  messages: GrokMessage[];
  conversationId?: string; // Optional - will create new if not provided
  returnSearchResults?: boolean;
  returnCitations?: boolean;
}

// Internal types for API requests
export interface GrokResponseMessage {
  message: string;
  sender: 1 | 2; // 1 = user, 2 = assistant
  promptSource?: string;
  fileAttachments?: any[];
}

// Rate limit information
export interface GrokRateLimit {
  isRateLimited: boolean;
  message: string;
  upsellInfo?: {
    usageLimit: string;
    quotaDuration: string;
    title: string;
    message: string;
  };
}

export interface GrokChatResponse {
  conversationId: string;
  message: string;
  messages: GrokMessage[];
  webResults?: any[];
  metadata?: any;
  rateLimit?: GrokRateLimit;
}
