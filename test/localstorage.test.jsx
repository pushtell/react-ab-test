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
  it("should choose a version.", co.wrap(function *(){
    let reactElement = document.getElementById("react");
    let testName = UUID.v4();
    let variantNames = [];
    for(let i = 0; i < 100; i++) {
      variantNames.push(UUID.v4());
    }
    let App = React.createClass({
      render: function(){
        return <Expiriment name={testName}>
          {variantNames.map(name => {
            return <Variant key={name} name={name}><div id={'expiriment-' + name}></div></Variant>
          })}
        </Expiriment>;
      }
    });
    yield new Promise(function(resolve, reject){
      React.render(<App />, reactElement, resolve);
    });
  }));
  it("should render the correct variant.", co.wrap(function *(){
    let reactElement = document.getElementById("react");
    let testName = UUID.v4();
    let variantNames = [];
    for(let i = 0; i < 100; i++) {
      variantNames.push(UUID.v4());
    }
    let defaultValue = variantNames[Math.floor(Math.random() * variantNames.length)];
    let AppWithDefaultValue = React.createClass({
      render: function(){
        return <Expiriment name={testName} defaultValue={defaultValue}>
          {variantNames.map(name => {
            return <Variant key={name} name={name}><div id={'expiriment-' + name}></div></Variant>
          })}
        </Expiriment>;
      }
    });
    let AppWithoutDefaultValue = React.createClass({
      render: function(){
        return <Expiriment name={testName}>
          {variantNames.map(name => {
            return <Variant key={name} name={name}><div id={'expiriment-' + name}></div></Variant>
          })}
        </Expiriment>;
      }
    });
    yield new Promise(function(resolve, reject){
      React.render(<AppWithDefaultValue />, reactElement, resolve);
    });
    let elementWithDefaultValue = document.getElementById('expiriment-' + defaultValue);
    assert.notEqual(elementWithDefaultValue, null);
    reactElement.innerHTML = "";
    yield new Promise(function(resolve, reject){
      React.render(<AppWithoutDefaultValue />, reactElement, resolve);
    });
    let elementWithoutDefaultValue = document.getElementById('expiriment-' + defaultValue);
    assert.notEqual(elementWithoutDefaultValue, null);
  }));
});
