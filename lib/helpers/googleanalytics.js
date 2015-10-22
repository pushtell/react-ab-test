"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _emitter = require("../emitter");

var _emitter2 = _interopRequireDefault(_emitter);

var _fbjsLibExecutionEnvironment = require('fbjs/lib/ExecutionEnvironment');

var playSubscription = undefined,
    winSubscription = undefined;

exports["default"] = {
  enable: function enable() {
    if (_fbjsLibExecutionEnvironment.canUseDOM) {
      if (typeof ga === "undefined") {
        var error = new Error("React A/B Test Google Analytics Helper: 'ga' global is not defined.");
        error.type = "PUSHTELL_HELPER_MISSING_GLOBAL";
        throw error;
      }
      playSubscription = _emitter2["default"].addPlayListener(function (experimentName, variantName) {
        ga('send', 'event', "Experiment", "Play", experimentName, null, {
          nonInteraction: true
        });
        _emitter2["default"].emit("googleanalytics-play", experimentName, variantName);
      });
      winSubscription = _emitter2["default"].addWinListener(function (experimentName, variantName) {
        ga('send', 'event', "Experiment", "Win", experimentName, null, {
          nonInteraction: true
        });
        _emitter2["default"].emit("googleanalytics-win", experimentName, variantName);
      });
    }
  },
  disable: function disable() {
    if (_fbjsLibExecutionEnvironment.canUseDOM) {
      if (!playSubscription || !winSubscription) {
        var error = new Error("React A/B Test Google Analytics Helper: Helper was not enabled.");
        error.type = "PUSHTELL_HELPER_INVALID_DISABLE";
        throw error;
      }
      playSubscription.remove();
      winSubscription.remove();
    }
  }
};
module.exports = exports["default"];