import React from "react";
import Expiriment from "../src/Expiriment.jsx";
import Variant from "../src/Variant.jsx";
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
    let expirimentName = UUID.v4();
    let App = React.createClass({
      render: function(){
        return <Expiriment name={expirimentName} value="A">
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
    let expirimentName = UUID.v4();
    let playedVariant = null;
    let playCallback = function(variant){
      playedVariant = variant;
    };
    let App = React.createClass({
      render: function(){
        return <Expiriment name={expirimentName} value="A" onPlay={playCallback}>
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
    let expirimentName = UUID.v4();
    let winningVariant = null;
    let winCallback = function(variant){
      winningVariant = variant;
    };
    let App = React.createClass({
      render: function(){
        return <Expiriment name={expirimentName} value="A" onWin={winCallback}>
          <Variant name="A"><div id="expiriment-a"/></Variant>
          <Variant name="B"><div id="expiriment-b"/></Variant>
        </Expiriment>;
      }
    });
    yield new Promise(function(resolve, reject){
      React.render(<App />, document.getElementById("react"), resolve);
    });
    Expiriment.win(expirimentName);
    assert.equal(winningVariant, "A");
  }));
  it("should callback when a variant is clicked.", co.wrap(function *(){
    let expirimentName = UUID.v4();
    let winningVariant = null;
    let winCallback = function(variant){
      winningVariant = variant;
    };
    let App = React.createClass({
      onClickVariant: function(e){
        this.refs.expiriment.win();
      },
      render: function(){
        return <Expiriment ref="expiriment" name={expirimentName} value="A" onWin={winCallback}>
          <Variant name="A"><a id="expiriment-a" href="#A" onClick={this.onClickVariant}>A</a></Variant>
          <Variant name="B"><a id="expiriment-b" href="#B" onClick={this.onClickVariant}>B</a></Variant>
        </Expiriment>;
      }
    });
    yield new Promise(function(resolve, reject){
      React.render(<App />, document.getElementById("react"), resolve);
    });
    let elementA = document.getElementById('expiriment-a');
    mouse.click(elementA);
    assert.equal(winningVariant, "A");
  }));
});


