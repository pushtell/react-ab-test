import React from "react";
import ReactDOM from "react-dom";
import createReactClass from "create-react-class";
import Experiment from "../../src/CoreExperiment.jsx";
import Variant from "../../src/Variant.jsx";
import emitter from "../../src/emitter.jsx";
import mixpanelHelper from "../../src/helpers/mixpanel.jsx";
import assert from "assert";
import co from "co";
import UUID from "node-uuid";
import {canUseDOM} from 'fbjs/lib/ExecutionEnvironment';
import ES6Promise from 'es6-promise';
ES6Promise.polyfill();

describe("Mixpanel Helper", function() {
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
  it("should error if Mixpanel global is not set.", function (){
    assert.throws(
      function() {
        mixpanelHelper.enable();
      }, function(error) {
        return error.type === "PUSHTELL_HELPER_MISSING_GLOBAL";
      }
    );
  });
  it("should error if Mixpanel is disabled before it is enabled.", function (){
    assert.throws(
      function() {
        mixpanelHelper.disable();
      }, function(error) {
        return error.type === "PUSHTELL_HELPER_INVALID_DISABLE";
      }
    );
  });
  it("should report results to Mixpanel.", co.wrap(function *(){
    let playPromise, winPromise;
    if(canUseDOM) {
      // Mixpanel embed code wrapped in a promise.
      yield new Promise(function(resolve, reject){
        (function(e,b){if(!b.__SV){var a,f,i,g;window.mixpanel=b;b._i=[];b.init=function(a,e,d){function f(b,h){var a=h.split(".");2==a.length&&(b=b[a[0]],h=a[1]);b[h]=function(){b.push([h].concat(Array.prototype.slice.call(arguments,0)))}}var c=b;"undefined"!==typeof d?c=b[d]=[]:d="mixpanel";c.people=c.people||[];c.toString=function(b){var a="mixpanel";"mixpanel"!==d&&(a+="."+d);b||(a+=" (stub)");return a};c.people.toString=function(){return c.toString(1)+".people (stub)"};i="disable time_event track track_pageview track_links track_forms register register_once alias unregister identify name_tag set_config people.set people.set_once people.increment people.append people.union people.track_charge people.clear_charges people.delete_user".split(" ");
        for(g=0;g<i.length;g++)f(c,i[g]);b._i.push([a,e,d])};b.__SV=1.2;a=e.createElement("script");a.type="text/javascript";a.async=!0;a.src="undefined"!==typeof MIXPANEL_CUSTOM_LIB_URL?MIXPANEL_CUSTOM_LIB_URL:"file:"===e.location.protocol&&"//cdn.mxpnl.com/libs/mixpanel-2-latest.min.js".match(/^\/\//)?"https://cdn.mxpnl.com/libs/mixpanel-2-latest.min.js":"//cdn.mxpnl.com/libs/mixpanel-2-latest.min.js";f=e.getElementsByTagName("script")[0];f.parentNode.insertBefore(a,f)}})(document,window.mixpanel||[]);
        mixpanel.init("fe967f7ecc749aebaae9f7e38363c266", {loaded: resolve});
      });
      playPromise = new Promise(function(resolve, reject){
        let playSubscription = emitter.addListener("mixpanel-play", function(_experimentName, _variantName){
          assert.equal(_experimentName, experimentName);
          assert.equal(_variantName, "A");
          playSubscription.remove();
          resolve();
        });
      });
      winPromise = new Promise(function(resolve, reject){
        let winSubscription = emitter.addListener("mixpanel-win", function(_experimentName, _variantName){
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
    mixpanelHelper.enable();
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
    mixpanelHelper.disable();
    ReactDOM.unmountComponentAtNode(container);
    if(canUseDOM) {
      delete window.mixpanel;
    }
  }));
});

