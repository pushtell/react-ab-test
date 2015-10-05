import {EventEmitter} from 'fbemitter';

const values = {};
const experiments = {};

class PushtellEventEmitter extends EventEmitter {
  emitWin(experimentName){
    if(typeof experimentName !== 'string') {
      throw new Error("Required argument 'experimentName' should have type 'string'");
    }
    this.emit("win", experimentName, values[experimentName]);
  }
  addVariantListener(experimentName, callback) {
    return this.addListener('variant', (_experimentName, variantName) => {
      if(_experimentName === experimentName) {
        callback(variantName);
      }
    });
  }
  addValueListener(experimentName, callback) {
    return this.addListener('value', (_experimentName, variantName) => {
      if(_experimentName === experimentName) {
        callback(variantName);
      }
    });
  }
  addPlayListener(experimentName, callback) {
    return this.addListener('play', (_experimentName, variantName) => {
      if(_experimentName === experimentName) {
        callback(variantName);
      }
    });
  }
  addWinListener(experimentName, callback) {
    return this.addListener('win', (_experimentName, variantName) => {
      if(_experimentName === experimentName) {
        callback(variantName);
      }
    });
  }
  addExperimentVariants(experimentName, variantNames){
    experiments[experimentName] = experiments[experimentName] || {};
    variantNames.forEach(variantName => {
      if(experiments[experimentName][variantName] !== true) {
        this.emit("variant", experimentName, variantName);
      }
      experiments[experimentName][variantName] = true;
    });
  }
  getSortedVariants(experimentName) {
    let names = Object.keys(experiments[experimentName]);
    names.sort();
    return names;
  }
  setExperimentValue(experimentName, variantName){
    values[experimentName] = variantName;
    this.emit("value", experimentName, variantName);
  }
  addExperimentVariant(experimentName, variantName){
    experiments[experimentName] = experiments[experimentName] || {};
    if(experiments[experimentName][variantName] !== true) {
      if(values[experimentName]) {
        const error = new Error("Expiriment “" + experimentName + "” added new variants after a variant was selected. Declare the variant names using emitter.addExpirimentVariants(expirimentName, variantNames).");
        error.type = "PUSHTELL_INVALID_VARIANT";
        throw error;
      }
      this.emit("variant", experimentName, variantName);
    }
    experiments[experimentName][variantName] = true;
  }
}

export default new PushtellEventEmitter();