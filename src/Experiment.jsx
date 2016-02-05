import React from "react";
import CoreExperiment from "./CoreExperiment";
import emitter from "./emitter";
import crc32 from "fbjs/lib/crc32";

let store;

const noopStore = {
  getItem: function(){},
  setItem: function(){}
};

if(typeof window !== 'undefined' && 'localStorage' in window && window['localStorage'] !== null) {
  try {
    let key = '__pushtell_react__';
    window.localStorage.setItem(key, key);
    if (window.localStorage.getItem(key) !== key) {
      store = noopStore;
    } else {
      window.localStorage.removeItem(key);
      store = window.localStorage;
    }
  } catch(e) {
    store = noopStore;
  }
} else {
  store = noopStore;
}

emitter.addActiveVariantListener(function(experimentName, variantName, skipSave){
  if(skipSave) {
    return;
  }
  store.setItem('PUSHTELL-' + experimentName, variantName);
});

export default React.createClass({
  displayName: "Pushtell.Experiment",
  propTypes: {
    name: React.PropTypes.string.isRequired,
    defaultVariantName: React.PropTypes.string,
    userIdentifier: React.PropTypes.string
  },
  win(){
    emitter.emitWin(this.props.name);
  },
  getLocalStorageValue() {
    const activeValue = emitter.getActiveVariant(this.props.name);
    if(typeof activeValue === "string") {
      return activeValue;
    }
    const storedValue = store.getItem('PUSHTELL-' + this.props.name);
    if(typeof storedValue === "string") {
      emitter.setActiveVariant(this.props.name, storedValue, true);
      return storedValue;
    }
    if(typeof this.props.defaultVariantName === 'string') {
      emitter.setActiveVariant(this.props.name, this.props.defaultVariantName);
      return this.props.defaultVariantName;
    }
    const variants = emitter.getSortedVariants(this.props.name);
    const weights = emitter.getSortedVariantWeights(this.props.name);
    const weightSum = weights.reduce((a, b) => {return a + b;}, 0);
    let weightedIndex = typeof this.props.userIdentifier === 'string' ? Math.abs(crc32(this.props.userIdentifier) % weightSum) : Math.floor(Math.random() * weightSum);
    let randomValue = variants[variants.length - 1];
    for (let index = 0; index < weights.length; index++) {
      weightedIndex -= weights[index];
      if (weightedIndex < 0) {
        randomValue = variants[index];
        break;
      }
    }
    emitter.setActiveVariant(this.props.name, randomValue);
    return randomValue;
  },
  render() {
    return <CoreExperiment {...this.props} value={this.getLocalStorageValue} />;
  }
});