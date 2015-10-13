'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _emitter = require("./emitter");

var _emitter2 = _interopRequireDefault(_emitter);

var _reactLibExecutionEnvironment = require('react/lib/ExecutionEnvironment');

var _reactLibObjectAssign = require('react/lib/Object.assign');

var _reactLibObjectAssign2 = _interopRequireDefault(_reactLibObjectAssign);

if (process.env.NODE_ENV === "production" || !_reactLibExecutionEnvironment.canUseDOM) {
  module.exports = {
    enable: function enable() {},
    disable: function disable() {}
  };
} else {
  (function () {
    var list_style = {
      margin: "0",
      padding: "0 0 0 20px"
    };

    var list_item_style = {
      margin: "0",
      padding: "0",
      fontSize: "14px",
      lineHeight: "14px"
    };

    var input_style = {
      float: "left",
      margin: "0 10px 0 0",
      padding: "0",
      cursor: "pointer"
    };

    var experiment_name_style = {
      fontSize: "16px",
      color: "#000000",
      margin: "0 0 10px 0"
    };

    var variant_name_style = {
      color: "#000000",
      margin: "0 0 10px 0",
      cursor: "pointer",
      fontWeight: "normal"
    };

    var close_button_style = {
      cursor: "pointer",
      fontSize: "16px",
      color: "red",
      position: "absolute",
      top: "0px",
      right: "7px"
    };

    var container_style = {
      fontSize: "12px",
      backgroundColor: "#ebebeb",
      color: "#000000",
      padding: "5px 10px 5px 10px",
      boxShadow: "0px 0 5px rgba(0, 0, 0, 0.1)",
      border: "1px solid #b3b3b3",
      borderTopLeftRadius: "2px",
      borderTopRightRadius: "2px"
    };

    var debugger_style = (0, _reactLibObjectAssign2['default'])({}, container_style, {
      padding: "15px 40px 5px 10px"
    });

    var handle_style = (0, _reactLibObjectAssign2['default'])({}, container_style, {
      cursor: "pointer"
    });

    var note_style = {
      fontSize: "10px",
      color: "#999999",
      textAlign: "center",
      margin: "10px -40px 0 -10px",
      borderTop: "1px solid #b3b3b3",
      padding: "10px 10px 5px 10px"
    };

    var Debugger = _react2['default'].createClass({
      displayName: "Pushtell.Debugger",
      getInitialState: function getInitialState() {
        return {
          experiments: _emitter2['default'].getActiveExperiments(),
          visible: false
        };
      },
      toggleVisibility: function toggleVisibility() {
        this.setState({
          visible: !this.state.visible
        });
      },
      updateExperiments: function updateExperiments() {
        this.setState({
          experiments: _emitter2['default'].getActiveExperiments()
        });
      },
      setExperimentValue: function setExperimentValue(experimentName, variantName) {
        _emitter2['default'].setExperimentValue(experimentName, variantName);
      },
      componentWillMount: function componentWillMount() {
        this.variantSubscription = _emitter2['default'].addVariantListener(this.updateExperiments);
        this.valueSubscription = _emitter2['default'].addValueListener(this.updateExperiments);
        this.activeSubscription = _emitter2['default'].addListener("active", this.updateExperiments);
        this.inactiveSubscription = _emitter2['default'].addListener("inactive", this.updateExperiments);
      },
      componentWillUnmount: function componentWillUnmount() {
        this.variantSubscription.remove();
        this.valueSubscription.remove();
        this.activeSubscription.remove();
        this.inactiveSubscription.remove();
      },
      render: function render() {
        var _this = this;

        var experimentNames = Object.keys(this.state.experiments);
        if (this.state.visible) {
          return _react2['default'].createElement(
            'div',
            { style: debugger_style },
            _react2['default'].createElement(
              'div',
              { style: close_button_style, onClick: this.toggleVisibility },
              '×'
            ),
            _react2['default'].createElement(
              'ul',
              { style: list_style },
              experimentNames.map(function (experimentName) {
                var variantNames = Object.keys(_this.state.experiments[experimentName]);
                if (variantNames.length === 0) {
                  return;
                }
                return _react2['default'].createElement(
                  'li',
                  { key: experimentName },
                  _react2['default'].createElement(
                    'div',
                    { style: experiment_name_style },
                    experimentName
                  ),
                  _react2['default'].createElement(
                    'ul',
                    { style: list_style },
                    variantNames.map(function (variantName) {
                      return _react2['default'].createElement(
                        'li',
                        { style: list_item_style, key: variantName },
                        _react2['default'].createElement(
                          'label',
                          { style: variant_name_style, onClick: _this.setExperimentValue.bind(_this, experimentName, variantName) },
                          _react2['default'].createElement('input', { style: input_style, type: 'radio', name: experimentName, defaultChecked: _this.state.experiments[experimentName][variantName] }),
                          _this.state.experiments[experimentName][variantName] ? _react2['default'].createElement(
                            'b',
                            null,
                            variantName
                          ) : { variantName: variantName }
                        )
                      );
                    })
                  )
                );
              })
            ),
            _react2['default'].createElement(
              'div',
              { style: note_style },
              'This panel is hidden on production builds.'
            )
          );
        } else if (experimentNames.length > 0) {
          return _react2['default'].createElement(
            'div',
            { style: handle_style, onClick: this.toggleVisibility },
            experimentNames.length,
            ' Experiment',
            experimentNames.length > 1 ? "s" : "",
            ' ▲'
          );
        } else {
          return null;
        }
      }
    });

    module.exports = {
      enable: function enable() {
        var body = document.getElementsByTagName('body')[0];
        var container = document.createElement('div');
        container.id = 'pushtell-react-ab-test-debugger';
        container.style.zIndex = "25000";
        container.style.position = "fixed";
        container.style.transform = "translateX(-50%)";
        container.style.bottom = "0";
        container.style.left = "50%";
        body.appendChild(container);
        _react2['default'].render(_react2['default'].createElement(Debugger, null), container);
      },
      disable: function disable() {
        var body = document.getElementsByTagName('body')[0];
        var container = document.getElementById('pushtell-react-ab-test-debugger');
        if (container) {
          _react2['default'].unmountComponentAtNode(container);
          body.removeChild(container);
        }
      }
    };
  })();
}