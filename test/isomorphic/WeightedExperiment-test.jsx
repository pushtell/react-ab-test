import React from "react";
import ReactDOMServer from "react-dom/server";
import WeightedExperiment from "../../src/WeightedExperiment.jsx";
import Variant from "../../src/Variant.jsx";
import emitter from "../../src/emitter.jsx";
import assert from "assert";
import { expect } from "chai";
import UUID from "node-uuid";

const renderApp = (experimentName, variantNames, userIdentifier) => {
  return () =>
  	<WeightedExperiment name={experimentName} userIdentifier={userIdentifier}>
      {variantNames.map(name => {
        return <Variant key={name} name={name}><div id={'variant-' + name}></div></Variant>
      })}
    </WeightedExperiment>
}

describe("WeightedExperiment", () => {


  it("should render to a string.", () => {
    const experimentName = UUID.v4();
    const App = () =>
    	<WeightedExperiment name={experimentName}>
        <Variant name="A"><div id="variant-a" /></Variant>
        <Variant name="B"><div id="variant-b" /></Variant>
      </WeightedExperiment>

    const result = ReactDOMServer.renderToString(<App />);
    expect(result).to.be.a('string');
  });
  it("should choose the same variant when a user identifier is defined.", () => {
    const userIdentifier = UUID.v4();
    const experimentName = UUID.v4();
    const variantNames = [];
    for(let i = 0; i < 100; i++) {
      variantNames.push(UUID.v4());
    }

    const App = renderApp(experimentName, variantNames, userIdentifier);

    let chosenVariant;
    emitter.once("play", (experimentName, variantName) => {
      chosenVariant = variantName;
    });

    const result = ReactDOMServer.renderToString(<App />);
    assert(chosenVariant);

    assert.notEqual(result.indexOf(chosenVariant), -1);
    for(let i = 0; i < 100; i++) {
      emitter._reset();
      const res = ReactDOMServer.renderToString(<App />);
      assert.notEqual(res.indexOf(chosenVariant), -1);
    }
  });
  it("should render different variants with different user identifiers.", () => {
  	const userIdentifier = UUID.v4();
    const user2Identifier = UUID.v4();
    const experimentName = UUID.v4();
    const variantNames = [];
    for(let i = 0; i < 100; i++) {
      variantNames.push(UUID.v4());
    }
  	const FirstRender = renderApp(experimentName, variantNames, userIdentifier);
    const SecondRender = renderApp(experimentName, variantNames, user2Identifier);

    const result1 = ReactDOMServer.renderToString(<FirstRender />);
    const result2 = ReactDOMServer.renderToString(<SecondRender />);

    assert.notEqual(result1, result2);
  });
});
