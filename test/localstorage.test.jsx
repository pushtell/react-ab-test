import React from "react";
import Experiment from "../src/LocalStorageExperiment.jsx";
import Variant from "../src/Variant.jsx";
import emitter from "../src/emitter.jsx";
import assert from "assert";
import co from "co";
import UUID from "node-uuid";
import {mouse} from 'effroi/src/effroi';
import ES6Promise from 'es6-promise';
ES6Promise.polyfill();

describe("LocalStorage", function() {
  before(function(){
    let container = document.createElement("div");
    container.id = "react";
    document.getElementsByTagName('body')[0].appendChild(container);
  });
  after(function(){
    let container = document.getElementById("react");
    document.getElementsByTagName('body')[0].removeChild(container);
  });
  it("should choose a version.", co.wrap(function *(){
    let reactElement = document.getElementById("react");
    let experimentName = UUID.v4();
    let variantNames = [];
    for(let i = 0; i < 100; i++) {
      variantNames.push(UUID.v4());
    }
    let App = React.createClass({
      render: function(){
        return <Experiment name={experimentName}>
          {variantNames.map(name => {
            return <Variant key={name} name={name}><div id={'experiment-' + name}></div></Variant>
          })}
        </Experiment>;
      }
    });
    yield new Promise(function(resolve, reject){
      React.render(<App />, reactElement, resolve);
    });
  }));
  it("should render the correct variant.", co.wrap(function *(){
    let reactElement = document.getElementById("react");
    let experimentName = UUID.v4();
    let variantNames = [];
    for(let i = 0; i < 100; i++) {
      variantNames.push(UUID.v4());
    }
    let defaultValue = variantNames[Math.floor(Math.random() * variantNames.length)];
    let AppWithDefaultValue = React.createClass({
      render: function(){
        return <Experiment name={experimentName} defaultValue={defaultValue}>
          {variantNames.map(name => {
            return <Variant key={name} name={name}><div id={'experiment-' + name}></div></Variant>
          })}
        </Experiment>;
      }
    });
    let AppWithoutDefaultValue = React.createClass({
      render: function(){
        return <Experiment name={experimentName}>
          {variantNames.map(name => {
            return <Variant key={name} name={name}><div id={'experiment-' + name}></div></Variant>
          })}
        </Experiment>;
      }
    });
    yield new Promise(function(resolve, reject){
      React.render(<AppWithDefaultValue />, reactElement, resolve);
    });
    let elementWithDefaultValue = document.getElementById('experiment-' + defaultValue);
    assert.notEqual(elementWithDefaultValue, null);
    reactElement.innerHTML = "";
    yield new Promise(function(resolve, reject){
      React.render(<AppWithoutDefaultValue />, reactElement, resolve);
    });
    let elementWithoutDefaultValue = document.getElementById('experiment-' + defaultValue);
    assert.notEqual(elementWithoutDefaultValue, null);
  }));
  it("should error if variants are added to a experiment after a variant was selected.", co.wrap(function *(){
    let reactElement = document.getElementById("react");
    let experimentName = UUID.v4();
    let AppPart1 = React.createClass({
      onClickVariant: function(e){
        this.refs.experiment.win();
      },
      render: function(){
        return <Experiment ref="experiment" name={experimentName}>
          <Variant name="A"><a id="variant-a" href="#A">A</a></Variant>
          <Variant name="B"><a id="variant-b" href="#B">B</a></Variant>
        </Experiment>;
      }
    });
    let AppPart2 = React.createClass({
      onClickVariant: function(e){
        this.refs.experiment.win();
      },
      render: function(){
        return <Experiment ref="experiment" name={experimentName}>
          <Variant name="C"><a id="variant-c" href="#C">C</a></Variant>
          <Variant name="D"><a id="variant-d" href="#D">D</a></Variant>
        </Experiment>;
      }
    });
    yield new Promise(function(resolve, reject){
      React.render(<AppPart1 />, reactElement, resolve);
    });
    try {
      yield new Promise(function(resolve, reject){
        React.render(<AppPart2 />, reactElement, resolve);
      });
    } catch(error) {
      if(error.type !== "PUSHTELL_INVALID_VARIANT") {
        throw error;
      }
      return;
    }
    throw new Error("New variant was added after variant was selected.");
  }));
  it("should not error if variants are added to a experiment after a variant was selected if variants were declared.", co.wrap(function *(){
    let reactElement = document.getElementById("react");
    let experimentName = UUID.v4();
    emitter.addExperimentVariants(experimentName, ["A", "B", "C", "D"]);
    let AppPart1 = React.createClass({
      onClickVariant: function(e){
        this.refs.experiment.win();
      },
      render: function(){
        return <Experiment ref="experiment" name={experimentName}>
          <Variant name="A"><a id="variant-a" href="#A">A</a></Variant>
          <Variant name="B"><a id="variant-b" href="#B">B</a></Variant>
        </Experiment>;
      }
    });
    let AppPart2 = React.createClass({
      onClickVariant: function(e){
        this.refs.experiment.win();
      },
      render: function(){
        return <Experiment ref="experiment" name={experimentName}>
          <Variant name="C"><a id="variant-c" href="#C">C</a></Variant>
          <Variant name="D"><a id="variant-d" href="#D">D</a></Variant>
        </Experiment>;
      }
    });
    yield new Promise(function(resolve, reject){
      React.render(<AppPart1 />, reactElement, resolve);
    });
    yield new Promise(function(resolve, reject){
      React.render(<AppPart2 />, reactElement, resolve);
    });
  }));
  it("should not error if an older test variant is set.", co.wrap(function *(){
    let reactElement = document.getElementById("react");
    let experimentName = UUID.v4();
    localStorage.setItem("PUSHTELL-" + experimentName, "C");
    let App = React.createClass({
      render: function(){
        return <Experiment name={experimentName}>
          <Variant name="A"><a id="variant-a" href="#A" onClick={this.onClickVariant}>A</a></Variant>
          <Variant name="B"><a id="variant-b" href="#B" onClick={this.onClickVariant}>B</a></Variant>
        </Experiment>;
      }
    });
    yield new Promise(function(resolve, reject){
      React.render(<App />, reactElement, resolve);
    });
  }));
  it("should emit when a variant is clicked.", co.wrap(function *(){
    let experimentName = UUID.v4();
    let winningVariantName = null;
    let winCallback = function(experimentName, variantName){
      winningVariantName = variantName;
    };
    let experimentNameGlobal = null;
    let winningVariantNameGlobal = null;
    let winCallbackGlobal = function(expirimentName, variantName){
      experimentNameGlobal = expirimentName;
      winningVariantNameGlobal = variantName;
    };
    let winSubscription = emitter.addWinListener(experimentName, winCallback);
    let winSubscriptionGlobal = emitter.addWinListener(winCallbackGlobal);
    let App = React.createClass({
      onClickVariant: function(e){
        this.refs.experiment.win();
      },
      render: function(){
        return <Experiment ref="experiment" name={experimentName} defaultValue="A">
          <Variant name="A"><a id="variant-a" href="#A" onClick={this.onClickVariant}>A</a></Variant>
          <Variant name="B"><a id="variant-b" href="#B" onClick={this.onClickVariant}>B</a></Variant>
        </Experiment>;
      }
    });
    yield new Promise(function(resolve, reject){
      React.render(<App />, document.getElementById("react"), resolve);
    });
    let elementA = document.getElementById('variant-a');
    mouse.click(elementA);
    assert.equal(winningVariantName, "A");
    assert.equal(experimentNameGlobal, experimentName);
    assert.equal(winningVariantNameGlobal, "A");
    winSubscription.remove();
    winSubscriptionGlobal.remove();
  }));
});
