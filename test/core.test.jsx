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

describe("Core", function() {
  before(function(){
    let container = document.createElement("div");
    container.id = "react";
    document.getElementsByTagName('body')[0].appendChild(container);
  });
  after(function(){
    let container = document.getElementById("react");
    document.getElementsByTagName('body')[0].removeChild(container);
  });
  it("should render the correct variant.", co.wrap(function *(){
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
  }));
  it("should error if an invalid children exist.", co.wrap(function *(){
    let experimentName = UUID.v4();
    let App = React.createClass({
      render: function(){
        return <Experiment name={experimentName} value="A">
          <Variant name="A"><div id="variant-a" /></Variant>
          <div />
        </Experiment>;
      }
    });
    try {
      yield new Promise(function(resolve, reject){
        React.render(<App />, document.getElementById("react"), resolve);
      });
    } catch(error) {
      if(error.type !== "PUSHTELL_INVALID_CHILD") {
        throw error;
      }
      return;
    }
    throw new Error("Experiment has invalid children.");
  }));
  it("should callback when a variant is played.", co.wrap(function *(){
    let experimentName = UUID.v4();
    let playedVariant = null;
    let playCallback = function(variant){
      playedVariant = variant;
    };
    let playSubscription = emitter.addPlayListener(experimentName, playCallback);
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
    assert.equal(playedVariant, "A");
    playSubscription.remove();
  }));
  it("should callback when a variant wins.", co.wrap(function *(){
    let experimentName = UUID.v4();
    let winningVariant = null;
    let winCallback = function(variant){
      winningVariant = variant;
    };
    let winSubscription = emitter.addWinListener(experimentName, winCallback);
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
    assert.equal(winningVariant, "A");
    winSubscription.remove();
  }));
  it("should callback when a variant is clicked.", co.wrap(function *(){
    let experimentName = UUID.v4();
    let winningVariant = null;
    let winCallback = function(variant){
      winningVariant = variant;
    };
    let winSubscription = emitter.addWinListener(experimentName, winCallback);
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
    assert.equal(winningVariant, "A");
    winSubscription.remove();
  }));
});

