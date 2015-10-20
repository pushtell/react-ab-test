import emitter from "../emitter";
import {canUseDOM} from 'fbjs/lib/ExecutionEnvironment';

let playSubscription, winSubscription;

export default {
  enable(){
    if(canUseDOM) {
      if(typeof analytics === "undefined") {
        const error = new Error("React A/B Test Segment Helper: 'analytics' global is not defined.");
        error.type = "PUSHTELL_HELPER_MISSING_GLOBAL";
        throw error;
      }
      playSubscription = emitter.addPlayListener(function(experimentName, variantName){
        analytics.track("Experiment Play", {
          "Experiment": experimentName,
          "Variant": variantName
        }, function(){
          emitter.emit("segment-play", experimentName, variantName);
        });
      });
      winSubscription = emitter.addWinListener(function(experimentName, variantName){
        analytics.track("Experiment Win", {
          "Experiment": experimentName,
          "Variant": variantName
        }, function(){
          emitter.emit("segment-win", experimentName, variantName);
        });
      });
    }
  },
  disable(){
    if(canUseDOM) {
      if(!playSubscription || !winSubscription) {
        const error = new Error("React A/B Test Segment Helper: Helper was not enabled.");
        error.type = "PUSHTELL_HELPER_INVALID_DISABLE";
        throw error;
      }
      playSubscription.remove();
      winSubscription.remove();
    }
  }
}
