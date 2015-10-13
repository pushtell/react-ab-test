import React from "react";
import Experiment from "./Experiment";
import emitter from "./emitter";

let store;

let noopStore = {
  getItem: function(){},
  setItem: function(){}
};

if(typeof window !== 'undefined' && 'localStorage' in window && window['localStorage'] !== null) {
  try {
    let key = '__pushtell_react__';
    window.localStorage.setItem(key, key);
    if (window.localStorage.getItem(key) != key) {
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

emitter.addValueListener((experimentName, variantName) => {
  store.setItem('PUSHTELL-' + experimentName, variantName);
});

export default React.createClass({
  displayName: "Pushtell.LocalStorage.Experiment",
  propTypes: {
    name: React.PropTypes.string.isRequired,
    defaultValue: React.PropTypes.string
  },
  win(){
    emitter.emitWin(this.props.name);
  },
  getLocalStorageValue() {
    let storedValue = store.getItem('PUSHTELL-' + this.props.name);
    if(typeof storedValue === "string") {
      emitter.setExperimentValue(this.props.name, storedValue, false);
      return storedValue;
    }
    if(typeof this.props.defaultValue === 'string') {
      emitter.setExperimentValue(this.props.name, this.props.defaultValue);
      return this.props.defaultValue;
    }
    let variants = emitter.getSortedVariants(this.props.name);
    let randomValue = variants[Math.floor(Math.random() * variants.length)];
    emitter.setExperimentValue(this.props.name, randomValue);
    return randomValue;
  },
  render() {
    return <Experiment {...this.props} value={this.getLocalStorageValue} />;
  }
});