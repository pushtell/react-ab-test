"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _emitter = require("./emitter.jsx");

var _emitter2 = _interopRequireDefault(_emitter);

var _Experiment = require("./Experiment.jsx");

var _Experiment2 = _interopRequireDefault(_Experiment);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ConditionalExperiment = function (_Component) {
    _inherits(ConditionalExperiment, _Component);

    function ConditionalExperiment() {
        var _ref;

        _classCallCheck(this, ConditionalExperiment);

        for (var _len = arguments.length, props = Array(_len), _key = 0; _key < _len; _key++) {
            props[_key] = arguments[_key];
        }

        var _this = _possibleConstructorReturn(this, (_ref = ConditionalExperiment.__proto__ || Object.getPrototypeOf(ConditionalExperiment)).call.apply(_ref, [this].concat(props)));

        _this.findDefaultVariant = function () {
            var children = _react2.default.Children.toArray(_this.props.children);

            for (var i = 0; i < children.length; i++) {
                var child = children[i];

                if (child.props.name === _emitter2.default.getDefaultVariantName(_this.props.name)) {
                    return child;
                }
            }

            return null;
        };

        _this.runTest = function () {
            if (_this.props.runTest !== undefined) {
                return _this.props.runTest;
            }
            return true;
        };

        _this.state = {
            defaultVariant: null
        };
        return _this;
    }

    _createClass(ConditionalExperiment, [{
        key: "componentWillMount",
        value: function componentWillMount() {
            if (!_emitter2.default.getDefaultVariantName(this.props.name)) {
                throw new Error("Missing default variant for experiment");
            }

            var defaultVariant = this.findDefaultVariant();

            this.setState({
                defaultVariant: defaultVariant
            });
        }
    }, {
        key: "render",
        value: function render() {
            if (this.runTest()) {
                return _react2.default.createElement(
                    _Experiment2.default,
                    this.props,
                    this.props.children
                );
            } else {
                return this.state.defaultVariant;
            }
        }
    }]);

    return ConditionalExperiment;
}(_react.Component);

ConditionalExperiment.propTypes = {
    name: _react2.default.PropTypes.string.isRequired,
    defaultVariantName: _react2.default.PropTypes.string,
    userIdentifier: _react2.default.PropTypes.string,
    runTest: _react2.default.PropTypes.bool
};
exports.default = ConditionalExperiment;
module.exports = exports['default'];