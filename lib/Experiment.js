"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _propTypes = require("prop-types");

var _propTypes2 = _interopRequireDefault(_propTypes);

var _emitter = require("./emitter");

var _emitter2 = _interopRequireDefault(_emitter);

var _WeightedExperiment = require("./WeightedExperiment");

var _WeightedExperiment2 = _interopRequireDefault(_WeightedExperiment);

var _store = require("./store");

var _store2 = _interopRequireDefault(_store);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Experiment = function (_Component) {
    _inherits(Experiment, _Component);

    function Experiment() {
        var _ref;

        _classCallCheck(this, Experiment);

        for (var _len = arguments.length, props = Array(_len), _key = 0; _key < _len; _key++) {
            props[_key] = arguments[_key];
        }

        var _this = _possibleConstructorReturn(this, (_ref = Experiment.__proto__ || Object.getPrototypeOf(Experiment)).call.apply(_ref, [this].concat(props)));

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
            var runTest = _store2.default.available;

            if (typeof _this.props.runTest !== "undefined") {
                runTest = runTest && _this.props.runTest;
            }

            return runTest;
        };

        _this.state = {
            defaultVariant: null
        };
        return _this;
    }

    _createClass(Experiment, [{
        key: "componentWillMount",
        value: function componentWillMount() {
            if (typeof this.props.runTest !== "undefined" && !_emitter2.default.getDefaultVariantName(this.props.name)) {
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
                    _WeightedExperiment2.default,
                    this.props,
                    this.props.children
                );
            } else {
                return this.state.defaultVariant;
            }
        }
    }]);

    return Experiment;
}(_react.Component);

Experiment.propTypes = {
    name: _propTypes2.default.string.isRequired,
    defaultVariantName: _propTypes2.default.string,
    userIdentifier: _propTypes2.default.string,
    runTest: _propTypes2.default.bool
};
Experiment.displayName = "Pushtell.Experiment";
exports.default = Experiment;
module.exports = exports['default'];