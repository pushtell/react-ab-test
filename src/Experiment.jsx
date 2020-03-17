import React, {Component} from "react";
import PropTypes from 'prop-types';
import CoreExperiment from "./CoreExperiment";
import emitter from "./emitter";
import store from "./store";

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
    return emitter.setRandomActiveVariant(this.props.name, this.props.userIdentifier);
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
