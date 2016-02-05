import {EventEmitter} from 'fbemitter';

let values = {};
let experiments = {};
let experimentWeights = {};
let activeExperiments = {};
let experimentsWithDefinedVariants = {};
let playedExperiments = {};

const emitter = new EventEmitter();

const PushtellEventEmitter = function() {};

PushtellEventEmitter.prototype.emitWin = function(experimentName){
  if(typeof experimentName !== 'string') {
    throw new Error("Required argument 'experimentName' should have type 'string'");
  }
  emitter.emit("win", experimentName, values[experimentName]);
};

PushtellEventEmitter.prototype._emitPlay = function(experimentName, variantName){
  if(typeof experimentName !== 'string') {
    throw new Error("Required argument 'experimentName' should have type 'string'");
  }
  if(typeof variantName !== 'string') {
    throw new Error("Required argument 'variantName' should have type 'string'");
  }
  if(!playedExperiments[experimentName]) {
    emitter.emit('play', experimentName, variantName);
    playedExperiments[experimentName] = true;
  }
};

PushtellEventEmitter.prototype._resetPlayedExperiments = function(){
  values = {};
  playedExperiments = {};
}

PushtellEventEmitter.prototype._reset = function(){
  values = {};
  experiments = {};
  experimentWeights = {};
  activeExperiments = {};
  experimentsWithDefinedVariants = {};
  playedExperiments = {};
}

PushtellEventEmitter.prototype._incrementActiveExperiments = function(experimentName) {
  activeExperiments[experimentName] = activeExperiments[experimentName] || 0;
  activeExperiments[experimentName] += 1;
  emitter.emit("active", experimentName);
}

PushtellEventEmitter.prototype._decrementActiveExperiments = function(experimentName) {
  activeExperiments[experimentName] -= 1;
  emitter.emit("inactive", experimentName);
}

PushtellEventEmitter.prototype.addActiveVariantListener = function(experimentName, callback) {
  if(typeof experimentName === "function") {
    callback = experimentName;
    return emitter.addListener("active-variant", (_experimentName, variantName, passthrough) => {
      callback(_experimentName, variantName, passthrough);
    });
  }
  return emitter.addListener("active-variant", (_experimentName, variantName, passthrough) => {
    if(_experimentName === experimentName) {
      callback(_experimentName, variantName, passthrough);
    }
  });
};

PushtellEventEmitter.prototype.emit = function() {
  return emitter.emit.apply(emitter, arguments);
};

PushtellEventEmitter.prototype.addListener = function(eventName, callback) {
  return emitter.addListener(eventName, callback);
};

PushtellEventEmitter.prototype.once = function(eventName, callback) {
  return emitter.once(eventName, callback);
};

PushtellEventEmitter.prototype.addPlayListener = function(experimentName, callback) {
  if(typeof experimentName === "function") {
    callback = experimentName;
    return emitter.addListener('play', (_experimentName, variantName) => {
      callback(_experimentName, variantName);
    });
  }
  return emitter.addListener('play', (_experimentName, variantName) => {
    if(_experimentName === experimentName) {
      callback(_experimentName, variantName);
    }
  });
};

PushtellEventEmitter.prototype.addWinListener = function(experimentName, callback) {
  if(typeof experimentName === "function") {
    callback = experimentName;
    return emitter.addListener('win', (_experimentName, variantName) => {
      callback(_experimentName, variantName);
    });
  }
  return emitter.addListener('win', (_experimentName, variantName) => {
    if(_experimentName === experimentName) {
      callback(_experimentName, variantName);
    }
  });
};

PushtellEventEmitter.prototype.defineVariants = function(experimentName, variantNames, variantWeights){
  const variantsNamesMap = {};
  const variantWeightsMap = {};
  variantNames.forEach(variantName => {
    variantsNamesMap[variantName] = true;
  });
  if(Array.isArray(variantWeights)) {
    if(variantNames.length !== variantWeights.length) {
      throw new Error("Required argument 'variantNames' should have the same number of elements as optional argument 'variantWeights'");
    }
    variantNames.forEach((variantName, index) => {
      if(typeof variantWeights[index] !== 'number') {
        throw new Error("Optional argument 'variantWeights' should be an array of numbers.");
      }
      variantWeightsMap[variantName] = variantWeights[index];
    });
  } else {
    variantNames.forEach((variantName, index) => {
      variantWeightsMap[variantName] = 1;
    });
  }
  experimentWeights[experimentName] = variantWeightsMap;
  experiments[experimentName] = variantsNamesMap;
  experimentsWithDefinedVariants[experimentName] = true;
};

PushtellEventEmitter.prototype.getSortedVariants = function(experimentName) {
  const variantNames = Object.keys(experiments[experimentName]);
  variantNames.sort();
  return variantNames;
};

PushtellEventEmitter.prototype.getSortedVariantWeights = function(experimentName) {
  return this.getSortedVariants(experimentName).map(function(variantName){
    return experimentWeights[experimentName][variantName];
  });
};

PushtellEventEmitter.prototype.getActiveExperiments = function(){
  const response = {};
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

PushtellEventEmitter.prototype.getActiveVariant = function(experimentName){
  return values[experimentName];
}

PushtellEventEmitter.prototype.setActiveVariant = function(experimentName, variantName, passthrough){
  values[experimentName] = variantName;
  emitter.emit("active-variant", experimentName, variantName, passthrough);
}

PushtellEventEmitter.prototype.addExperimentVariant = function(experimentName, variantName){
  experiments[experimentName] = experiments[experimentName] || {};
  experimentWeights[experimentName] = experimentWeights[experimentName] || {};
  if(experiments[experimentName][variantName] !== true) {
    if(experimentsWithDefinedVariants[experimentName]) {
      const error = new Error("Experiment “" + experimentName + "” added new variants after variants were defined.");
      error.type = "PUSHTELL_INVALID_VARIANT";
      throw error;
    }
    if(values[experimentName]) {
      const error = new Error("Experiment “" + experimentName + "” added new variants after a variant was selected. Declare the variant names using emitter.defineVariants(experimentName, variantNames).");
      error.type = "PUSHTELL_INVALID_VARIANT";
      throw error;
    }
    experimentWeights[experimentName][variantName] = 1;
  }
  experiments[experimentName][variantName] = true;
}

export default new PushtellEventEmitter();;