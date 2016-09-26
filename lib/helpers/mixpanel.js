"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _ExecutionEnvironment = require("fbjs/lib/ExecutionEnvironment");

var _emitter = require("../emitter");

var _emitter2 = _interopRequireDefault(_emitter);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var playSubscription = void 0,
    winSubscription = void 0;

exports.default = {
    enable: function enable() {
        if (_ExecutionEnvironment.canUseDOM) {
            if (typeof mixpanel === "undefined") {
                var error = new Error("React A/B Test Mixpanel Helper: 'mixpanel' global is not defined.");
                error.type = "PUSHTELL_HELPER_MISSING_GLOBAL";
                throw error;
            }
            playSubscription = _emitter2.default.addPlayListener(function (experimentName, variantName) {
                mixpanel.track("Experiment Play", {
                    "Experiment": experimentName,
                    "Variant": variantName
                }, function () {
                    _emitter2.default.emit("mixpanel-play", experimentName, variantName);
                });
            });
            winSubscription = _emitter2.default.addWinListener(function (experimentName, variantName) {
                mixpanel.track("Experiment Win", {
                    "Experiment": experimentName,
                    "Variant": variantName
                }, function () {
                    _emitter2.default.emit("mixpanel-win", experimentName, variantName);
                });
            });
        }
    },
    disable: function disable() {
        if (_ExecutionEnvironment.canUseDOM) {
            if (!playSubscription || !winSubscription) {
                var error = new Error("React A/B Test Mixpanel Helper: Helper was not enabled.");
                error.type = "PUSHTELL_HELPER_INVALID_DISABLE";
                throw error;
            }
            playSubscription.remove();
            winSubscription.remove();
        }
    }
};
module.exports = exports['default'];