import React from 'react';
import emitter from "./emitter";
import {canUseDOM} from 'react/lib/ExecutionEnvironment';
import assign from 'react/lib/Object.assign';

if(process.env.NODE_ENV === "production" || !canUseDOM) {
  module.exports = {
    enable() {},
    disable() {}
  }
} else {
  const list_style = {
    margin:"0",
    padding:"0 0 0 20px"
  };

  const list_item_style = {
    margin:"0",
    padding:"0",
    fontSize: "14px",
    lineHeight: "14px"
  };

  const input_style = {
    float: "left",
    margin: "0 10px 0 0",
    padding: "0",
    cursor: "pointer"
  };

  const experiment_name_style = {
    fontSize: "16px",
    color: "#000000",
    margin: "0 0 10px 0"
  };

  const variant_name_style = {
    color: "#000000",
    margin: "0 0 10px 0",
    cursor: "pointer",
    fontWeight: "normal"
  };

  const close_button_style = {
    cursor: "pointer",
    fontSize: "16px",
    color: "red",
    position: "absolute",
    top: "0px",
    right: "7px"
  }

  const container_style = {
    fontSize: "12px",
    backgroundColor: "#ebebeb",
    color: "#000000",
    padding: "5px 10px 5px 10px",
    boxShadow: "0px 0 5px rgba(0, 0, 0, 0.1)",
    border: "1px solid #b3b3b3",
    borderTopLeftRadius: "2px",
    borderTopRightRadius: "2px"
  }

  const debugger_style = assign({}, container_style, {
    padding: "15px 40px 5px 10px"
  });

  const handle_style = assign({}, container_style, {
    cursor: "pointer"
  });

  const note_style = {
    fontSize: "10px",
    color: "#999999",
    textAlign: "center",
    margin: "10px -40px 0 -10px",
    borderTop: "1px solid #b3b3b3",
    padding: "10px 10px 5px 10px"
  }

  const Debugger = React.createClass({
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
    setExperimentValue(experimentName, variantName) {
      emitter.setExperimentValue(experimentName, variantName);
    },
    componentWillMount(){
      this.variantSubscription = emitter.addVariantListener(this.updateExperiments);
      this.valueSubscription = emitter.addValueListener(this.updateExperiments);
      this.activeSubscription = emitter.addListener("active", this.updateExperiments);
      this.inactiveSubscription = emitter.addListener("inactive", this.updateExperiments);
    },
    componentWillUnmount(){
      this.variantSubscription.remove();
      this.valueSubscription.remove();
      this.activeSubscription.remove();
      this.inactiveSubscription.remove();
    },
    render(){
      var experimentNames = Object.keys(this.state.experiments);
      if(this.state.visible) {
        return <div style={debugger_style}>
          <div style={close_button_style} onClick={this.toggleVisibility}>×</div>
          <ul style={list_style}>
            {experimentNames.map(experimentName => {
              var variantNames = Object.keys(this.state.experiments[experimentName]);
              if(variantNames.length === 0) {
                return;
              }
              return <li key={experimentName}>
                <div style={experiment_name_style}>{experimentName}</div>
                <ul style={list_style}>{variantNames.map(variantName => {
                  return <li style={list_item_style} key={variantName}>
                    <label style={variant_name_style} onClick={this.setExperimentValue.bind(this, experimentName, variantName)}>
                      <input style={input_style} type="radio" name={experimentName} defaultChecked={this.state.experiments[experimentName][variantName]} />
                      {this.state.experiments[experimentName][variantName] ? <b>{variantName}</b> : {variantName}}
                    </label>
                 </li>
                })}</ul>
              </li>;
            })}
          </ul>
          <div style={note_style}>This panel is hidden on production builds.</div>
        </div>;
      } else if(experimentNames.length > 0){
        return <div style={handle_style} onClick={this.toggleVisibility}>
          {experimentNames.length} Experiment{experimentNames.length > 1 ? "s" : ""} ▲
        </div>;
      } else {
        return null;
      }
    }
  });

  module.exports = {
    enable() {
      let body = document.getElementsByTagName('body')[0];
      let container = document.createElement('div');
      container.id = 'pushtell-react-ab-test-debugger';
      container.style.zIndex = "25000";
      container.style.position = "fixed";
      container.style.transform = "translateX(-50%)";
      container.style.bottom = "0";
      container.style.left = "50%";
      body.appendChild(container);
      React.render(<Debugger />, container);
    },
    disable() {
      let body = document.getElementsByTagName('body')[0];
      let container = document.getElementById('pushtell-react-ab-test-debugger');
      if(container) {
        React.unmountComponentAtNode(container);
        body.removeChild(container);
      }
    }
  }
}


