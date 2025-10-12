export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  problemId?: string;
  metadata?: {
    language?: string;
    complexity?: any;
    analysis?: any;
  };
}

export interface ChatConversation {
  id: string;
  problemId: string;
  title: string;
  messages: ChatMessage[];
  createdAt: number;
  updatedAt: number;
}

class ChatStorageService {
  private dbName = 'CodeChatDB';
  private dbVersion = 1;
  private db: IDBDatabase | null = null;

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        //create conversations store
        if (!db.objectStoreNames.contains('conversations')) {
          const conversationStore = db.createObjectStore('conversations', { keyPath: 'id' });
          conversationStore.createIndex('problemId', 'problemId', { unique: false });
          conversationStore.createIndex('updatedAt', 'updatedAt', { unique: false });
        }

        //create messages store
        if (!db.objectStoreNames.contains('messages')) {
          const messageStore = db.createObjectStore('messages', { keyPath: 'id' });
          messageStore.createIndex('conversationId', 'conversationId', { unique: false });
          messageStore.createIndex('timestamp', 'timestamp', { unique: false });
        }
      };
    });
  }

  private async ensureDB(): Promise<IDBDatabase> {
    if (!this.db) {
      await this.init();
    }
    return this.db!;
  }

  async saveConversation(conversation: ChatConversation): Promise<void> {
    const db = await this.ensureDB();
    const transaction = db.transaction(['conversations'], 'readwrite');
    const store = transaction.objectStore('conversations');

    return new Promise((resolve, reject) => {
      const request = store.put(conversation);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async getConversation(problemId: string): Promise<ChatConversation | null> {
    const db = await this.ensureDB();
    const transaction = db.transaction(['conversations'], 'readonly');
    const store = transaction.objectStore('conversations');
    const index = store.index('problemId');

    return new Promise((resolve, reject) => {
      const request = index.get(problemId);
      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });
  }

  async getAllConversations(): Promise<ChatConversation[]> {
    const db = await this.ensureDB();
    const transaction = db.transaction(['conversations'], 'readonly');
    const store = transaction.objectStore('conversations');
    const index = store.index('updatedAt');

    return new Promise((resolve, reject) => {
      const request = index.getAll();
      request.onsuccess = () => {
        const conversations = request.result.sort((a, b) => b.updatedAt - a.updatedAt);
        resolve(conversations);
      };
      request.onerror = () => reject(request.error);
    });
  }

  async addMessage(conversationId: string, message: ChatMessage): Promise<void> {
    const db = await this.ensureDB();
    const transaction = db.transaction(['conversations', 'messages'], 'readwrite');

    //add message to messages store
    const messageStore = transaction.objectStore('messages');
    const messageWithConversationId = { ...message, conversationId };

    return new Promise((resolve, reject) => {
      const addMessageRequest = messageStore.add(messageWithConversationId);

      addMessageRequest.onsuccess = () => {
        //update conversation timestamp
        const conversationStore = transaction.objectStore('conversations');
        const getConversationRequest = conversationStore.get(conversationId);

        getConversationRequest.onsuccess = () => {
          const conversation = getConversationRequest.result;
          if (conversation) {
            conversation.messages.push(message);
            conversation.updatedAt = Date.now();

            const updateRequest = conversationStore.put(conversation);
            updateRequest.onsuccess = () => resolve();
            updateRequest.onerror = () => reject(updateRequest.error);
          } else {
            resolve();
          }
        };

        getConversationRequest.onerror = () => reject(getConversationRequest.error);
      };

      addMessageRequest.onerror = () => reject(addMessageRequest.error);
    });
  }

  async getMessages(conversationId: string): Promise<ChatMessage[]> {
    const db = await this.ensureDB();
    const transaction = db.transaction(['messages'], 'readonly');
    const store = transaction.objectStore('messages');
    const index = store.index('conversationId');

    return new Promise((resolve, reject) => {
      const request = index.getAll(conversationId);
      request.onsuccess = () => {
        const messages = request.result
          .map(msg => ({ ...msg, conversationId: undefined })) //remove conversationId from result
          .sort((a, b) => a.timestamp - b.timestamp);
        resolve(messages);
      };
      request.onerror = () => reject(request.error);
    });
  }

  async deleteConversation(conversationId: string): Promise<void> {
    const db = await this.ensureDB();
    const transaction = db.transaction(['conversations', 'messages'], 'readwrite');

    //delete messages
    const messageStore = transaction.objectStore('messages');
    const messageIndex = messageStore.index('conversationId');
    const deleteMessagesRequest = messageIndex.getAllKeys(conversationId);

    deleteMessagesRequest.onsuccess = () => {
      const messageKeys = deleteMessagesRequest.result;
      messageKeys.forEach(key => {
        messageStore.delete(key);
      });

      //delete conversation
      const conversationStore = transaction.objectStore('conversations');
      conversationStore.delete(conversationId);
    };

    return new Promise((resolve, reject) => {
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
    });
  }
}

export const chatStorage = new ChatStorageService();
