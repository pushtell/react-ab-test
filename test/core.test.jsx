import React from "react";
import Expiriment from "../src/Expiriment.jsx";
import Variant from "../src/Variant.jsx";
import assert from "assert";
import co from "co";
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
    let App = React.createClass({
      render: function(){
        return <Expiriment name="test" value="A">
          <Variant name="A"><div id="expiriment-a" /></Variant>
          <Variant name="B"><div id="expiriment-b" /></Variant>
        </Expiriment>;
      }
    });
    yield new Promise(function(resolve, reject){
      React.render(<App />, document.getElementById("react"), resolve);
    });
    let elementA = document.getElementById('expiriment-a');
    let elementB = document.getElementById('expiriment-b');
    assert.notEqual(elementA, null);
    assert.equal(elementB, null);
  }));
  it("should callback when a variant is played.", co.wrap(function *(){
    let playedVariant = null;
    let playCallback = function(variant){
      playedVariant = variant;
    };
    let App = React.createClass({
      render: function(){
        return <Expiriment name="test" value="A" onPlay={playCallback}>
          <Variant name="A"><div id="expiriment-a"/></Variant>
          <Variant name="B"><div id="expiriment-b"/></Variant>
        </Expiriment>;
      }
    });
    yield new Promise(function(resolve, reject){
      React.render(<App />, document.getElementById("react"), resolve);
    });
    assert.equal(playedVariant, "A");
  }));
  it("should callback when a variant wins.", co.wrap(function *(){
    let winningVariant = null;
    let winCallback = function(variant){
      winningVariant = variant;
    };
    let App = React.createClass({
      render: function(){
        return <Expiriment name="test" value="A" onWin={winCallback}>
          <Variant name="A"><div id="expiriment-a"/></Variant>
          <Variant name="B"><div id="expiriment-b"/></Variant>
        </Expiriment>;
      }
    });
    yield new Promise(function(resolve, reject){
      React.render(<App />, document.getElementById("react"), resolve);
    });
    Expiriment.win("test", "A");
    assert.equal(winningVariant, "A");
  }));
});


