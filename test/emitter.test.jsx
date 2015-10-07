import React from "react";
import Experiment from "../src/Experiment.jsx";
import Variant from "../src/Variant.jsx";
import emitter from "../src/emitter.jsx";
import assert from "assert";
import co from "co";
import UUID from "node-uuid";
import {mouse} from 'effroi/src/effroi';
import ES6Promise from 'es6-promise';
ES6Promise.polyfill();

describe("Emitter", function() {
  before(function(){
    let container = document.createElement("div");
    container.id = "react";
    document.getElementsByTagName('body')[0].appendChild(container);
  });
  after(function(){
    let container = document.getElementById("react");
    document.getElementsByTagName('body')[0].removeChild(container);
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
    let playCallbackGlobal = function(expirimentName, variantName){
      experimentNameGlobal = expirimentName;
      playedVariantNameGlobal = variantName;
    };
    let playSubscription = emitter.addPlayListener(experimentName, playCallback);
    let playSubscriptionGlobal = emitter.addPlayListener(playCallbackGlobal);
    let App = React.createClass({
      render: function(){
        return <Experiment name={experimentName} value="A">
          <Variant name="A"><div id="variant-a"/></Variant>
          <Variant name="B"><div id="variant-b"/></Variant>
        </Experiment>;
      }
    });
    yield new Promise(function(resolve, reject){
      React.render(<App />, document.getElementById("react"), resolve);
    });
    assert.equal(playedVariantName, "A");
    assert.equal(experimentNameGlobal, experimentName);
    assert.equal(playedVariantNameGlobal, "A");
    playSubscription.remove();
    playSubscriptionGlobal.remove();
  }));
  it("should emit when a variant wins.", co.wrap(function *(){
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
      render: function(){
        return <Experiment name={experimentName} value="A">
          <Variant name="A"><div id="variant-a"/></Variant>
          <Variant name="B"><div id="variant-b"/></Variant>
        </Experiment>;
      }
    });
    yield new Promise(function(resolve, reject){
      React.render(<App />, document.getElementById("react"), resolve);
    });
    emitter.emitWin(experimentName);
    assert.equal(winningVariantName, "A");
    assert.equal(experimentNameGlobal, experimentName);
    assert.equal(winningVariantNameGlobal, "A");
    winSubscription.remove();
    winSubscriptionGlobal.remove();
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
        return <Experiment ref="experiment" name={experimentName} value="A">
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
  it("should emit when variants are added.", co.wrap(function *(){
    let experimentName = UUID.v4();
    let variants = [];
    let variantsGlobal = [];
    let variantSubscription = emitter.addVariantListener(experimentName, (_experimentName, variantName) => {
      variants.push(variantName);
    });
    let variantSubscriptionGlobal = emitter.addVariantListener((_experimentName, variantName) => {
      variantsGlobal.push(variantName);
    });
    let App = React.createClass({
      render: function(){
        return <Experiment name={experimentName} value="A">
          <Variant name="A"><div id="variant-a" /></Variant>
          <Variant name="B"><div id="variant-b" /></Variant>
        </Experiment>;
      }
    });
    yield new Promise(function(resolve, reject){
      React.render(<App />, document.getElementById("react"), resolve);
    });
    assert.deepEqual(variants, ["A", "B"]);
    variantSubscription.remove();
    assert.deepEqual(variantsGlobal, ["A", "B"]);
    variantSubscriptionGlobal.remove();
  }));
  it("should emit when a variant is chosen.", co.wrap(function *(){
    let experimentName = UUID.v4();
    let valueName = null;
    let valueCallback = function(experimentName, variantName){
      valueName = variantName;
    };
    let experimentNameGlobal = null;
    let valueNameGlobal = null;
    let valueCallbackGlobal = function(expirimentName, variantName){
      experimentNameGlobal = expirimentName;
      valueNameGlobal = variantName;
    };
    let valueSubscription = emitter.addValueListener(experimentName, valueCallback);
    let valueSubscriptionGlobal = emitter.addValueListener(valueCallbackGlobal);
    let App = React.createClass({
      render: function(){
        return <Experiment ref="experiment" name={experimentName} value="A">
          <Variant name="A"><a id="variant-a" href="#A">A</a></Variant>
          <Variant name="B"><a id="variant-b" href="#B">B</a></Variant>
        </Experiment>;
      }
    });
    yield new Promise(function(resolve, reject){
      React.render(<App />, document.getElementById("react"), resolve);
    });
    assert.equal(valueName, "A");
    assert.equal(experimentNameGlobal, experimentName);
    assert.equal(valueNameGlobal, "A");
    valueSubscription.remove();
    valueSubscriptionGlobal.remove();
  }));
  it("should get the experiment value.", co.wrap(function *(){
    let experimentName = UUID.v4();
    let App = React.createClass({
      render: function(){
        return <Experiment ref="experiment" name={experimentName} value="A">
          <Variant name="A"><a id="variant-a" href="#A">A</a></Variant>
          <Variant name="B"><a id="variant-b" href="#B">B</a></Variant>
        </Experiment>;
      }
    });
    yield new Promise(function(resolve, reject){
      React.render(<App />, document.getElementById("react"), resolve);
    });
    assert.equal(emitter.getExperimentValue(experimentName), "A");
  }));
  it("should update the rendered component.", co.wrap(function *(){
    let experimentName = UUID.v4();
    let App = React.createClass({
      render: function(){
        return <Experiment name={experimentName} value="A">
          <Variant name="A"><div id="variant-a" /></Variant>
          <Variant name="B"><div id="variant-b" /></Variant>
        </Experiment>;
      }
    });
    yield new Promise(function(resolve, reject){
      React.render(<App />, document.getElementById("react"), resolve);
    });
    let elementA = document.getElementById('variant-a');
    let elementB = document.getElementById('variant-b');
    assert.notEqual(elementA, null);
    assert.equal(elementB, null);
    emitter.setExperimentValue(experimentName, "B");
    elementA = document.getElementById('variant-a');
    elementB = document.getElementById('variant-b');
    assert.equal(elementA, null);
    assert.notEqual(elementB, null);
  }));
});

