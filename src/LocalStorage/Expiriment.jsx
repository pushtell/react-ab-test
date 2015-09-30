import React from "react";
import Expiriment from "../Expiriment";
import store from "store";

export default React.createClass({
  displayName: "Pushtell.LocalStorage.Expiriment",
  propTypes: {
    defaultValue: React.PropTypes.string,
    variantNames: React.PropTypes.array,
    name: React.PropTypes.string.isRequired,
    onPlay: React.PropTypes.func,
    onWin: React.PropTypes.func
  },
  statics: {
    win: Expiriment.win
  },
  getInitialState(){
    Expiriment.expiriments[this.props.name] = Expiriment.expiriments[this.props.name] || {};
    if(this.props.variantNames) {
      this.props.variantNames.forEach(name => {
        Expiriment.expiriments[this.props.name][name] = true;
      });
    }
    React.Children.forEach(this.props.children, element => {
      if(!React.isValidElement(element) || element.type.displayName !== "Pushtell.Variant"){
        throw new Error("Pushtell Expiriment children must be Pushtell Variant components.");
      }
      Expiriment.expiriments[this.props.name][element.props.name] = true;
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
    let variantNames = Object.keys(Expiriment.expiriments[this.props.name]);
    let randomValue = variantNames[Math.floor(Math.random() * variantNames.length)];
    store.set('PUSHTELL-' + this.props.name, randomValue);
    return this.setState({
      value: randomValue
    });
  },
  render() {
    return <Expiriment {...this.props} {...this.state} />;
  }
});