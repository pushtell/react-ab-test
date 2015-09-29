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
    let element_a = document.getElementById('expiriment-a');
    let element_b = document.getElementById('expiriment-b');
    assert.notEqual(element_a, null);
    assert.equal(element_b, null);
  }));
  it("should callback when a variant is played.", co.wrap(function *(){
    let played_variant = null;
    let playCallback = function(variant){
      played_variant = variant;
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
    assert.equal(played_variant, "A");
  }));
  it("should fail.", co.wrap(function *(){
    assert.equal(true, false);
  }));
});


