class LocalStorageMock {
  constructor() {
    this.store = {};
  }

  clear() {
    this.store = {};
  }

  getItem(key) {
    console.log("ici")
    return this.store[key] || null;
  }

  setItem(key, value) {
    console.log("là")
    this.store[key] = (value || '').toString();
  }

  removeItem(key) {
    delete this.store[key];
  }
};

global.localStorage = new LocalStorageMock;