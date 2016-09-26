"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _react2.default.createClass({
    displayName: "Pushtell.Variant",
    propTypes: {
        name: _react2.default.PropTypes.string.isRequired
    },
    render: function render() {
        if (_react2.default.isValidElement(this.props.children)) {
            return this.props.children;
        } else {
            return _react2.default.createElement(
                "span",
                null,
                this.props.children
            );
        }
    }
});
module.exports = exports['default'];