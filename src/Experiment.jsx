import React from 'react';
import {EventEmitter} from 'fbemitter';

const experiments = {};
const values = {};
const emitter = new EventEmitter();

export default React.createClass({
  displayName: "Pushtell.Experiment",
  propTypes: {
    name: React.PropTypes.string.isRequired,
    value: React.PropTypes.string.isRequired,
    onPlay: React.PropTypes.func,
    onWin: React.PropTypes.func
  },
  statics: {
    emitter: emitter,
    experiments: experiments,
    win(experimentName){
      if(typeof experimentName !== 'string') {
        throw new Error("Required argument 'experimentName' should have type 'string'");
      }
      emitter.emit("win", experimentName, values[experimentName]);
    }
  },
  win(){
    emitter.emit("win", this.props.name, this.props.value);
  },
  getInitialState(){
    let children = {};
    React.Children.forEach(this.props.children, element => {
      if(!React.isValidElement(element) || element.type.displayName !== "Pushtell.Variant"){
        throw new Error("Pushtell Experiment children must be Pushtell Variant components.");
      }
      children[element.props.name] = element;
    });
    if(!children[this.props.value]) {
      if("production" !== process.env.NODE_ENV) {
        console.debug('Experiment “' + this.props.name + '” does not contain variant “' + this.props.value + '”');
        console.trace();
      }
      return null;
    }
    return {
      element: children[this.props.value]
    };
  },
  winListener(experimentName, variantName){
    if(!this.props.onWin){
      return;
    }
    if(experimentName === this.props.name) {
      this.props.onWin(variantName);
    }
  },
  componentWillMount(){
    if(this.props.onPlay){
      this.props.onPlay(this.props.value);
    }
    emitter.emit('play', this.props.name, this.props.value);
    this.emitterSubscription = emitter.addListener('win', this.winListener);
    values[this.props.name] = this.props.value;
  },
  componentWillUnmount(){
    this.emitterSubscription.remove();
  },
  render(){
    return this.state.element;
  }
});