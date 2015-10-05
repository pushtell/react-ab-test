import {EventEmitter} from 'fbemitter';

const values = {};

class PushtellEventEmitter extends EventEmitter {
  win(experimentName){
    if(typeof experimentName !== 'string') {
      throw new Error("Required argument 'experimentName' should have type 'string'");
    }
    this.emit("win", experimentName, values[experimentName]);
  }
  addExperimentVariant(experimentName, variantName){
    values[experimentName] = variantName;
  }
}

export default new PushtellEventEmitter();