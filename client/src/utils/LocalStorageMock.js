class LocalStorageMock {
  constructor() {
    this.store = {
      'x-access-token': "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJfaWQiOiI1ZGIzMTRhZTkwOTc5ZjNkOGZmYTE4YjAiLCJ1c2VybmFtZSI6InNvdWZpYW5lZXhwZXJ0IiwicGFzc3dvcmQiOiJzaGExJGQ2ZTU5MmViJDEkNmYwMjBkODE3Yzc1YTAxZGYxNjY1NjIyNzVhMmMzNTljZGJlY2FhOSIsImVtYWlsIjoidHJhZHVjdGV1cjFAdGVzdC5jb20ifQ.R_Ul18uPZcR-ZIEh10SD8PJP0nAuskzf4Rcoo2GGjKY"
    };
    console.log(this.store) 
  }

  clear() {
    this.store = {};
  }

  getItem(key) {
    console.log(key)
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
window.localStorage = new LocalStorageMock;