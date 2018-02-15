import React from "react";
import ReactDOM from "react-dom";
import createReactClass from "create-react-class";
import Experiment from "../../src/CoreExperiment.jsx";
import Variant from "../../src/Variant.jsx";
import emitter from "../../src/emitter.jsx";
import assert from "assert";
import co from "co";
import UUID from "node-uuid";
import ES6Promise from 'es6-promise';
ES6Promise.polyfill();

describe("Variant", function() {
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
  it("should render text nodes.", co.wrap(function *(){
    let experimentName = UUID.v4();
    let variantTextA = UUID.v4();
    let variantTextB = UUID.v4();
    let App = createReactClass({
      render: function(){
        return <Experiment name={experimentName} value="A">
          <Variant name="A">{variantTextA}</Variant>
          <Variant name="B">{variantTextB}</Variant>
        </Experiment>;
      }
    });
    yield new Promise(function(resolve, reject){
      ReactDOM.render(<App />, container, resolve);
    });
    assert.notEqual(container.innerHTML.indexOf(variantTextA), null);
  }));
  it("should render components.", co.wrap(function *(){
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
    ReactDOM.unmountComponentAtNode(container);
  }));
  it("should render arrays of components.", co.wrap(function *(){
    let experimentName = UUID.v4();
    let App = createReactClass({
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
      ReactDOM.render(<App />, container, resolve);
    });
    let elementA = document.getElementById('variant-a');
    let elementB = document.getElementById('variant-b');
    assert.notEqual(elementA, null);
    assert.equal(elementB, null);
    ReactDOM.unmountComponentAtNode(container);
  }));
});

