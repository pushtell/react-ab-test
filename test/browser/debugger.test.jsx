import React from "react";
import ReactDOM from "react-dom";
import createReactClass from "create-react-class";
import Experiment from "../../src/CoreExperiment.jsx";
import Variant from "../../src/Variant.jsx";
import experimentDebugger from "../../src/debugger.jsx";
import emitter from "../../src/emitter.jsx";
import assert from "assert";
import co from "co";
import UUID from "node-uuid";
import TestUtils from 'react-dom/test-utils';
import ES6Promise from 'es6-promise';
ES6Promise.polyfill();

// See http://stackoverflow.com/a/985070

function hasCSSSelector(s){
  if(!document.styleSheets) {
    return '';
  }
  s = s.toLowerCase();
  var A, temp, n = document.styleSheets.length, SA = [];
  for(let i = 0; i < document.styleSheets.length; i++) {
    let sheet = document.styleSheets[i];
    let rules = sheet.rules ? sheet.rules : sheet.cssRules;
    for(let j = 0; j < rules.length; j++){
      let selector = rules[j].selectorText ? rules[j].selectorText : rules[j].toString();
      if(selector.toLowerCase() === s) {
        return true;
      }
    }
  }
  return false;
}

describe("Debugger", function() {
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
  it("should enable and disable.", co.wrap(function *(){
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
    experimentDebugger.enable();
    let element = document.getElementById('pushtell-debugger');
    assert.notEqual(element, null);
    experimentDebugger.disable();
    element = document.getElementById('pushtell-debugger');
    assert.equal(element, null);
    ReactDOM.unmountComponentAtNode(container);
  }));
  it("should add and remove style rules", function() {
    experimentDebugger.enable();
    assert.equal(hasCSSSelector("#pushtell-debugger"), true);
    experimentDebugger.disable();
    assert.equal(hasCSSSelector("#pushtell-debugger"), false);
  });
  it("should change an experiment's value.", co.wrap(function *(){
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
    experimentDebugger.enable();
    let elementA = document.getElementById('variant-a');
    let elementB = document.getElementById('variant-b');
    assert.notEqual(elementA, null);
    assert.equal(elementB, null);
    let handle = document.querySelector("#pushtell-debugger div.pushtell-handle");
    TestUtils.Simulate.click(handle);
    let radio_button_a = document.querySelector("#pushtell-debugger input[value='A']");
    let radio_button_b = document.querySelector("#pushtell-debugger input[value='B']");
    assert.equal(radio_button_a.checked, true);
    TestUtils.Simulate.click(radio_button_b);
    elementA = document.getElementById('variant-a');
    elementB = document.getElementById('variant-b');
    assert.equal(elementA, null);
    assert.notEqual(elementB, null);
    experimentDebugger.disable();
    ReactDOM.unmountComponentAtNode(container);
  }));
});

