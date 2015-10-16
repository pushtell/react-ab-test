'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _fbemitter = require('fbemitter');

var values = {};
var experiments = {};
var activeExperiments = {};
var experimentsWithDefinedVariants = {};

var PushtellEventEmitter = (function (_EventEmitter) {
  _inherits(PushtellEventEmitter, _EventEmitter);

  function PushtellEventEmitter() {
    _classCallCheck(this, PushtellEventEmitter);

    _get(Object.getPrototypeOf(PushtellEventEmitter.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(PushtellEventEmitter, [{
    key: 'emitWin',
    value: function emitWin(experimentName) {
      if (typeof experimentName !== 'string') {
        throw new Error("Required argument 'experimentName' should have type 'string'");
      }
      this.emit("win", experimentName, values[experimentName]);
    }
  }, {
    key: '_incrementActiveExperiments',
    value: function _incrementActiveExperiments(experimentName) {
      activeExperiments[experimentName] = activeExperiments[experimentName] || 0;
      activeExperiments[experimentName] += 1;
      this.emit("active", experimentName);
    }
  }, {
    key: '_decrementActiveExperiments',
    value: function _decrementActiveExperiments(experimentName) {
      activeExperiments[experimentName] -= 1;
      this.emit("inactive", experimentName);
    }
  }, {
    key: 'addActiveVariantListener',
    value: function addActiveVariantListener(experimentName, callback) {
      if (typeof experimentName === "function") {
        callback = experimentName;
        return this.addListener("active-variant", function (_experimentName, variantName, passthrough) {
          callback(_experimentName, variantName, passthrough);
        });
      }
      return this.addListener("active-variant", function (_experimentName, variantName, passthrough) {
        if (_experimentName === experimentName) {
          callback(_experimentName, variantName, passthrough);
        }
      });
    }
  }, {
    key: 'addPlayListener',
    value: function addPlayListener(experimentName, callback) {
      if (typeof experimentName === "function") {
        callback = experimentName;
        return this.addListener('play', function (_experimentName, variantName) {
          callback(_experimentName, variantName);
        });
      }
      return this.addListener('play', function (_experimentName, variantName) {
        if (_experimentName === experimentName) {
          callback(_experimentName, variantName);
        }
      });
    }
  }, {
    key: 'addWinListener',
    value: function addWinListener(experimentName, callback) {
      if (typeof experimentName === "function") {
        callback = experimentName;
        return this.addListener('win', function (_experimentName, variantName) {
          callback(_experimentName, variantName);
        });
      }
      return this.addListener('win', function (_experimentName, variantName) {
        if (_experimentName === experimentName) {
          callback(_experimentName, variantName);
        }
      });
    }
  }, {
    key: 'defineExperimentVariants',
    value: function defineExperimentVariants(experimentName, variantNames) {
      var variants = {};
      variantNames.forEach(function (variantName) {
        variants[variantName] = true;
      });
      experiments[experimentName] = variants;
      experimentsWithDefinedVariants[experimentName] = true;
    }
  }, {
    key: 'getSortedVariants',
    value: function getSortedVariants(experimentName) {
      var names = Object.keys(experiments[experimentName]);
      names.sort();
      return names;
    }
  }, {
    key: 'getActiveExperiments',
    value: function getActiveExperiments() {
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
    }
  }, {
    key: 'getActiveVariant',
    value: function getActiveVariant(experimentName) {
      return values[experimentName];
    }
  }, {
    key: 'setActiveVariant',
    value: function setActiveVariant(experimentName, variantName, passthrough) {
      values[experimentName] = variantName;
      this.emit("active-variant", experimentName, variantName, passthrough);
    }
  }, {
    key: 'addExperimentVariant',
    value: function addExperimentVariant(experimentName, variantName) {
      experiments[experimentName] = experiments[experimentName] || {};
      if (experiments[experimentName][variantName] !== true) {
        if (experimentsWithDefinedVariants[experimentName]) {
          var error = new Error("Expiriment “" + experimentName + "” added new variants after variants were defined.");
          error.type = "PUSHTELL_INVALID_VARIANT";
          throw error;
        }
        if (values[experimentName]) {
          var error = new Error("Expiriment “" + experimentName + "” added new variants after a variant was selected. Declare the variant names using emitter.addExpirimentVariants(expirimentName, variantNames).");
          error.type = "PUSHTELL_INVALID_VARIANT";
          throw error;
        }
        experiments[experimentName][variantName] = true;
      } else {
        experiments[experimentName][variantName] = true;
      }
    }
  }]);

  return PushtellEventEmitter;
})(_fbemitter.EventEmitter);

exports['default'] = new PushtellEventEmitter();
module.exports = exports['default'];