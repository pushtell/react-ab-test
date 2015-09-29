"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

exports["default"] = _react2["default"].createClass({
  displayName: "Pushtell.Expiriment",
  propTypes: {
    name: _react2["default"].PropTypes.string.isRequired,
    value: _react2["default"].PropTypes.string.isRequired,
    onPlay: _react2["default"].PropTypes.func
  },
  getInitialState: function getInitialState() {
    var children = {};
    _react2["default"].Children.forEach(this.props.children, function (element) {
      if (!_react2["default"].isValidElement(element) || element.type.displayName !== "Pushtell.Variant") {
        throw new Error("Pushtell Expiriment children must be Pushtell Variant components.");
      }
      children[element.props.name] = element;
    });
    if (!children[this.props.value]) {
      if ("production" !== process.env.NODE_ENV) {
        console.debug('Expiriment “' + this.props.name + '” does not contain variant “' + this.props.value + '”');
        console.trace();
      }
      return null;
    }
    return {
      element: children[this.props.value]
    };
  },
  componentDidMount: function componentDidMount() {
    if (this.props.onPlay) {
      this.props.onPlay(this.props.value);
    }
  },
  render: function render() {
    return this.state.element;
  }
});
module.exports = exports["default"];