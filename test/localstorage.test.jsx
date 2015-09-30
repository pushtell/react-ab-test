import React from "react";
import Experiment from "../src/LocalStorage/Experiment.jsx";
import Variant from "../src/Variant.jsx";
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
        return <Experiment ref="experiment" name={experimentName} defaultValue="A" onWin={winCallback}>
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
