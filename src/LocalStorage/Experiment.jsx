import React from "react";
import Experiment from "../Experiment";
import store from "store";

export default React.createClass({
  displayName: "Pushtell.LocalStorage.Experiment",
  propTypes: {
    defaultValue: React.PropTypes.string,
    variantNames: React.PropTypes.array,
    name: React.PropTypes.string.isRequired,
    onPlay: React.PropTypes.func,
    onWin: React.PropTypes.func
  },
  statics: {
    win: Experiment.win,
    emitter: Experiment.emitter
  },
  win(){
    Experiment.emitter.emit("win", this.props.name, this.state.value);
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
    let storedValue = store.get('PUSHTELL-' + this.props.name);
    if(typeof storedValue !== "undefined") {
      return this.setState({
        value: storedValue
      });
    }
    if(typeof this.props.defaultValue !== 'undefined') {
      store.set('PUSHTELL-' + this.props.name, this.props.defaultValue);
      return this.setState({
        value: this.props.defaultValue
      });
    }
    let variantNames = Object.keys(Experiment.experiments[this.props.name]);
    let randomValue = variantNames[Math.floor(Math.random() * variantNames.length)];
    store.set('PUSHTELL-' + this.props.name, randomValue);
    return this.setState({
      value: randomValue
    });
  },
  render() {
    return <Experiment {...this.props} {...this.state} />;
  }
});