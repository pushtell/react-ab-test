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
    emitter.emit("win", this.props.name, this.state.value);
  },
  getInitialState(){
    Experiment.experiments[this.props.name] = Experiment.experiments[this.props.name] || {};
    if(this.props.variantNames) {
      this.props.variantNames.forEach(name => {
        Experiment.experiments[this.props.name][name] = true;
      });
    }
    React.Children.forEach(this.props.children, element => {
      if(!React.isValidElement(element) || element.type.displayName !== "Pushtell.Variant"){
        throw new Error("Pushtell Experiment children must be Pushtell Variant components.");
      }
      Experiment.experiments[this.props.name][element.props.name] = true;
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
    let variantNames = Object.keys(Experiment.experiments[this.props.name]);
    let randomValue = variantNames[Math.floor(Math.random() * variantNames.length)];
    store.setItem('PUSHTELL-' + this.props.name, randomValue);
    return this.setState({
      value: randomValue
    });
  },
  render() {
    return <Experiment {...this.props} {...this.state} />;
  }
});