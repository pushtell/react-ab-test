'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var store = void 0;

var noopStore = {
  getItem: function getItem() {},
  setItem: function setItem() {}
};

if (typeof window !== 'undefined' && 'localStorage' in window && window['localStorage'] !== null) {
  try {
    var key = '__pushtell_react__';
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

exports.default = store;
module.exports = exports['default'];