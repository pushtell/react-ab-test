import {EventEmitter} from 'fbemitter';

const values = {};
const experiments = {};
const activeExperiments = {};
const experimentsWithDefinedVariants = {};

class PushtellEventEmitter extends EventEmitter {
  emitWin(experimentName){
    if(typeof experimentName !== 'string') {
      throw new Error("Required argument 'experimentName' should have type 'string'");
    }
    this.emit("win", experimentName, values[experimentName]);
  }
  _incrementActiveExperiments(experimentName) {
    activeExperiments[experimentName] = activeExperiments[experimentName] || 0;
    activeExperiments[experimentName] += 1;
    this.emit("active", experimentName);
  }
  _decrementActiveExperiments(experimentName) {
    activeExperiments[experimentName] -= 1;
    this.emit("inactive", experimentName);
  }
  addActiveVariantListener(experimentName, callback) {
    if(typeof experimentName === "function") {
      callback = experimentName;
      return this.addListener("active-variant", (_experimentName, variantName, passthrough) => {
        callback(_experimentName, variantName, passthrough);
      });
    }
    return this.addListener("active-variant", (_experimentName, variantName, passthrough) => {
      if(_experimentName === experimentName) {
        callback(_experimentName, variantName, passthrough);
      }
    });
  }
  addPlayListener(experimentName, callback) {
    if(typeof experimentName === "function") {
      callback = experimentName;
      return this.addListener('play', (_experimentName, variantName) => {
        callback(_experimentName, variantName);
      });
    }
    return this.addListener('play', (_experimentName, variantName) => {
      if(_experimentName === experimentName) {
        callback(_experimentName, variantName);
      }
    });
  }
  addWinListener(experimentName, callback) {
    if(typeof experimentName === "function") {
      callback = experimentName;
      return this.addListener('win', (_experimentName, variantName) => {
        callback(_experimentName, variantName);
      });
    }
    return this.addListener('win', (_experimentName, variantName) => {
      if(_experimentName === experimentName) {
        callback(_experimentName, variantName);
      }
    });
  }
  defineVariants(experimentName, variantNames){
    let variants = {}
    variantNames.forEach(variantName => {
      variants[variantName] = true;
    });
    experiments[experimentName] = variants;
    experimentsWithDefinedVariants[experimentName] = true;
  }
  getSortedVariants(experimentName) {
    let names = Object.keys(experiments[experimentName]);
    names.sort();
    return names;
  }
  getActiveExperiments(){
    let response = {};
    Object.keys(activeExperiments).forEach(experimentName => {
      if(activeExperiments[experimentName] === 0) {
        return;
      }
      response[experimentName] = {};
      Object.keys(experiments[experimentName]).forEach(variantName => {
        response[experimentName][variantName] = values[experimentName] === variantName;
      });
    });
    return response;
  }
  getActiveVariant(experimentName){
    return values[experimentName];
  }
  setActiveVariant(experimentName, variantName, passthrough){
    values[experimentName] = variantName;
    this.emit("active-variant", experimentName, variantName, passthrough);
  }
  addExperimentVariant(experimentName, variantName){
    experiments[experimentName] = experiments[experimentName] || {};
    if(experiments[experimentName][variantName] !== true) {
      if(experimentsWithDefinedVariants[experimentName]) {
        const error = new Error("Expiriment “" + experimentName + "” added new variants after variants were defined.");
        error.type = "PUSHTELL_INVALID_VARIANT";
        throw error;
      }
      if(values[experimentName]) {
        const error = new Error("Expiriment “" + experimentName + "” added new variants after a variant was selected. Declare the variant names using emitter.addExpirimentVariants(expirimentName, variantNames).");
        error.type = "PUSHTELL_INVALID_VARIANT";
        throw error;
      }
      experiments[experimentName][variantName] = true;
    } else {
      experiments[experimentName][variantName] = true;
    }
  }
}

export default new PushtellEventEmitter();