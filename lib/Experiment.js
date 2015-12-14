"use strict";

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _CoreExperiment = require("./CoreExperiment");

var _CoreExperiment2 = _interopRequireDefault(_CoreExperiment);

var _emitter = require("./emitter");

var _emitter2 = _interopRequireDefault(_emitter);

var _crc = require("fbjs/lib/crc32");

var _crc2 = _interopRequireDefault(_crc);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var store = undefined;

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

_emitter2.default.addActiveVariantListener(function (experimentName, variantName, skipSave) {
  if (skipSave) {
    return;
  }
  store.setItem('PUSHTELL-' + experimentName, variantName);
});

exports.default = _react2.default.createClass({
  displayName: "Pushtell.Experiment",
  propTypes: {
    name: _react2.default.PropTypes.string.isRequired,
    defaultVariantName: _react2.default.PropTypes.string,
    userIdentifier: _react2.default.PropTypes.string
  },
  win: function win() {
    _emitter2.default.emitWin(this.props.name);
  },
  getLocalStorageValue: function getLocalStorageValue() {
    var activeValue = _emitter2.default.getActiveVariant();
    if (typeof activeValue === "string") {
      return activeValue;
    }
    var storedValue = store.getItem('PUSHTELL-' + this.props.name);
    if (typeof storedValue === "string") {
      _emitter2.default.setActiveVariant(this.props.name, storedValue, true);
      return storedValue;
    }
    if (typeof this.props.defaultVariantName === 'string') {
      _emitter2.default.setActiveVariant(this.props.name, this.props.defaultVariantName);
      return this.props.defaultVariantName;
    }
    var variants = _emitter2.default.getSortedVariants(this.props.name);
    var index = typeof this.props.userIdentifier === 'string' ? Math.abs((0, _crc2.default)(this.props.userIdentifier) % variants.length) : Math.floor(Math.random() * variants.length);
    var randomValue = variants[index];
    _emitter2.default.setActiveVariant(this.props.name, randomValue);
    return randomValue;
  },
  render: function render() {
    return _react2.default.createElement(_CoreExperiment2.default, _extends({}, this.props, { value: this.getLocalStorageValue }));
  }
});
module.exports = exports['default'];