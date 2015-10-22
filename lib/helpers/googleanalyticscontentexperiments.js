'use strict';

if (canUseDOM) {
  (function () {
    var callback = function callback() {
      console.log("LOADED");
    };
    var firstScript = document.scripts[0];
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = "//www.google-analytics.com/cx/api.js";
    script.async = false;
    script.onreadystatechange = script.onload = function () {
      var state = script.readyState;
      if (!callback.done && (!state || /loaded|complete/.test(state))) {
        callback.done = true;
        callback();
      }
    };
    firstScript.parentNode.insertBefore(script, firstScript);
  })();
}