import React from "react";
import ReactDOM from "react-dom";
import createReactClass from "create-react-class";
import Experiment from "../../src/CoreExperiment.jsx";
import Variant from "../../src/Variant.jsx";
import emitter from "../../src/emitter.jsx";
import assert from "assert";
import co from "co";
import UUID from "node-uuid";
import TestUtils from 'react-dom/test-utils';
import ES6Promise from 'es6-promise';
ES6Promise.polyfill();

describe("Emitter", function() {
  let container;
  before(function(){
    container = document.createElement("div");
    container.id = "react";
    document.getElementsByTagName('body')[0].appendChild(container);
  });
  after(function(){
    document.getElementsByTagName('body')[0].removeChild(container);
    emitter._reset();
  });
  it("should throw an error when passed an invalid name argument.", function (){
    assert.throws(function(){emitter.emitWin(1)}, /type \'string\'/);
  });
  it("should emit when a variant is played.", co.wrap(function *(){
    let experimentName = UUID.v4();
    let playedVariantName = null;
    let playCallback = function(experimentName, variantName){
      playedVariantName = variantName;
    };
    let experimentNameGlobal = null;
    let playedVariantNameGlobal = null;
    let playCallbackGlobal = function(experimentName, variantName){
      experimentNameGlobal = experimentName;
      playedVariantNameGlobal = variantName;
    };
    let playSubscription = emitter.addPlayListener(experimentName, playCallback);
    let playSubscriptionGlobal = emitter.addPlayListener(playCallbackGlobal);
    let App = createReactClass({
      render: function(){
        return <Experiment name={experimentName} value="A">
          <Variant name="A"><div id="variant-a"/></Variant>
          <Variant name="B"><div id="variant-b"/></Variant>
        </Experiment>;
      }
    });
    yield new Promise(function(resolve, reject){
      ReactDOM.render(<App />, container, resolve);
    });
    assert.equal(playedVariantName, "A");
    assert.equal(experimentNameGlobal, experimentName);
    assert.equal(playedVariantNameGlobal, "A");
    playSubscription.remove();
    playSubscriptionGlobal.remove();
    ReactDOM.unmountComponentAtNode(container);
  }));
  it("should emit when a variant wins.", co.wrap(function *(){
    let experimentName = UUID.v4();
    let winningVariantName = null;
    let winCallback = function(experimentName, variantName){
      winningVariantName = variantName;
    };
    let experimentNameGlobal = null;
    let winningVariantNameGlobal = null;
    let winCallbackGlobal = function(experimentName, variantName){
      experimentNameGlobal = experimentName;
      winningVariantNameGlobal = variantName;
    };
    let winSubscription = emitter.addWinListener(experimentName, winCallback);
    let winSubscriptionGlobal = emitter.addWinListener(winCallbackGlobal);
    let App = createReactClass({
      render: function(){
        return <Experiment name={experimentName} value="A">
          <Variant name="A"><div id="variant-a"/></Variant>
          <Variant name="B"><div id="variant-b"/></Variant>
        </Experiment>;
      }
    });
    yield new Promise(function(resolve, reject){
      ReactDOM.render(<App />, container, resolve);
    });
    emitter.emitWin(experimentName);
    assert.equal(winningVariantName, "A");
    assert.equal(experimentNameGlobal, experimentName);
    assert.equal(winningVariantNameGlobal, "A");
    winSubscription.remove();
    winSubscriptionGlobal.remove();
    ReactDOM.unmountComponentAtNode(container);
  }));
  it("should emit when a variant is clicked.", co.wrap(function *(){
    let experimentName = UUID.v4();
    let winningVariantName = null;
    let winCallback = function(experimentName, variantName){
      winningVariantName = variantName;
    };
    let experimentNameGlobal = null;
    let winningVariantNameGlobal = null;
    let winCallbackGlobal = function(experimentName, variantName){
      experimentNameGlobal = experimentName;
      winningVariantNameGlobal = variantName;
    };
    let winSubscription = emitter.addWinListener(experimentName, winCallback);
    let winSubscriptionGlobal = emitter.addWinListener(winCallbackGlobal);
    let App = createReactClass({
      onClickVariant: function(e){
        this.refs.experiment.win();
      },
      render: function(){
        return <Experiment ref="experiment" name={experimentName} value="A">
          <Variant name="A"><a id="variant-a" href="#A" onClick={this.onClickVariant}>A</a></Variant>
          <Variant name="B"><a id="variant-b" href="#B" onClick={this.onClickVariant}>B</a></Variant>
        </Experiment>;
      }
    });
    yield new Promise(function(resolve, reject){
      ReactDOM.render(<App />, container, resolve);
    });
    let elementA = document.getElementById('variant-a');
    TestUtils.Simulate.click(elementA);
    assert.equal(winningVariantName, "A");
    assert.equal(experimentNameGlobal, experimentName);
    assert.equal(winningVariantNameGlobal, "A");
    winSubscription.remove();
    winSubscriptionGlobal.remove();
    ReactDOM.unmountComponentAtNode(container);
  }));
  it("should emit when a variant is chosen.", co.wrap(function *(){
    let experimentName = UUID.v4();
    let activeVariantName = null;
    let activeVariantCallback = function(experimentName, variantName){
      activeVariantName = variantName;
    };
    let experimentNameGlobal = null;
    let activeVariantNameGlobal = null;
    let activeVariantCallbackGlobal = function(experimentName, variantName){
      experimentNameGlobal = experimentName;
      activeVariantNameGlobal = variantName;
    };
    let activeVariantSubscription = emitter.addActiveVariantListener(experimentName, activeVariantCallback);
    let activeVariantSubscriptionGlobal = emitter.addActiveVariantListener(activeVariantCallbackGlobal);
    let App = createReactClass({
      render: function(){
        return <Experiment ref="experiment" name={experimentName} value="A">
          <Variant name="A"><a id="variant-a" href="#A">A</a></Variant>
          <Variant name="B"><a id="variant-b" href="#B">B</a></Variant>
        </Experiment>;
      }
    });
    yield new Promise(function(resolve, reject){
      ReactDOM.render(<App />, container, resolve);
    });
    assert.equal(activeVariantName, "A");
    assert.equal(experimentNameGlobal, experimentName);
    assert.equal(activeVariantNameGlobal, "A");
    activeVariantSubscription.remove();
    activeVariantSubscriptionGlobal.remove();
    ReactDOM.unmountComponentAtNode(container);
  }));
  it("should get the experiment value.", co.wrap(function *(){
    let experimentName = UUID.v4();
    let App = createReactClass({
      render: function(){
        return <Experiment ref="experiment" name={experimentName} value="A">
          <Variant name="A"><a id="variant-a" href="#A">A</a></Variant>
          <Variant name="B"><a id="variant-b" href="#B">B</a></Variant>
        </Experiment>;
      }
    });
    yield new Promise(function(resolve, reject){
      ReactDOM.render(<App />, container, resolve);
    });
    assert.equal(emitter.getActiveVariant(experimentName), "A");
    ReactDOM.unmountComponentAtNode(container);
  }));
  it("should update the rendered component.", co.wrap(function *(){
    let experimentName = UUID.v4();
    let App = createReactClass({
      render: function(){
        return <Experiment name={experimentName} value="A">
          <Variant name="A"><div id="variant-a" /></Variant>
          <Variant name="B"><div id="variant-b" /></Variant>
        </Experiment>;
      }
    });
    yield new Promise(function(resolve, reject){
      ReactDOM.render(<App />, container, resolve);
    });
    let elementA = document.getElementById('variant-a');
    let elementB = document.getElementById('variant-b');
    assert.notEqual(elementA, null);
    assert.equal(elementB, null);
    emitter.setActiveVariant(experimentName, "B");
    elementA = document.getElementById('variant-a');
    elementB = document.getElementById('variant-b');
    assert.equal(elementA, null);
    assert.notEqual(elementB, null);
    ReactDOM.unmountComponentAtNode(container);
  }));
  it("should report active components.", co.wrap(function *(){
    let experimentNameA = UUID.v4();
    let experimentNameB = UUID.v4();
    let AppA = createReactClass({
      render: function(){
        return <Experiment name={experimentNameA} value="A">
          <Variant name="A"><div id="variant-a" /></Variant>
          <Variant name="B"><div id="variant-b" /></Variant>
        </Experiment>;
      }
    });
    let AppB = createReactClass({
      render: function(){
        return <Experiment name={experimentNameB} value="C">
          <Variant name="C"><div id="variant-c" /></Variant>
          <Variant name="D"><div id="variant-d" /></Variant>
        </Experiment>;
      }
    });
    let AppCombined = createReactClass({
      render: function(){
        return <div>
          <AppA />
          <AppB />
        </div>;
      }
    });
    yield new Promise(function(resolve, reject){
      ReactDOM.render(<AppA />, container, resolve);
    });
    let activeExperiments = {};
    activeExperiments[experimentNameA] = {
      "A": true,
      "B": false
    };
    assert.deepEqual(emitter.getActiveExperiments(), activeExperiments);
    ReactDOM.unmountComponentAtNode(container);
    yield new Promise(function(resolve, reject){
      ReactDOM.render(<AppB />, container, resolve);
    });
    activeExperiments = {};
    activeExperiments[experimentNameB] = {
      "C": true,
      "D": false
    };
    assert.deepEqual(emitter.getActiveExperiments(), activeExperiments);
    ReactDOM.unmountComponentAtNode(container);
    yield new Promise(function(resolve, reject){
      ReactDOM.render(<AppCombined />, container, resolve);
    });
    activeExperiments = {};
    activeExperiments[experimentNameA] = {
      "A": true,
      "B": false
    };
    activeExperiments[experimentNameB] = {
      "C": true,
      "D": false
    };
    assert.deepEqual(emitter.getActiveExperiments(), activeExperiments);
    ReactDOM.unmountComponentAtNode(container);
  }));
});

