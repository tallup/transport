class OfflineManager {
  constructor() {
    this.isOnline = navigator.onLine;
    this.pendingActions = [];
    this.init();
  }

  init() {
    window.addEventListener('online', () => this.handleOnline());
    window.addEventListener('offline', () => this.handleOffline());
    
    // Load pending actions from localStorage
    this.loadPendingActions();
  }

  handleOnline() {
    this.isOnline = true;
    this.syncPendingActions();
    this.dispatchEvent('online');
  }

  handleOffline() {
    this.isOnline = false;
    this.dispatchEvent('offline');
  }

  queueAction(action) {
    this.pendingActions.push({
      ...action,
      timestamp: Date.now(),
    });
    this.savePendingActions();
  }

  async syncPendingActions() {
    if (this.pendingActions.length === 0) return;

    const actions = [...this.pendingActions];
    this.pendingActions = [];

    for (const action of actions) {
      try {
        await this.executeAction(action);
      } catch (error) {
        console.error('Failed to sync action:', error);
        // Re-queue failed actions
        this.pendingActions.push(action);
      }
    }

    this.savePendingActions();
  }

  async executeAction(action) {
    const { type, url, method, data } = action;

    const response = await fetch(url, {
      method: method || 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content || '',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Action failed: ${response.statusText}`);
    }

    return response.json();
  }

  savePendingActions() {
    try {
      localStorage.setItem('pendingActions', JSON.stringify(this.pendingActions));
    } catch (error) {
      console.error('Failed to save pending actions:', error);
    }
  }

  loadPendingActions() {
    try {
      const stored = localStorage.getItem('pendingActions');
      if (stored) {
        this.pendingActions = JSON.parse(stored);
      }
    } catch (error) {
      console.error('Failed to load pending actions:', error);
    }
  }

  dispatchEvent(eventName) {
    window.dispatchEvent(new CustomEvent(`offline:${eventName}`));
  }

  getStatus() {
    return {
      isOnline: this.isOnline,
      pendingActions: this.pendingActions.length,
    };
  }
}

export default new OfflineManager();



