import React from "react";
import ReactDOM from "react-dom";
import Experiment from "../src/Experiment.jsx";
import Variant from "../src/Variant.jsx";
import emitter from "../src/emitter.jsx";
import assert from "assert";
import co from "co";
import UUID from "node-uuid";
import TestUtils from 'react/lib/ReactTestUtils'
import ES6Promise from 'es6-promise';
ES6Promise.polyfill();

describe("Experiment", function() {
  let container;
  before(function(){
    container = document.createElement("div");
    container.id = "react";
    document.getElementsByTagName('body')[0].appendChild(container);
  });
  after(function(){
    document.getElementsByTagName('body')[0].removeChild(container);
  });
  it("should choose a version.", co.wrap(function *(){
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
    let AppWithdefaultVariantName = React.createClass({
      render: function(){
        return <Experiment name={experimentName} defaultVariantName={defaultVariantName}>
          {variantNames.map(name => {
            return <Variant key={name} name={name}><div id={'experiment-' + name}></div></Variant>
          })}
        </Experiment>;
      }
    });
    let AppWithoutdefaultVariantName = React.createClass({
      render: function(){
        return <Experiment name={experimentName}>
          {variantNames.map(name => {
            return <Variant key={name} name={name}><div id={'experiment-' + name}></div></Variant>
          })}
        </Experiment>;
      }
    });
    yield new Promise(function(resolve, reject){
      ReactDOM.render(<AppWithdefaultVariantName />, container, resolve);
    });
    let elementWithdefaultVariantName = document.getElementById('experiment-' + defaultVariantName);
    assert.notEqual(elementWithdefaultVariantName, null);
    ReactDOM.unmountComponentAtNode(container);
    yield new Promise(function(resolve, reject){
      ReactDOM.render(<AppWithoutdefaultVariantName />, container, resolve);
    });
    let elementWithoutdefaultVariantName = document.getElementById('experiment-' + defaultVariantName);
    assert.notEqual(elementWithoutdefaultVariantName, null);
    ReactDOM.unmountComponentAtNode(container);
  }));
  it("should error if variants are added to a experiment after a variant was selected.", co.wrap(function *(){
    let experimentName = UUID.v4();
    let AppPart1 = React.createClass({
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
    let AppPart2 = React.createClass({
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
    let AppPart1 = React.createClass({
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
    let AppPart2 = React.createClass({
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
    let AppPart1 = React.createClass({
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
    let AppPart2 = React.createClass({
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
    let App = React.createClass({
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
    let winCallbackGlobal = function(expirimentName, variantName){
      experimentNameGlobal = expirimentName;
      winningVariantNameGlobal = variantName;
    };
    let winSubscription = emitter.addWinListener(experimentName, winCallback);
    let winSubscriptionGlobal = emitter.addWinListener(winCallbackGlobal);
    let App = React.createClass({
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
});
