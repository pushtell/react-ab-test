import emitter from "../emitter";
import {canUseDOM} from 'fbjs/lib/ExecutionEnvironment';

let playSubscription, winSubscription;

export default {
  enable(){
    if(canUseDOM) {
      if(typeof mixpanel === "undefined") {
        const error = new Error("React A/B Test Mixpanel Helper: 'mixpanel' global is not defined.");
        error.type = "PUSHTELL_MIXPANEL_MISSING";
        throw error;
      }
      playSubscription = emitter.addPlayListener(function(experimentName, variantName){
        mixpanel.track("Experiment Play", {
          "Experiment": experimentName,
          "Variant": variantName
        }, function(){
          emitter.emit("mixpanel-play", experimentName, variantName);
        });
      });
      winSubscription = emitter.addWinListener(function(experimentName, variantName){
        mixpanel.track("Experiment Win", {
          "Experiment": experimentName,
          "Variant": variantName
        }, function(){
          emitter.emit("mixpanel-win", experimentName, variantName);
        });
      });
    }
  },
  disable(){
    if(canUseDOM) {
      if(!playSubscription || !winSubscription) {
        const error = new Error("React A/B Test Mixpanel Helper: Helper was not enabled.");
        error.type = "PUSHTELL_HELPER_INVALID_DISABLE";
        throw error;
      }
      playSubscription.remove();
      winSubscription.remove();
    }
  }
}
