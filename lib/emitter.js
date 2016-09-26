'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _fbemitter = require('fbemitter');

var values = {};
var experiments = {};
var experimentWeights = {};
var activeExperiments = {};
var experimentsWithDefinedVariants = {};
var playedExperiments = {};

var emitter = new _fbemitter.EventEmitter();

var PushtellEventEmitter = function PushtellEventEmitter() {};

PushtellEventEmitter.prototype.emitWin = function (experimentName) {
    if (typeof experimentName !== 'string') {
        throw new Error("Required argument 'experimentName' should have type 'string'");
    }
    emitter.emit("win", experimentName, values[experimentName]);
};

PushtellEventEmitter.prototype._emitPlay = function (experimentName, variantName) {
    if (typeof experimentName !== 'string') {
        throw new Error("Required argument 'experimentName' should have type 'string'");
    }
    if (typeof variantName !== 'string') {
        throw new Error("Required argument 'variantName' should have type 'string'");
    }
    if (!playedExperiments[experimentName]) {
        emitter.emit('play', experimentName, variantName);
        playedExperiments[experimentName] = true;
    }
};

PushtellEventEmitter.prototype._resetPlayedExperiments = function () {
    values = {};
    playedExperiments = {};
};

PushtellEventEmitter.prototype._reset = function () {
    values = {};
    experiments = {};
    experimentWeights = {};
    activeExperiments = {};
    experimentsWithDefinedVariants = {};
    playedExperiments = {};
};

PushtellEventEmitter.prototype._incrementActiveExperiments = function (experimentName) {
    activeExperiments[experimentName] = activeExperiments[experimentName] || 0;
    activeExperiments[experimentName] += 1;
    emitter.emit("active", experimentName);
};

PushtellEventEmitter.prototype._decrementActiveExperiments = function (experimentName) {
    activeExperiments[experimentName] -= 1;
    emitter.emit("inactive", experimentName);
};

PushtellEventEmitter.prototype.addActiveVariantListener = function (experimentName, callback) {
    if (typeof experimentName === "function") {
        callback = experimentName;
        return emitter.addListener("active-variant", function (_experimentName, variantName, passthrough) {
            callback(_experimentName, variantName, passthrough);
        });
    }
    return emitter.addListener("active-variant", function (_experimentName, variantName, passthrough) {
        if (_experimentName === experimentName) {
            callback(_experimentName, variantName, passthrough);
        }
    });
};

PushtellEventEmitter.prototype.emit = function () {
    return emitter.emit.apply(emitter, arguments);
};

PushtellEventEmitter.prototype.addListener = function (eventName, callback) {
    return emitter.addListener(eventName, callback);
};

PushtellEventEmitter.prototype.once = function (eventName, callback) {
    return emitter.once(eventName, callback);
};

PushtellEventEmitter.prototype.addPlayListener = function (experimentName, callback) {
    if (typeof experimentName === "function") {
        callback = experimentName;
        return emitter.addListener('play', function (_experimentName, variantName) {
            callback(_experimentName, variantName);
        });
    }
    return emitter.addListener('play', function (_experimentName, variantName) {
        if (_experimentName === experimentName) {
            callback(_experimentName, variantName);
        }
    });
};

PushtellEventEmitter.prototype.addWinListener = function (experimentName, callback) {
    if (typeof experimentName === "function") {
        callback = experimentName;
        return emitter.addListener('win', function (_experimentName, variantName) {
            callback(_experimentName, variantName);
        });
    }
    return emitter.addListener('win', function (_experimentName, variantName) {
        if (_experimentName === experimentName) {
            callback(_experimentName, variantName);
        }
    });
};

PushtellEventEmitter.prototype.defineVariants = function (experimentName, variantNames, variantWeights) {
    var variantsNamesMap = {};
    var variantWeightsMap = {};
    variantNames.forEach(function (variantName) {
        variantsNamesMap[variantName] = true;
    });
    if (Array.isArray(variantWeights)) {
        if (variantNames.length !== variantWeights.length) {
            throw new Error("Required argument 'variantNames' should have the same number of elements as optional argument 'variantWeights'");
        }
        variantNames.forEach(function (variantName, index) {
            if (typeof variantWeights[index] !== 'number') {
                throw new Error("Optional argument 'variantWeights' should be an array of numbers.");
            }
            variantWeightsMap[variantName] = variantWeights[index];
        });
    } else {
        variantNames.forEach(function (variantName, index) {
            variantWeightsMap[variantName] = 1;
        });
    }
    experimentWeights[experimentName] = variantWeightsMap;
    experiments[experimentName] = variantsNamesMap;
    experimentsWithDefinedVariants[experimentName] = true;
};

PushtellEventEmitter.prototype.getSortedVariants = function (experimentName) {
    var variantNames = Object.keys(experiments[experimentName]);
    variantNames.sort();
    return variantNames;
};

PushtellEventEmitter.prototype.getSortedVariantWeights = function (experimentName) {
    return this.getSortedVariants(experimentName).map(function (variantName) {
        return experimentWeights[experimentName][variantName];
    });
};

PushtellEventEmitter.prototype.getActiveExperiments = function () {
    var response = {};
    Object.keys(activeExperiments).forEach(function (experimentName) {
        if (activeExperiments[experimentName] === 0) {
            return;
        }
        response[experimentName] = {};
        Object.keys(experiments[experimentName]).forEach(function (variantName) {
            response[experimentName][variantName] = values[experimentName] === variantName;
        });
    });
    return response;
};

PushtellEventEmitter.prototype.getActiveVariant = function (experimentName) {
    return values[experimentName];
};

PushtellEventEmitter.prototype.setActiveVariant = function (experimentName, variantName, passthrough) {
    values[experimentName] = variantName;
    emitter.emit("active-variant", experimentName, variantName, passthrough);
};

PushtellEventEmitter.prototype.addExperimentVariant = function (experimentName, variantName) {
    experiments[experimentName] = experiments[experimentName] || {};
    experimentWeights[experimentName] = experimentWeights[experimentName] || {};
    if (experiments[experimentName][variantName] !== true) {
        if (experimentsWithDefinedVariants[experimentName]) {
            var error = new Error("Experiment “" + experimentName + "” added new variants after variants were defined.");
            error.type = "PUSHTELL_INVALID_VARIANT";
            throw error;
        }
        if (values[experimentName]) {
            var _error = new Error("Experiment “" + experimentName + "” added new variants after a variant was selected. Declare the variant names using emitter.defineVariants(experimentName, variantNames).");
            _error.type = "PUSHTELL_INVALID_VARIANT";
            throw _error;
        }
        experimentWeights[experimentName][variantName] = 1;
    }
    experiments[experimentName][variantName] = true;
};

exports.default = new PushtellEventEmitter();
module.exports = exports['default'];