import React from "react";
import Experiment from "../src/Experiment.jsx";
import Variant from "../src/Variant.jsx";
import assert from "assert";
import co from "co";
import UUID from "node-uuid";
import ES6Promise from 'es6-promise';
ES6Promise.polyfill();

describe("Variant", function() {
  before(function(){
    let container = document.createElement("div");
    container.id = "react";
    document.getElementsByTagName('body')[0].appendChild(container);
  });
  after(function(){
    let container = document.getElementById("react");
    document.getElementsByTagName('body')[0].removeChild(container);
  });
  it("should render text nodes.", co.wrap(function *(){
    let experimentName = UUID.v4();
    let variantTextA = UUID.v4();
    let variantTextB = UUID.v4();
    let App = React.createClass({
      render: function(){
        return <Experiment name={experimentName} value="A">
          <Variant name="A">{variantTextA}</Variant>
          <Variant name="B">{variantTextB}</Variant>
        </Experiment>;
      }
    });
    yield new Promise(function(resolve, reject){
      React.render(<App />, document.getElementById("react"), resolve);
    });
    let element = document.getElementById('react');
    assert.notEqual(element.innerHTML.indexOf(variantTextA), null);
  }));
  it("should render components.", co.wrap(function *(){
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
  it("should render arrays of components.", co.wrap(function *(){
    let experimentName = UUID.v4();
    let App = React.createClass({
      render: function(){
        return <Experiment name={experimentName} value="A">
          <Variant name="A">
            <div id="variant-a" />
            <div />
          </Variant>
          <Variant name="B">
            <div id="variant-b" />
            <div />
          </Variant>
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
});

