let store;

const noopStore = {
  getItem: function(){},
  setItem: function(){}
};

if (typeof window !== 'undefined' && 'localStorage' in window && window['localStorage'] !== null) {
  try {
    let key = '__pushtell_react__';
    window.localStorage.setItem(key, key);
    if (window.localStorage.getItem(key) !== key) {
      store = noopStore;
    } else {
      window.localStorage.removeItem(key);
      store = window.localStorage;
    }
  } catch (e) {
    store = noopStore;
  }
} else {
  store = noopStore;
}

export default store;