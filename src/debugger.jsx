import React from 'react';
import ReactDOM from 'react-dom';
import createReactClass from 'create-react-class';
import emitter from "./emitter";
import {canUseDOM} from 'fbjs/lib/ExecutionEnvironment';

if(process.env.NODE_ENV === "production" || !canUseDOM) {
  module.exports = {
    enable() {},
    disable() {}
  }
} else {
  let style = null;
  function attachStyleSheet() {
    style = document.createElement("style");
    style.appendChild(document.createTextNode(""));
    document.head.appendChild(style);
    function addCSSRule(selector, rules) {
      if("insertRule" in style.sheet) {
        style.sheet.insertRule(selector + "{" + rules + "}", 0);
      } else if("addRule" in style.sheet) {
        style.sheet.addRule(selector, rules, 0);
      }
    }
    addCSSRule("#pushtell-debugger", "z-index: 25000");
    addCSSRule("#pushtell-debugger", "position: fixed");
    addCSSRule("#pushtell-debugger", "transform: translateX(-50%)");
    addCSSRule("#pushtell-debugger", "bottom: 0");
    addCSSRule("#pushtell-debugger", "left: 50%");
    addCSSRule("#pushtell-debugger ul", "margin: 0");
    addCSSRule("#pushtell-debugger ul", "padding: 0 0 0 20px");
    addCSSRule("#pushtell-debugger li", "margin: 0");
    addCSSRule("#pushtell-debugger li", "padding: 0");
    addCSSRule("#pushtell-debugger li", "font-size: 14px");
    addCSSRule("#pushtell-debugger li", "line-height: 14px");
    addCSSRule("#pushtell-debugger input", "float: left");
    addCSSRule("#pushtell-debugger input", "margin: 0 10px 0 0");
    addCSSRule("#pushtell-debugger input", "padding: 0");
    addCSSRule("#pushtell-debugger input", "cursor: pointer");
    addCSSRule("#pushtell-debugger label", "color: #999999");
    addCSSRule("#pushtell-debugger label", "margin: 0 0 10px 0");
    addCSSRule("#pushtell-debugger label", "cursor: pointer");
    addCSSRule("#pushtell-debugger label", "font-weight: normal");
    addCSSRule("#pushtell-debugger label.active", "color: #000000");
    addCSSRule("#pushtell-debugger .pushtell-experiment-name", "font-size: 16px");
    addCSSRule("#pushtell-debugger .pushtell-experiment-name", "color: #000000");
    addCSSRule("#pushtell-debugger .pushtell-experiment-name", "margin: 0 0 10px 0");
    addCSSRule("#pushtell-debugger .pushtell-production-build-note", "font-size: 10px");
    addCSSRule("#pushtell-debugger .pushtell-production-build-note", "color: #999999");
    addCSSRule("#pushtell-debugger .pushtell-production-build-note", "text-align: center");
    addCSSRule("#pushtell-debugger .pushtell-production-build-note", "margin: 10px -40px 0 -10px");
    addCSSRule("#pushtell-debugger .pushtell-production-build-note", "border-top: 1px solid #b3b3b3");
    addCSSRule("#pushtell-debugger .pushtell-production-build-note", "padding: 10px 10px 5px 10px");
    addCSSRule("#pushtell-debugger .pushtell-handle", "cursor: pointer");
    addCSSRule("#pushtell-debugger .pushtell-handle", "padding: 5px 10px 5px 10px");
    addCSSRule("#pushtell-debugger .pushtell-panel", "padding: 15px 40px 5px 10px");
    addCSSRule("#pushtell-debugger .pushtell-container", "font-size: 11px");
    addCSSRule("#pushtell-debugger .pushtell-container", "background-color: #ebebeb");
    addCSSRule("#pushtell-debugger .pushtell-container", "color: #000000");
    addCSSRule("#pushtell-debugger .pushtell-container", "box-shadow: 0px 0 5px rgba(0, 0, 0, 0.1)");
    addCSSRule("#pushtell-debugger .pushtell-container", "border-top: 1px solid #b3b3b3");
    addCSSRule("#pushtell-debugger .pushtell-container", "border-left: 1px solid #b3b3b3");
    addCSSRule("#pushtell-debugger .pushtell-container", "border-right: 1px solid #b3b3b3");
    addCSSRule("#pushtell-debugger .pushtell-container", "border-top-left-radius: 2px");
    addCSSRule("#pushtell-debugger .pushtell-container", "border-top-right-radius: 2px");
    addCSSRule("#pushtell-debugger .pushtell-close", "cursor: pointer");
    addCSSRule("#pushtell-debugger .pushtell-close", "font-size: 16px");
    addCSSRule("#pushtell-debugger .pushtell-close", "font-weight: bold");
    addCSSRule("#pushtell-debugger .pushtell-close", "color: #CC0000");
    addCSSRule("#pushtell-debugger .pushtell-close", "position: absolute");
    addCSSRule("#pushtell-debugger .pushtell-close", "top: 0px");
    addCSSRule("#pushtell-debugger .pushtell-close", "right: 7px");
    addCSSRule("#pushtell-debugger .pushtell-close:hover", "color: #FF0000");
    addCSSRule("#pushtell-debugger .pushtell-close, #pushtell-debugger label", "transition: all .25s");
  }
  function removeStyleSheet() {
    if(style !== null){
      document.head.removeChild(style);
      style = null;
    }
  }
  const Debugger = createReactClass({
    displayName: "Pushtell.Debugger",
    getInitialState(){
      return {
        experiments: emitter.getActiveExperiments(),
        visible: false
      };
    },
    toggleVisibility() {
      this.setState({
        visible: !this.state.visible
      });
    },
    updateExperiments(){
      this.setState({
        experiments: emitter.getActiveExperiments()
      });
    },
    setActiveVariant(experimentName, variantName) {
      emitter.setActiveVariant(experimentName, variantName);
    },
    componentWillMount(){
      this.activeSubscription = emitter.addListener("active", this.updateExperiments);
      this.inactiveSubscription = emitter.addListener("inactive", this.updateExperiments);
    },
    componentWillUnmount(){
      this.activeSubscription.remove();
      this.inactiveSubscription.remove();
    },
    render(){
      var experimentNames = Object.keys(this.state.experiments);
      if(this.state.visible) {
        return <div className="pushtell-container pushtell-panel">
          <div className="pushtell-close" onClick={this.toggleVisibility}>×</div>
          {experimentNames.map(experimentName => {
            var variantNames = Object.keys(this.state.experiments[experimentName]);
            if(variantNames.length === 0) {
              return;
            }
            return <div className="pushtell-experiment" key={experimentName}>
              <div className="pushtell-experiment-name">{experimentName}</div>
              <ul>
                {variantNames.map(variantName => {
                  return <li key={variantName}>
                    <label className={this.state.experiments[experimentName][variantName] ? "active" : null} onClick={this.setActiveVariant.bind(this, experimentName, variantName)}>
                      <input type="radio" name={experimentName} value={variantName} defaultChecked={this.state.experiments[experimentName][variantName]} />
                      {variantName}
                    </label>
                 </li>
                })}
              </ul>
            </div>;
          })}
          <div className="pushtell-production-build-note">This panel is hidden on production builds.</div>
        </div>;
      } else if(experimentNames.length > 0){
        return <div className="pushtell-container pushtell-handle" onClick={this.toggleVisibility}>
          {experimentNames.length} Active Experiment{experimentNames.length > 1 ? "s" : ""}
        </div>;
      } else {
        return null;
      }
    }
  });

  module.exports = {
    enable() {
      attachStyleSheet();
      let body = document.getElementsByTagName('body')[0];
      let container = document.createElement('div');
      container.id = 'pushtell-debugger';
      body.appendChild(container);
      ReactDOM.render(<Debugger />, container);
    },
    disable() {
      removeStyleSheet();
      let body = document.getElementsByTagName('body')[0];
      let container = document.getElementById('pushtell-debugger');
      if(container) {
        ReactDOM.unmountComponentAtNode(container);
        body.removeChild(container);
      }
    }
  }
}
