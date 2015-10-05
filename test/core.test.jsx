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
          <Variant name="A"><div id="experiment-a" /></Variant>
          <Variant name="B"><div id="experiment-b" /></Variant>
        </Experiment>;
      }
    });
    yield new Promise(function(resolve, reject){
      React.render(<App />, document.getElementById("react"), resolve);
    });
    let elementA = document.getElementById('experiment-a');
    let elementB = document.getElementById('experiment-b');
    assert.notEqual(elementA, null);
    assert.equal(elementB, null);
  }));
  it("should callback when a variant is played.", co.wrap(function *(){
    let experimentName = UUID.v4();
    let playedVariant = null;
    let playCallback = function(variant){
      playedVariant = variant;
    };
    let App = React.createClass({
      render: function(){
        return <Experiment name={experimentName} value="A" onPlay={playCallback}>
          <Variant name="A"><div id="experiment-a"/></Variant>
          <Variant name="B"><div id="experiment-b"/></Variant>
        </Experiment>;
      }
    });
    yield new Promise(function(resolve, reject){
      React.render(<App />, document.getElementById("react"), resolve);
    });
    assert.equal(playedVariant, "A");
  }));
  it("should callback when a variant wins.", co.wrap(function *(){
    let experimentName = UUID.v4();
    let winningVariant = null;
    let winCallback = function(variant){
      winningVariant = variant;
    };
    let App = React.createClass({
      render: function(){
        return <Experiment name={experimentName} value="A" onWin={winCallback}>
          <Variant name="A"><div id="experiment-a"/></Variant>
          <Variant name="B"><div id="experiment-b"/></Variant>
        </Experiment>;
      }
    });
    yield new Promise(function(resolve, reject){
      React.render(<App />, document.getElementById("react"), resolve);
    });
    emitter.win(experimentName);
    assert.equal(winningVariant, "A");
  }));
  it("should callback when a variant is clicked.", co.wrap(function *(){
    let experimentName = UUID.v4();
    let winningVariant = null;
    let winCallback = function(variant){
      winningVariant = variant;
    };
    let App = React.createClass({
      onClickVariant: function(e){
        this.refs.experiment.win();
      },
      render: function(){
        return <Experiment ref="experiment" name={experimentName} value="A" onWin={winCallback}>
          <Variant name="A"><a id="experiment-a" href="#A" onClick={this.onClickVariant}>A</a></Variant>
          <Variant name="B"><a id="experiment-b" href="#B" onClick={this.onClickVariant}>B</a></Variant>
        </Experiment>;
      }
    });
    yield new Promise(function(resolve, reject){
      React.render(<App />, document.getElementById("react"), resolve);
    });
    let elementA = document.getElementById('experiment-a');
    mouse.click(elementA);
    assert.equal(winningVariant, "A");
  }));
});

