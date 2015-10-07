import React from 'react';
import warning from "react/lib/warning";
import emitter from "./emitter";
import Variant from "./Variant";

export default React.createClass({
  displayName: "Pushtell.Experiment",
  propTypes: {
    name: React.PropTypes.string.isRequired,
    value: React.PropTypes.oneOfType([
      React.PropTypes.string,
      React.PropTypes.func
    ]).isRequired
  },
  win(){
    emitter.emitWin(this.props.name);
  },
  getInitialState(){
    let children = {};
    React.Children.forEach(this.props.children, element => {
      if(!React.isValidElement(element) || element.type.displayName !== "Pushtell.Variant"){
        let error = new Error("Pushtell Experiment children must be Pushtell Variant components.");
        error.type = "PUSHTELL_INVALID_CHILD";
        throw error;
      }
      children[element.props.name] = element;
      emitter.addExperimentVariant(this.props.name, element.props.name);
    });
    return {
      variants: children
    };
  },
  componentWillReceiveProps(nextProps) {
    if(nextProps.value !== this.props.value) {
      let value = typeof nextProps.value === "function" ? nextProps.value() : nextProps.value;
      this.setState({
        value: value
      });
    }
  },
  componentWillMount(){
    let value = typeof this.props.value === "function" ? this.props.value() : this.props.value;
    if(!this.state.variants[value]) {
      if ("production" !== process.env.NODE_ENV) {
        warning(true, 'Experiment “' + this.props.name + '” does not contain variant “' + value + '”');
      }
    }
    emitter.setExperimentValue(this.props.name, value);
    emitter.emit('play', this.props.name, value);
    this.setState({
      value: value
    });
    this.valueSubscription = emitter.addValueListener(this.props.name, (experimentName, variantName) => {
      this.setState({
        value: variantName
      });
    });
  },
  componentWillUnmount(){
    this.valueSubscription.remove();
  },
  render(){
    return this.state.variants[this.state.value] || null;
  }
});