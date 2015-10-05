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
    }
    window.localStorage.removeItem(key);
    store = window.localStorage;
  } catch(e) {
    store = noopStore;
  }
} else {
  store = noopStore;
}

export default React.createClass({
  displayName: "Pushtell.LocalStorage.Experiment",
  propTypes: {
    defaultValue: React.PropTypes.string,
    variantNames: React.PropTypes.array,
    name: React.PropTypes.string.isRequired,
    onPlay: React.PropTypes.func,
    onWin: React.PropTypes.func
  },
  win(){
    emitter.emitWin(this.props.name);
  },
  getInitialState(){
    React.Children.forEach(this.props.children, element => {
      if(!React.isValidElement(element) || element.type.displayName !== "Pushtell.Variant"){
        let error = new Error("Pushtell Experiment children must be Pushtell Variant components.");
        error.type = "PUSHTELL_INVALID_CHILD";
        throw error;
      }
      emitter.addExperimentVariant(this.props.name, element.props.name);
    });
    return {};
  },
  componentWillMount() {
    let storedValue = store.getItem('PUSHTELL-' + this.props.name);
    if(typeof storedValue === "string") {
      return this.setState({
        value: storedValue
      });
    }
    if(typeof this.props.defaultValue === 'string') {
      store.setItem('PUSHTELL-' + this.props.name, this.props.defaultValue);
      return this.setState({
        value: this.props.defaultValue
      });
    }
    let variants = emitter.getSortedVariants(this.props.name);
    let randomValue = variants[Math.floor(Math.random() * variants.length)];
    store.setItem('PUSHTELL-' + this.props.name, randomValue);
    return this.setState({
      value: randomValue
    });
  },
  render() {
    return <Experiment {...this.props} {...this.state} />;
  }
});