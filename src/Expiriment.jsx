import React from 'react';
import {EventEmitter} from 'fbemitter';

const expiriments = {};
const emitter = new EventEmitter();

export default React.createClass({
  displayName: "Pushtell.Expiriment",
  propTypes: {
    name: React.PropTypes.string.isRequired,
    value: React.PropTypes.string.isRequired,
    onPlay: React.PropTypes.func,
    onWin: React.PropTypes.func
  },
  statics: {
    emitter: emitter,
    expiriments: expiriments,
    win(expirimentName, variantName){
      if(typeof expirimentName !== 'string') {
        throw new Error("Required argument 'expirimentName' should have type 'string'");
      }
      if(typeof variantName !== 'string') {
        throw new Error("Required argument 'variantName' should have type 'string'");
      }
      emitter.emit("win", expirimentName, variantName);
    }
  },
  getInitialState(){
    let children = {};
    React.Children.forEach(this.props.children, element => {
      if(!React.isValidElement(element) || element.type.displayName !== "Pushtell.Variant"){
        throw new Error("Pushtell Expiriment children must be Pushtell Variant components.");
      }
      children[element.props.name] = element;
    });
    if(!children[this.props.value]) {
      if("production" !== process.env.NODE_ENV) {
        console.debug('Expiriment “' + this.props.name + '” does not contain variant “' + this.props.value + '”');
        console.trace();
      }
      return null;
    }
    return {
      element: children[this.props.value]
    };
  },
  winListener(expirimentName, variantName){
    if(!this.props.onWin){
      return;
    }
    if(expirimentName === this.props.name) {
      this.props.onWin(variantName);
    }
  },
  componentWillMount(){
    if(this.props.onPlay){
      this.props.onPlay(this.props.value);
    }
    emitter.emit('play', this.props.name, this.props.value);
    this.emitterSubscription = emitter.addListener('win', this.winListener);
  },
  componentWillUnmount(){
    this.emitterSubscription.remove();
  },
  render(){
    return this.state.element;
  }
});