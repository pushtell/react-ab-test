import React from "react";
import ReactDOM from "react-dom";
import createReactClass from "create-react-class";
import Experiment from "../../src/CoreExperiment.jsx";
import Variant from "../../src/Variant.jsx";
import emitter from "../../src/emitter.jsx";
import segmentHelper from "../../src/helpers/segment.jsx";
import assert from "assert";
import co from "co";
import UUID from "node-uuid";
import {canUseDOM} from 'fbjs/lib/ExecutionEnvironment';
import ES6Promise from 'es6-promise';
ES6Promise.polyfill();

describe("Segment Helper", function() {
  this.timeout(10000);
  let container;
  before(co.wrap(function *(){
    container = document.createElement("div");
    container.id = "react";
    document.getElementsByTagName('body')[0].appendChild(container);
  }));
  after(function(){
    document.getElementsByTagName('body')[0].removeChild(container);
    emitter._reset();
  });
  it("should error if Segment global is not set.", function (){
    assert.throws(
      function() {
        segmentHelper.enable();
      }, function(error) {
        return error.type === "PUSHTELL_HELPER_MISSING_GLOBAL";
      }
    );
  });
  it("should error if Segment is disabled before it is enabled.", function (){
    assert.throws(
      function() {
        segmentHelper.disable();
      }, function(error) {
        return error.type === "PUSHTELL_HELPER_INVALID_DISABLE";
      }
    );
  });
  it("should report results to Segment.", co.wrap(function *(){
    let playPromise, winPromise;
    if(canUseDOM) {
      // Segment Analytics.js embed code wrapped in a promise.
      yield new Promise(function(resolve, reject){
        !function(){var analytics=window.analytics=window.analytics||[];if(!analytics.initialize)if(analytics.invoked)window.console&&console.error&&console.error("Segment snippet included twice.");else{analytics.invoked=!0;analytics.methods=["trackSubmit","trackClick","trackLink","trackForm","pageview","identify","reset","group","track","ready","alias","page","once","off","on"];analytics.factory=function(t){return function(){var e=Array.prototype.slice.call(arguments);e.unshift(t);analytics.push(e);return analytics}};for(var t=0;t<analytics.methods.length;t++){var e=analytics.methods[t];analytics[e]=analytics.factory(e)}analytics.load=function(t){var e=document.createElement("script");e.type="text/javascript";e.async=!0;e.src=("https:"===document.location.protocol?"https://":"http://")+"cdn.segment.com/analytics.js/v1/"+t+"/analytics.min.js";var n=document.getElementsByTagName("script")[0];n.parentNode.insertBefore(e,n)};analytics.SNIPPET_VERSION="3.1.0";
          analytics.load("Ovh9rJDYwrrfoTMMj8p5LVB6pwutYsQm");
          }}();
        analytics.ready(resolve);
      });
      playPromise = new Promise(function(resolve, reject){
        let playSubscription = emitter.addListener("segment-play", function(_experimentName, _variantName){
          assert.equal(_experimentName, experimentName);
          assert.equal(_variantName, "A");
          playSubscription.remove();
          resolve();
        });
      });
      winPromise = new Promise(function(resolve, reject){
        let winSubscription = emitter.addListener("segment-win", function(_experimentName, _variantName){
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
    segmentHelper.enable();
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
    yield playPromise;
    emitter.emitWin(experimentName);
    yield winPromise;
    segmentHelper.disable();
    ReactDOM.unmountComponentAtNode(container);
    if(canUseDOM) {
      delete window.analytics;
    }
  }));
});

