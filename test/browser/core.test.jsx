import React from "react";
import ReactDOM from "react-dom";
import Experiment from "../../src/CoreExperiment.jsx";
import Variant from "../../src/Variant.jsx";
import emitter from "../../src/emitter.jsx";
import assert from "assert";
import co from "co";
import UUID from "node-uuid";
import ES6Promise from 'es6-promise';
ES6Promise.polyfill();

describe("Core Experiment", function() {
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
  it("should render the correct variant.", co.wrap(function *(){
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
      ReactDOM.render(<App />, container, resolve);
    });
    let elementA = document.getElementById('variant-a');
    let elementB = document.getElementById('variant-b');
    assert.notEqual(elementA, null);
    assert.equal(elementB, null);
    ReactDOM.unmountComponentAtNode(container);
  }));
  it("should error if invalid children exist.", co.wrap(function *(){
    let experimentName = UUID.v4();
    let App = React.createClass({
      render: function(){
        return <Experiment name={experimentName} value="A">
          <Variant name="A"><div id="variant-a" /></Variant>
          <div />
        </Experiment>;
      }
    });
    try {
      yield new Promise(function(resolve, reject){
        ReactDOM.render(<App />, container, resolve);
      });
    } catch(error) {
      if(error.type !== "PUSHTELL_INVALID_CHILD") {
        throw error;
      }
      ReactDOM.unmountComponentAtNode(container);
      return;
    }
    throw new Error("Experiment has invalid children.");
  }));
  it("should update on componentWillReceiveProps.", co.wrap(function *(){
    let experimentName = UUID.v4();
    let setState;
    let getValueA = function(){
      return "A";
    }
    let getValueB = function() {
      return "B";
    }
    let App = React.createClass({
      getInitialState: function(){
        return {
          value: getValueA
        }
      },
      componentWillMount: function(){
        setState = this.setState.bind(this);
      },
      render: function(){
        return <Experiment name={experimentName} value={this.state.value}>
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
    setState({
      value: getValueB
    });
    elementA = document.getElementById('variant-a');
    elementB = document.getElementById('variant-b');
    assert.equal(elementA, null);
    assert.notEqual(elementB, null);
    ReactDOM.unmountComponentAtNode(container);
  }));
  it("should update children components when their props change", co.wrap(function *(){
    let experimentName = UUID.v4();

    let SubComponent = React.createClass({
      render(){
        return (
            <div id="variant-a">
              <span id="variant-a-text">{this.props.text}</span>
            </div>
        )
      }
    });

    let variantAText = "Initial text";

    let renderHelper = {
      init(callback) {
        this.callback = callback;
      },
      reRender() {
        this.callback();
      }
    };

    let App = React.createClass({
      componentDidMount(){
        renderHelper.init(this.callback);
      },
      callback() {
        this.forceUpdate();
      },
      render(){
        return (
          <Experiment name={experimentName} value="A" isContentDynamic>
            <Variant name="A">
              <SubComponent text={variantAText}/>
            </Variant>
            <Variant name="B"><div id="variant-b" /></Variant>
          </Experiment>
        )
      }
    });
    yield new Promise(function(resolve, reject){
      ReactDOM.render(<App />, container, resolve);
    });
    let elementA = document.getElementById('variant-a');
    let elementB = document.getElementById('variant-b');
    assert.notEqual(elementA, null);
    assert.equal(elementB, null);

    let elementAText = document.getElementById('variant-a-text');
    console.log(elementAText.textContent);
    assert.equal(elementAText.textContent, variantAText);

    variantAText = "Initial text 2";
    renderHelper.reRender();
    elementAText = document.getElementById('variant-a-text');

    assert.equal(elementAText.textContent, variantAText);

    ReactDOM.unmountComponentAtNode(container);
  }));
});

