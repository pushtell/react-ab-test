'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _warning = require('fbjs/lib/warning');

var _warning2 = _interopRequireDefault(_warning);

var _emitter = require('./emitter');

var _emitter2 = _interopRequireDefault(_emitter);

var _Variant = require('./Variant');

var _Variant2 = _interopRequireDefault(_Variant);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var CoreExperiment = function (_Component) {
  _inherits(CoreExperiment, _Component);

  function CoreExperiment(props) {
    _classCallCheck(this, CoreExperiment);

    var _this = _possibleConstructorReturn(this, (CoreExperiment.__proto__ || Object.getPrototypeOf(CoreExperiment)).call(this));

    _this.win = function () {
      _emitter2.default.emitWin(_this.props.name);
    };

    _this.state = {};
    _this.displayName = "Pushtell.CoreExperiment";


    var children = {};
    _react2.default.Children.forEach(props.children, function (element) {
      if (!_react2.default.isValidElement(element) || element.type.displayName !== "Pushtell.Variant") {
        var error = new Error("Pushtell Experiment children must be Pushtell Variant components.");
        error.type = "PUSHTELL_INVALID_CHILD";
        throw error;
      }
      children[element.props.name] = element;
      _emitter2.default.addExperimentVariant(props.name, element.props.name);
    });
    _emitter2.default.emit("variants-loaded", props.name);
    _this.state.variants = children;
    return _this;
  }

  _createClass(CoreExperiment, [{
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      if (nextProps.value !== this.props.value || nextProps.children !== this.props.children) {
        var value = typeof nextProps.value === "function" ? nextProps.value() : nextProps.value;
        var children = {};
        _react2.default.Children.forEach(nextProps.children, function (element) {
          children[element.props.name] = element;
        });
        this.setState({
          value: value,
          variants: children
        });
      }
    }
  }, {
    key: 'componentWillMount',
    value: function componentWillMount() {
      var _this2 = this;

      var value = typeof this.props.value === "function" ? this.props.value() : this.props.value;
      if (!this.state.variants[value]) {
        if ("production" !== process.env.NODE_ENV) {
          (0, _warning2.default)(true, 'Experiment “' + this.props.name + '” does not contain variant “' + value + '”');
        }
      }
      _emitter2.default._incrementActiveExperiments(this.props.name);
      _emitter2.default.setActiveVariant(this.props.name, value);
      _emitter2.default._emitPlay(this.props.name, value);
      this.setState({
        value: value
      });
      this.valueSubscription = _emitter2.default.addActiveVariantListener(this.props.name, function (experimentName, variantName) {
        _this2.setState({
          value: variantName
        });
      });
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      _emitter2.default._decrementActiveExperiments(this.props.name);
      this.valueSubscription.remove();
    }
  }, {
    key: 'render',
    value: function render() {
      return this.state.variants[this.state.value] || null;
    }
  }]);

  return CoreExperiment;
}(_react.Component);

CoreExperiment.propTypes = {
  name: _propTypes2.default.string.isRequired,
  value: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.func]).isRequired
};
exports.default = CoreExperiment;
;
module.exports = exports['default'];