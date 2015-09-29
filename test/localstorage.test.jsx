import React from "react";
import Expiriment from "../src/LocalStorage/Expiriment.jsx";
import Variant from "../src/Variant.jsx";
import assert from "assert";
import co from "co";
import UUID from "node-uuid";
import ES6Promise from 'es6-promise';
ES6Promise.polyfill();

describe("LocalStorage", function() {
  before(function(){
    let container = document.createElement("div");
    container.id = "react";
    document.getElementsByTagName('body')[0].appendChild(container);
  });
  after(function(){
    let container = document.getElementById("react");
    document.getElementsByTagName('body')[0].removeChild(container);
  });
  it("should render the correct variant.", co.wrap(function *(){
    let variant_names = [];
    for(let i = 0; i < 100; i++) {
      variant_names.push(UUID.v4());
    }
    let defaultValue = variant_names[Math.floor(Math.random() * variant_names.length)];
    let AppWithDefaultValue = React.createClass({
      render: function(){
        return <Expiriment name="test" defaultValue={defaultValue}>
          {variant_names.map(name => {
            return <Variant key={name} name={name}><div id={'expiriment-' + name}></div></Variant>
          })}
        </Expiriment>;
      }
    });
    let AppWithoutDefaultValue = React.createClass({
      render: function(){
        return <Expiriment name="test">
          {variant_names.map(name => {
            return <Variant key={name} name={name}><div id={'expiriment-' + name}></div></Variant>
          })}
        </Expiriment>;
      }
    });
    yield new Promise(function(resolve, reject){
      React.render(<AppWithDefaultValue />, document.getElementById("react"), resolve);
    });
    let elementWithDefualtValue = document.getElementById('expiriment-' + defaultValue);
    assert.notEqual(elementWithDefualtValue, null);
    yield new Promise(function(resolve, reject){
      React.render(<AppWithoutDefaultValue />, document.getElementById("react"), resolve);
    });
    let elementWithoutDefualtValue = document.getElementById('expiriment-' + defaultValue);
    assert.notEqual(elementWithoutDefualtValue, null);
  }));
});
