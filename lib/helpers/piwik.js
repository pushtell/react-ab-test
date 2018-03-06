"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _emitter = require("../emitter");

var _emitter2 = _interopRequireDefault(_emitter);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var playSubscription = void 0;
var winSubscription = void 0;

exports.default = {

    __pushPlay: function __pushPlay(experimentName, variantName) {
        window._paq.push(["trackEvent", "Simple metrics", "[Experiment] " + experimentName, variantName]);
    },

    __pushWin: function __pushWin(experimentName, variantName) {
        window._paq.push(["trackEvent", "Simple metrics WIN", "[Experiment] " + experimentName, variantName]);
    },

    enable: function enable() {
        playSubscription = _emitter2.default.addPlayListener(this.__pushPlay);
        winSubscription = _emitter2.default.addWinListener(this.__pushWin);
    },
    disable: function disable() {
        if (playSubscription) {
            playSubscription.remove();
        }

        if (winSubscription) {
            winSubscription.remove();
        }
    }
};
module.exports = exports['default'];