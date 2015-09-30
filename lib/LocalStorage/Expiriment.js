"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _Expiriment = require("../Expiriment");

var _Expiriment2 = _interopRequireDefault(_Expiriment);

var _store = require("store");

var _store2 = _interopRequireDefault(_store);

exports["default"] = _react2["default"].createClass({
  displayName: "Pushtell.LocalStorage.Expiriment",
  propTypes: {
    defaultValue: _react2["default"].PropTypes.string,
    variantNames: _react2["default"].PropTypes.array,
    name: _react2["default"].PropTypes.string.isRequired,
    onPlay: _react2["default"].PropTypes.func,
    onWin: _react2["default"].PropTypes.func
  },
  statics: {
    win: _Expiriment2["default"].win
  },
  componentWillMount: function componentWillMount() {
    var storedValue = _store2["default"].get('PUSHTELL-' + this.props.name);
    if (typeof storedValue !== "undefined") {
      return this.setState({
        value: storedValue
      });
    }
    if (typeof this.props.defaultValue !== 'undefined') {
      _store2["default"].set('PUSHTELL-' + this.props.name, this.props.defaultValue);
      return this.setState({
        value: this.props.defaultValue
      });
    }
    var variantNames = Object.keys(_Expiriment2["default"].expiriments[this.props.name]);
    var randomValue = variantNames[Math.floor(Math.random() * variantNames.length)];
    _store2["default"].set('PUSHTELL-' + this.props.name, randomValue);
    return this.setState({
      value: randomValue
    });
  },
  render: function render() {
    return _react2["default"].createElement(_Expiriment2["default"], _extends({}, this.props, this.state));
  }
});
module.exports = exports["default"];