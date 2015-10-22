if(canUseDOM) {
  const callback = function() {
    console.log("LOADED");
  }
  let firstScript = document.scripts[0];
  let script = document.createElement('script');
  script.type = 'text/javascript';
  script.src = "//www.google-analytics.com/cx/api.js"
  script.async = false;
  script.onreadystatechange = script.onload = function () {
    let state = script.readyState;
    if (!callback.done && (!state || /loaded|complete/.test(state))) {
      callback.done = true;
      callback();
    }
  };
  firstScript.parentNode.insertBefore(script, firstScript);
}