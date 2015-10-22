import React from "react";
import ReactDOM from "react-dom";
import Experiment from "../src/CoreExperiment.jsx";
import Variant from "../src/Variant.jsx";
import emitter from "../src/emitter.jsx";
import googleAnalyticsHelper from "../src/helpers/googleanalytics.jsx";
import assert from "assert";
import co from "co";
import UUID from "node-uuid";
import {canUseDOM} from 'fbjs/lib/ExecutionEnvironment';
import ES6Promise from 'es6-promise';
ES6Promise.polyfill();

describe("Google Analytics Helper", function() {
  let container;
  before(co.wrap(function *(){
    container = document.createElement("div");
    container.id = "react";
    document.getElementsByTagName('body')[0].appendChild(container);
  }));
  after(function(){
    document.getElementsByTagName('body')[0].removeChild(container);
  });
  it("should error if Google Analytics global is not set.", function (){
    assert.throws(
      function() {
        googleAnalyticsHelper.enable();
      }, function(error) {
        return error.type === "PUSHTELL_HELPER_MISSING_GLOBAL";
      }
    );
  });
  it("should error if Google Analytics is disabled before it is enabled.", function (){
    assert.throws(
      function() {
        googleAnalyticsHelper.disable();
      }, function(error) {
        return error.type === "PUSHTELL_HELPER_INVALID_DISABLE";
      }
    );
  });
  it("should report results to Google Analytics.", co.wrap(function *(){
    let playPromise, winPromise;
    if(canUseDOM) {
      // Google Analytics embed code wrapped in a promise.
      yield new Promise(function(resolve, reject){
        (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
        (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
        m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
        })(window,document,'script','//www.google-analytics.com/analytics.js','ga');
        ga('create', 'UA-69110406-1', 'auto');
        ga(resolve);
      });
      playPromise = new Promise(function(resolve, reject){
        let playSubscription = emitter.addListener("googleanalytics-play", function(_experimentName, _variantName){
          assert.equal(_experimentName, experimentName);
          assert.equal(_variantName, "A");
          playSubscription.remove();
          resolve();
        });
      });
      winPromise = new Promise(function(resolve, reject){
        let winSubscription = emitter.addListener("googleanalytics-win", function(_experimentName, _variantName){
          assert.equal(_experimentName, experimentName);
          assert.equal(_variantName, "A");
          winSubscription.remove();
          resolve();
        });
      });
    } else {
      playPromise = Promise.resolve();
      winPromise = Promise.resolve();
    }
    googleAnalyticsHelper.enable();
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
    yield playPromise;
    emitter.emitWin(experimentName);
    yield winPromise;
    googleAnalyticsHelper.disable();
    ReactDOM.unmountComponentAtNode(container);
    if(canUseDOM) {
      delete window.ga;
    }
  }));
});

