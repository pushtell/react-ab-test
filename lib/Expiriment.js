'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _fbemitter = require('fbemitter');

var expiriments = {};
var emitter = new _fbemitter.EventEmitter();

exports['default'] = _react2['default'].createClass({
  displayName: "Pushtell.Expiriment",
  propTypes: {
    name: _react2['default'].PropTypes.string.isRequired,
    variantNames: _react2['default'].PropTypes.array,
    value: _react2['default'].PropTypes.string.isRequired,
    onPlay: _react2['default'].PropTypes.func,
    onWin: _react2['default'].PropTypes.func
  },
  statics: {
    emitter: emitter,
    expiriments: expiriments,
    win: function win(expirimentName, variantName) {
      if (typeof expirimentName !== 'string') {
        throw new Error("Required argument 'expirimentName' should have type 'string'");
      }
      if (typeof variantName !== 'string') {
        throw new Error("Required argument 'variantName' should have type 'string'");
      }
      emitter.emit("win", expirimentName, variantName);
    }
  },
  getInitialState: function getInitialState() {
    var _this = this;

    expiriments[this.props.name] = expiriments[this.props.name] || {};
    if (this.props.variantNames) {
      this.props.variantNames.forEach(function (name) {
        expiriments[_this.props.name][name] = true;
      });
    }
    var children = {};
    _react2['default'].Children.forEach(this.props.children, function (element) {
      if (!_react2['default'].isValidElement(element) || element.type.displayName !== "Pushtell.Variant") {
        throw new Error("Pushtell Expiriment children must be Pushtell Variant components.");
      }
      children[element.props.name] = element;
      expiriments[_this.props.name][element.props.name] = true;
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
  winListener: function winListener(expirimentName, variantName) {
    if (!this.props.onWin) {
      return;
    }
    if (expirimentName === this.props.name) {
      this.props.onWin(variantName);
    }
  },
  componentWillMount: function componentWillMount() {
    if (this.props.onPlay) {
      this.props.onPlay(this.props.value);
    }
    emitter.emit('play', this.props.name, this.props.value);
    this.emitterSubscription = emitter.addListener('win', this.winListener);
  },
  componentWillUnmount: function componentWillUnmount() {
    this.emitterSubscription.remove();
  },
  render: function render() {
    return this.state.element;
  }
});
module.exports = exports['default'];