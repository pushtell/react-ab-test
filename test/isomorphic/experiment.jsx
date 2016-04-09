import React from "react";
import ReactDOMServer from "react-dom/server";
import Experiment from "../../src/Experiment.jsx";
import Variant from "../../src/Variant.jsx";
import emitter from "../../src/emitter.jsx";
import assert from "assert";
import co from "co";
import UUID from "node-uuid";

describe("Experiment", function() {
  this.timeout(10000);
  it("should render to a string.", co.wrap(function *(){
    let experimentName = UUID.v4();
    let App = React.createClass({
      render: function(){
        return <Experiment name={experimentName}>
          <Variant name="A"><div id="variant-a" /></Variant>
          <Variant name="B"><div id="variant-b" /></Variant>
        </Experiment>;
      }
    });
    let result = ReactDOMServer.renderToString(<App />);
  }));
  it("should choose the same variant when a user identifier is defined.", co.wrap(function *(){
    let userIdentifier = UUID.v4();
    let experimentName = UUID.v4();
    let variantNames = [];
    for(let i = 0; i < 100; i++) {
      variantNames.push(UUID.v4());
    }
    let App = React.createClass({
      render: function(){
        return <Experiment name={experimentName} userIdentifier={userIdentifier}>
          {variantNames.map(name => {
            return <Variant key={name} name={name}><div id={'variant-' + name}></div></Variant>
          })}
        </Experiment>;
      }
    });
    let chosenVariant;
    emitter.once("play", function(experimentName, variantName){
      chosenVariant = variantName;
    });
    let result = ReactDOMServer.renderToString(<App />);
    assert(chosenVariant);
    assert.notEqual(result.indexOf(chosenVariant), -1);
    for(let i = 0; i < 100; i++) {
      emitter._reset();
      result = ReactDOMServer.renderToString(<App />);
      assert.notEqual(result.indexOf(chosenVariant), -1);
    }
  }));
});
