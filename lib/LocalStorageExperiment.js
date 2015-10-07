"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _Experiment = require("./Experiment");

var _Experiment2 = _interopRequireDefault(_Experiment);

var _emitter = require("./emitter");

var _emitter2 = _interopRequireDefault(_emitter);

var store = undefined;

var noopStore = {
  getItem: function getItem() {},
  setItem: function setItem() {}
};

if (typeof window !== 'undefined' && 'localStorage' in window && window['localStorage'] !== null) {
  try {
    var key = '__pushtell_react__';
    window.localStorage.setItem(key, key);
    if (window.localStorage.getItem(key) != key) {
      store = noopStore;
    }
    window.localStorage.removeItem(key);
    store = window.localStorage;
  } catch (e) {
    store = noopStore;
  }
} else {
  store = noopStore;
}

exports["default"] = _react2["default"].createClass({
  displayName: "Pushtell.LocalStorage.Experiment",
  propTypes: {
    name: _react2["default"].PropTypes.string.isRequired,
    defaultValue: _react2["default"].PropTypes.string
  },
  win: function win() {
    _emitter2["default"].emitWin(this.props.name);
  },
  getLocalStorageValue: function getLocalStorageValue() {
    var storedValue = store.getItem('PUSHTELL-' + this.props.name);
    if (typeof storedValue === "string") {
      return storedValue;
    }
    if (typeof this.props.defaultValue === 'string') {
      store.setItem('PUSHTELL-' + this.props.name, this.props.defaultValue);
      return this.props.defaultValue;
    }
    var variants = _emitter2["default"].getSortedVariants(this.props.name);
    var randomValue = variants[Math.floor(Math.random() * variants.length)];
    store.setItem('PUSHTELL-' + this.props.name, randomValue);
    return randomValue;
  },
  render: function render() {
    return _react2["default"].createElement(_Experiment2["default"], _extends({}, this.props, { value: this.getLocalStorageValue }));
  }
});
module.exports = exports["default"];