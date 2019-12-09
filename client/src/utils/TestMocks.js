var localStorageMock = (function() {
  var store = {
    token: process.env.REACT_APP_FAKE_TOKEN
  };
  console.log(process.env.REACT_APP_FAKE_TOKEN)
  return {
    getItem: function(key) {
      console.log(key, store[key])
      return store[key] || null;
    },
    setItem: function(key, value) {
      store[key] = (value || '').toString();
    },
    clear: function() {
      store = {};
    }
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

Object.defineProperty(window.document, 'cookie', {
  writable: true,
  value: '_ga=' + process.env.REACT_APP_FAKE_COOKIE
});

window.scrollTo = () => {};