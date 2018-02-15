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

function add(a, b) {
  return a + b;
}

describe("Weighted Experiment", function() {
  this.timeout(10000);
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
  it("should choose a weighted variants.", co.wrap(function *(){
    const experimentName = UUID.v4();
    const variantNames = [];
    const variantWeights = [];
    const playCount = {};
    for(let i = 0; i < 5; i++) {
      variantNames.push(UUID.v4());
      variantWeights.push(Math.floor(Math.random() * 100));
    }
    const weightSum = variantWeights.reduce(add, 0);
    emitter.defineVariants(experimentName, variantNames, variantWeights);
    assert.equal(emitter.getSortedVariantWeights(experimentName).reduce(add, 0), weightSum);
    let App = createReactClass({
      render: function(){
        return <Experiment name={experimentName}>
          {variantNames.map(name => {
            return <Variant key={name} name={name}><div id={'variant-' + name}></div></Variant>
          })}
        </Experiment>;
      }
    });
    let chosenVariant;
    emitter.addListener("play", function(experimentName, variantName){
      playCount[variantName] = playCount[variantName] || 0;
      playCount[variantName] += 1;
    });
    for(let i = 0; i < 1000; i++) {
      yield new Promise(function(resolve, reject){
        ReactDOM.render(<App />, container, resolve);
      });
      ReactDOM.unmountComponentAtNode(container);
      store.clear();
      emitter._resetPlayedExperiments();
    }
    const playSum = Object.keys(playCount).map(function(variantName){
      return playCount[variantName] || 0;
    }).reduce(add, 0);
    const playCountToWeightRatios = variantNames.map(function(variantName, index){
      return playCount[variantName] / playSum / (variantWeights[index] / weightSum)
    });
    const ratioMean = playCountToWeightRatios.reduce(add, 0) / playCountToWeightRatios.length;
    const ratioVariance = playCountToWeightRatios.map(function(ratio){
      return Math.pow(ratioMean - ratio, 2);
    }).reduce(add, 0);
    const ratioStandardDeviation = Math.sqrt(ratioVariance);
    assert(ratioStandardDeviation < 0.6);
  }));
});
