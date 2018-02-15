import React from "react";
import ReactDOM from "react-dom";
import createReactClass from "create-react-class";
import Experiment from "../../src/Experiment.jsx";
import Variant from "../../src/Variant.jsx";
import emitter from "../../src/emitter.jsx";
import assert from "assert";
import co from "co";
import UUID from "node-uuid";
import TestUtils from 'react-dom/test-utils';
import ES6Promise from 'es6-promise';
ES6Promise.polyfill();

let store;

let noopStore = {
  getItem: function(){},
  setItem: function(){},
  clear: function(){}
};

if(typeof window !== 'undefined' && 'localStorage' in window && window['localStorage'] !== null) {
  try {
    let key = '__pushtell_react__';
    window.localStorage.setItem(key, key);
    if (window.localStorage.getItem(key) !== key) {
      store = noopStore;
    } else {
      window.localStorage.removeItem(key);
      store = window.localStorage;
    }
  } catch(e) {
    store = noopStore;
  }
} else {
  store = noopStore;
}

describe("Experiment", function() {
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
  it("should choose a version.", co.wrap(function *(){
    let experimentName = UUID.v4();
    let variantNames = [];
    for(let i = 0; i < 100; i++) {
      variantNames.push(UUID.v4());
    }
    let App = createReactClass({
      render: function(){
        return <Experiment name={experimentName}>
          {variantNames.map(name => {
            return <Variant key={name} name={name}><div id={'variant-' + name}></div></Variant>
          })}
        </Experiment>;
      }
    });
    yield new Promise(function(resolve, reject){
      ReactDOM.render(<App />, container, resolve);
    });
    ReactDOM.unmountComponentAtNode(container);
  }));
  it("should render the correct variant.", co.wrap(function *(){
    let experimentName = UUID.v4();
    let variantNames = [];
    for(let i = 0; i < 100; i++) {
      variantNames.push(UUID.v4());
    }
    let defaultVariantName = variantNames[Math.floor(Math.random() * variantNames.length)];
    let AppWithdefaultVariantName = createReactClass({
      render: function(){
        return <Experiment name={experimentName} defaultVariantName={defaultVariantName}>
          {variantNames.map(name => {
            return <Variant key={name} name={name}><div id={'variant-' + name}></div></Variant>
          })}
        </Experiment>;
      }
    });
    let AppWithoutdefaultVariantName = createReactClass({
      render: function(){
        return <Experiment name={experimentName}>
          {variantNames.map(name => {
            return <Variant key={name} name={name}><div id={'variant-' + name}></div></Variant>
          })}
        </Experiment>;
      }
    });
    yield new Promise(function(resolve, reject){
      ReactDOM.render(<AppWithdefaultVariantName />, container, resolve);
    });
    let elementWithdefaultVariantName = document.getElementById('variant-' + defaultVariantName);
    assert.notEqual(elementWithdefaultVariantName, null);
    ReactDOM.unmountComponentAtNode(container);
    yield new Promise(function(resolve, reject){
      ReactDOM.render(<AppWithoutdefaultVariantName />, container, resolve);
    });
    let elementWithoutdefaultVariantName = document.getElementById('variant-' + defaultVariantName);
    assert.notEqual(elementWithoutdefaultVariantName, null);
    ReactDOM.unmountComponentAtNode(container);
  }));
  it("should error if variants are added to a experiment after a variant was selected.", co.wrap(function *(){
    let experimentName = UUID.v4();
    let AppPart1 = createReactClass({
      onClickVariant: function(e){
        this.refs.experiment.win();
      },
      render: function(){
        return <Experiment ref="experiment" name={experimentName}>
          <Variant name="A"><a id="variant-a" href="#A">A</a></Variant>
          <Variant name="B"><a id="variant-b" href="#B">B</a></Variant>
        </Experiment>;
      }
    });
    let AppPart2 = createReactClass({
      onClickVariant: function(e){
        this.refs.experiment.win();
      },
      render: function(){
        return <Experiment ref="experiment" name={experimentName}>
          <Variant name="C"><a id="variant-c" href="#C">C</a></Variant>
          <Variant name="D"><a id="variant-d" href="#D">D</a></Variant>
        </Experiment>;
      }
    });
    yield new Promise(function(resolve, reject){
      ReactDOM.render(<AppPart1 />, container, resolve);
    });
    ReactDOM.unmountComponentAtNode(container);
    try {
      yield new Promise(function(resolve, reject){
        ReactDOM.render(<AppPart2 />, container, resolve);
      });
    } catch(error) {
      if(error.type !== "PUSHTELL_INVALID_VARIANT") {
        throw error;
      }
      ReactDOM.unmountComponentAtNode(container);
      return;
    }
    throw new Error("New variant was added after variant was selected.");
  }));
  it("should not error if variants are added to a experiment after a variant was selected if variants were defined.", co.wrap(function *(){
    let experimentName = UUID.v4();
    emitter.defineVariants(experimentName, ["A", "B", "C", "D"]);
    let AppPart1 = createReactClass({
      onClickVariant: function(e){
        this.refs.experiment.win();
      },
      render: function(){
        return <Experiment ref="experiment" name={experimentName}>
          <Variant name="A"><a id="variant-a" href="#A">A</a></Variant>
          <Variant name="B"><a id="variant-b" href="#B">B</a></Variant>
        </Experiment>;
      }
    });
    let AppPart2 = createReactClass({
      onClickVariant: function(e){
        this.refs.experiment.win();
      },
      render: function(){
        return <Experiment ref="experiment" name={experimentName}>
          <Variant name="C"><a id="variant-c" href="#C">C</a></Variant>
          <Variant name="D"><a id="variant-d" href="#D">D</a></Variant>
        </Experiment>;
      }
    });
    yield new Promise(function(resolve, reject){
      ReactDOM.render(<AppPart1 />, container, resolve);
    });
    ReactDOM.unmountComponentAtNode(container);
    yield new Promise(function(resolve, reject){
      ReactDOM.render(<AppPart2 />, container, resolve);
    });
    ReactDOM.unmountComponentAtNode(container);
  }));
  it("should error if a variant is added to an experiment after variants were defined.", co.wrap(function *(){
    let experimentName = UUID.v4();
    emitter.defineVariants(experimentName, ["A", "B", "C"]);
    let AppPart1 = createReactClass({
      onClickVariant: function(e){
        this.refs.experiment.win();
      },
      render: function(){
        return <Experiment ref="experiment" name={experimentName}>
          <Variant name="A"><a id="variant-a" href="#A">A</a></Variant>
          <Variant name="B"><a id="variant-b" href="#B">B</a></Variant>
        </Experiment>;
      }
    });
    let AppPart2 = createReactClass({
      onClickVariant: function(e){
        this.refs.experiment.win();
      },
      render: function(){
        return <Experiment ref="experiment" name={experimentName}>
          <Variant name="C"><a id="variant-c" href="#C">C</a></Variant>
          <Variant name="D"><a id="variant-d" href="#D">D</a></Variant>
        </Experiment>;
      }
    });
    yield new Promise(function(resolve, reject){
      ReactDOM.render(<AppPart1 />, container, resolve);
    });
    ReactDOM.unmountComponentAtNode(container);
    try {
      yield new Promise(function(resolve, reject){
        ReactDOM.render(<AppPart2 />, container, resolve);
      });
    } catch(error) {
      if(error.type !== "PUSHTELL_INVALID_VARIANT") {
        throw error;
      }
      ReactDOM.unmountComponentAtNode(container);
      return;
    }
    throw new Error("New variant was added after variants were defined.");
  }));
  it("should not error if an older test variant is set.", co.wrap(function *(){
    let experimentName = UUID.v4();
    localStorage.setItem("PUSHTELL-" + experimentName, "C");
    let App = createReactClass({
      render: function(){
        return <Experiment name={experimentName}>
          <Variant name="A"><a id="variant-a" href="#A" onClick={this.onClickVariant}>A</a></Variant>
          <Variant name="B"><a id="variant-b" href="#B" onClick={this.onClickVariant}>B</a></Variant>
        </Experiment>;
      }
    });
    yield new Promise(function(resolve, reject){
      ReactDOM.render(<App />, container, resolve);
    });
    ReactDOM.unmountComponentAtNode(container);
  }));
  it("should emit when a variant is clicked.", co.wrap(function *(){
    let experimentName = UUID.v4();
    let winningVariantName = null;
    let winCallback = function(experimentName, variantName){
      winningVariantName = variantName;
    };
    let experimentNameGlobal = null;
    let winningVariantNameGlobal = null;
    let winCallbackGlobal = function(experimentName, variantName){
      experimentNameGlobal = experimentName;
      winningVariantNameGlobal = variantName;
    };
    let winSubscription = emitter.addWinListener(experimentName, winCallback);
    let winSubscriptionGlobal = emitter.addWinListener(winCallbackGlobal);
    let App = createReactClass({
      onClickVariant: function(e){
        this.refs.experiment.win();
      },
      render: function(){
        return <Experiment ref="experiment" name={experimentName} defaultVariantName="A">
          <Variant name="A"><a id="variant-a" href="#A" onClick={this.onClickVariant}>A</a></Variant>
          <Variant name="B"><a id="variant-b" href="#B" onClick={this.onClickVariant}>B</a></Variant>
        </Experiment>;
      }
    });
    yield new Promise(function(resolve, reject){
      ReactDOM.render(<App />, container, resolve);
    });
    let elementA = document.getElementById('variant-a');
    TestUtils.Simulate.click(elementA);
    assert.equal(winningVariantName, "A");
    assert.equal(experimentNameGlobal, experimentName);
    assert.equal(winningVariantNameGlobal, "A");
    winSubscription.remove();
    winSubscriptionGlobal.remove();
    ReactDOM.unmountComponentAtNode(container);
  }));
  it("should choose the same variant when a user identifier is defined.", co.wrap(function *(){
    let userIdentifier = UUID.v4();
    let experimentName = UUID.v4();
    let variantNames = [];
    for(let i = 0; i < 100; i++) {
      variantNames.push(UUID.v4());
    }
    let App = createReactClass({
      render: function(){
        return <Experiment name={experimentName} userIdentifier={userIdentifier}>
          {variantNames.map(name => {
            return <Variant key={name} name={name}><div id={'variant-' + name}></div></Variant>
          })}
        </Experiment>;
      }
    });
    let chosenVariant;
    emitter.once("play", function(experimentName, variantName){
      chosenVariant = variantName;
    });
    yield new Promise(function(resolve, reject){
      ReactDOM.render(<App />, container, resolve);
    });
    ReactDOM.unmountComponentAtNode(container);
    assert(chosenVariant);
    for(let i = 0; i < 100; i++) {
      emitter._reset();
      store.clear();
      yield new Promise(function(resolve, reject){
        ReactDOM.render(<App />, container, resolve);
      });
      let element = document.getElementById('variant-' + chosenVariant);
      assert.notEqual(element, null);
      ReactDOM.unmountComponentAtNode(container);
    }
  }));
});
