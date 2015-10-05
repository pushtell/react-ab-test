import React from 'react';
import warning from "react/lib/warning";
import emitter from "./emitter";
import Variant from "./Variant";

export default React.createClass({
  displayName: "Pushtell.Experiment",
  propTypes: {
    name: React.PropTypes.string.isRequired,
    value: React.PropTypes.string.isRequired
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
    });
    if(!children[this.props.value]) {
      if ("production" !== process.env.NODE_ENV) {
        warning(true, 'Experiment “' + this.props.name + '” does not contain variant “' + this.props.value + '”');
      }
      return {
        element: null
      };
    }
    return {
      element: children[this.props.value]
    };
  },
  componentWillMount(){
    emitter.setExperimentValue(this.props.name, this.props.value);
    emitter.emit('play', this.props.name, this.props.value);
  },
  render(){
    return this.state.element;
  }
});