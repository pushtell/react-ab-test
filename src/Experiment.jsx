import React, {Component} from "react";
import PropTypes from 'prop-types';
import CoreExperiment from "./CoreExperiment";
import emitter from "./emitter";
import crc32 from "fbjs/lib/crc32";

let store;

const noopStore = {
  getItem: function(){},
  setItem: function(){}
};

if (typeof window !== 'undefined' && 'localStorage' in window && window['localStorage'] !== null) {
  try {
    let key = '__pushtell_react__';
    window.localStorage.setItem(key, key);
    if (window.localStorage.getItem(key) !== key) {
      store = noopStore;
    } else {
      window.localStorage.removeItem(key);
      store = window.localStorage;
    }
  } catch (e) {
    store = noopStore;
  }
} else {
  store = noopStore;
}

emitter.addActiveVariantListener(function (experimentName, variantName, skipSave) {
  if (skipSave) {
    return;
  }
  store.setItem('PUSHTELL-' + experimentName, variantName);
});

export default class Experiment extends Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    defaultVariantName: PropTypes.string,
    userIdentifier: PropTypes.string
  };

  static displayName = "Pushtell.Experiment";

  win = () => {
    emitter.emitWin(this.props.name);
  };

  getSelectedVariant = () => {
    /*

    Choosing a weighted variant:
      For C, A, B with weights 2, 4, 8

      variants = A, B, C
      weights = 4, 8, 2
      weightSum = 14
      weightedIndex = 9

      AAAABBBBBBBBCC
      ========^
      Select B

    */

    // Sorted array of the variant names, example: ["A", "B", "C"]
    const variants = emitter.getSortedVariants(this.props.name);
    // Array of the variant weights, also sorted by variant name. For example, if
    // variant C had weight 2, variant A had weight 4, and variant B had weight 8
    // return [4, 8, 2] to correspond with ["A", "B", "C"]
    const weights = emitter.getSortedVariantWeights(this.props.name);
    // Sum the weights
    const weightSum = weights.reduce((a, b) => {
      return a + b;
    }, 0);
    // A random number between 0 and weightSum
    let weightedIndex = typeof this.props.userIdentifier === 'string' ? Math.abs(crc32(this.props.userIdentifier) % weightSum) : Math.floor(Math.random() * weightSum);
    // Iterate through the sorted weights, and deduct each from the weightedIndex.
    // If weightedIndex drops < 0, select the variant. If weightedIndex does not
    // drop < 0, default to the last variant in the array that is initially assigned.
    let selectedVariant = variants[variants.length - 1];
    for (let index = 0; index < weights.length; index++) {
      weightedIndex -= weights[index];
      if (weightedIndex < 0) {
        selectedVariant = variants[index];
        break;
      }
    }
    emitter.setActiveVariant(this.props.name, selectedVariant);
    return selectedVariant;
  }

  getLocalStorageValue = () => {
    if(typeof this.props.userIdentifier === "string") {
      return this.getSelectedVariant();
    }
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
    return this.getSelectedVariant();
  }

  render() {
    return <CoreExperiment {...this.props} value={this.getLocalStorageValue}/>;
  }
}
