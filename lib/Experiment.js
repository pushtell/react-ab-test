'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _fbemitter = require('fbemitter');

var experiments = {};
var values = {};
var emitter = new _fbemitter.EventEmitter();

exports['default'] = _react2['default'].createClass({
  displayName: "Pushtell.Experiment",
  propTypes: {
    name: _react2['default'].PropTypes.string.isRequired,
    value: _react2['default'].PropTypes.string.isRequired,
    onPlay: _react2['default'].PropTypes.func,
    onWin: _react2['default'].PropTypes.func
  },
  statics: {
    emitter: emitter,
    experiments: experiments,
    win: function win(experimentName) {
      if (typeof experimentName !== 'string') {
        throw new Error("Required argument 'experimentName' should have type 'string'");
      }
      emitter.emit("win", experimentName, values[experimentName]);
    }
  },
  win: function win() {
    emitter.emit("win", this.props.name, this.props.value);
  },
  getInitialState: function getInitialState() {
    var children = {};
    _react2['default'].Children.forEach(this.props.children, function (element) {
      if (!_react2['default'].isValidElement(element) || element.type.displayName !== "Pushtell.Variant") {
        throw new Error("Pushtell Experiment children must be Pushtell Variant components.");
      }
      children[element.props.name] = element;
    });
    if (!children[this.props.value]) {
      if ("production" !== process.env.NODE_ENV) {
        console.debug('Experiment “' + this.props.name + '” does not contain variant “' + this.props.value + '”');
        console.trace();
      }
      return null;
    }
    return {
      element: children[this.props.value]
    };
  },
  winListener: function winListener(experimentName, variantName) {
    if (!this.props.onWin) {
      return;
    }
    if (experimentName === this.props.name) {
      this.props.onWin(variantName);
    }
  },
  componentWillMount: function componentWillMount() {
    if (this.props.onPlay) {
      this.props.onPlay(this.props.value);
    }
    emitter.emit('play', this.props.name, this.props.value);
    this.emitterSubscription = emitter.addListener('win', this.winListener);
    values[this.props.name] = this.props.value;
  },
  componentWillUnmount: function componentWillUnmount() {
    this.emitterSubscription.remove();
  },
  render: function render() {
    return this.state.element;
  }
});
module.exports = exports['default'];