import emitter from "../emitter";

let playSubscription;
let winSubscription;

export default {

    __pushPlay: function(experimentName, variantName) {
        window._paq.push(["trackEvent", "Simple metrics", `[Experiment] ${experimentName}`, variantName]);
    },

    __pushWin: function(experimentName, variantName) {
        window._paq.push(["trackEvent", "Simple metrics WIN", `[Experiment] ${experimentName}`, variantName]);
    },

    enable() {
        playSubscription = emitter.addPlayListener(this.__pushPlay);
        winSubscription = emitter.addWinListener(this.__pushWin);
    },
    disable() {
        if (playSubscription) {
            playSubscription.remove();
        }

        if (winSubscription) {
            winSubscription.remove();
        }
    }
};