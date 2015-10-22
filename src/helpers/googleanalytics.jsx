import emitter from "../emitter";
import {canUseDOM} from 'fbjs/lib/ExecutionEnvironment';

let playSubscription, winSubscription;

export default {
  enable(){
    if(canUseDOM) {
      if(typeof ga === "undefined") {
        const error = new Error("React A/B Test Google Analytics Helper: 'ga' global is not defined.");
        error.type = "PUSHTELL_HELPER_MISSING_GLOBAL";
        throw error;
      }
      playSubscription = emitter.addPlayListener(function(experimentName, variantName){
        ga('send', 'event', "Experiment", "Play", experimentName, null, {
          nonInteraction: true
        });
        emitter.emit("googleanalytics-play", experimentName, variantName);
      });
      winSubscription = emitter.addWinListener(function(experimentName, variantName){
        ga('send', 'event', "Experiment", "Win", experimentName, null, {
          nonInteraction: true
        });
        emitter.emit("googleanalytics-win", experimentName, variantName);
      });
    }
  },
  disable(){
    if(canUseDOM) {
      if(!playSubscription || !winSubscription) {
        const error = new Error("React A/B Test Google Analytics Helper: Helper was not enabled.");
        error.type = "PUSHTELL_HELPER_INVALID_DISABLE";
        throw error;
      }
      playSubscription.remove();
      winSubscription.remove();
    }
  }
}
