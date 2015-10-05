# Pushtell A/B Testing React Component

[![NPM Version](https://badge.fury.io/js/react-ab-test.svg)](https://www.npmjs.com/package/react-ab-test)
![Test Passing Status](https://circleci.com/gh/pushtell/react-ab-test.svg?style=shield&circle-token=:circle-token)
[![Coverage Status](https://coveralls.io/repos/pushtell/react-ab-test/badge.svg?branch=master&service=github)](https://coveralls.io/github/pushtell/react-ab-test?branch=master)
[![Dependency Status](https://david-dm.org/pushtell/react-ab-test.svg)](https://david-dm.org/pushtell/react-ab-test)

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**  *generated with [DocToc](https://github.com/thlorenz/doctoc)*

  - [Install](#install)
  - [Basic Usage](#basic-usage)
    - [In a single component](#in-a-single-component)
- [Headline A](#headline-a)
- [Headline B](#headline-b)
    - [Across multiple components](#across-multiple-components)
- [Headline A](#headline-a-1)
- [Headline B](#headline-b-1)
    - [Debugging](#debugging)
- [Headline A](#headline-a-2)
- [Headline B](#headline-b-2)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Install

```bash
npm install react-ab-test
```

## Basic Usage

### In a single component

Try it [on JSFiddle](https://jsfiddle.net/pushtell/m14qvy7r/)

```js

var Experiment = require("react-ab-test").Experiment;
var Variant = require("react-ab-test").Variant;
var emitter = require("react-ab-test").emitter;

var App = React.createClass({
  onButtonClick: function(e){
    this.refs.experiment.win();
  },
  render: function(){
    return <div>
      <Experiment ref="experiment" name="example">
        <Variant name="A">
          <h1>Headline A</h1>
        </Variant>
        <Variant name="B">
          <h1>Headline B</h1>
        </Variant>
      </Experiment>
      <button onClick={this.onButtonClick}>Click to emit a win!</button>
    </div>;
  }
});

// Executed when the experiment is run
var playSubscription = emitter.addPlayListener("example", function(variantName){
  console.log("Displaying experiment ‘example’ variant ‘" + variantName + "’");
});

// Executed when a 'win' is emitted, in this case by this.refs.experiment.win();
var winSubscription = emitter.addWinListener("example", function(variantName){
  console.log("Experiment ‘example’ variant ‘" + variantName + "’ was clicked on");
});

```

### Across multiple components

Try it [on JSFiddle](http://jsfiddle.net/pushtell/pcutps9q/)

```js

var Experiment = require("react-ab-test").Experiment;
var Variant = require("react-ab-test").Variant;
var emitter = require("react-ab-test").emitter;

// Add variants in advance.
emitter.addExperimentVariants("example", ["A", "B", "C"]);

var Component1 = React.createClass({
  render: function(){
    return <div>
      <Experiment name="example">
        <Variant name="A">
          <h1>Headline A</h1>
        </Variant>
        <Variant name="B">
          <h1>Headline B</h1>
        </Variant>
      </Experiment>
    </div>;
  }
});

var Component2 = React.createClass({
  render: function(){
    return <div>
      <Experiment name="example">
        <Variant name="A">
          <p>Section A</p>
        </Variant>
        <Variant name="B">
          <p>Section B</p>
        </Variant>
        <Variant name="C">
          <p>Section C</p>
        </Variant>
      </Experiment>
    </div>;
  }
});

var Component3 = React.createClass({
  onButtonClick: function(e){
    emitter.emitWin("example");
  },
  render: function(){
    return <div>
      <button onClick={this.onButtonClick}>Click to emit a win!</button>
    </div>;
  }
});

var App = React.createClass({
  render: function(){
    return <div>
      <Component1 />
      <Component2 />
      <Component3 />
    </div>;
  }
});

// Executed when the experiment is run
var playSubscription = emitter.addPlayListener("example", function(variantName){
  console.log("Displaying experiment ‘example’ variant ‘" + variantName + "’");
});

// Executed when a 'win' is emitted, in this case by emitter.emitWin("example")
var winSubscription = emitter.addWinListener("example", function(variantName){
  console.log("Experiment ‘example’ variant ‘" + variantName + "’ was clicked on");
});

```


### Debugging

Try it [on JSFiddle](http://jsfiddle.net/pushtell/vs9kkxLd/)

```js

var Experiment = require("react-ab-test").Experiment;
var Variant = require("react-ab-test").Variant;
var emitter = require("react-ab-test").emitter;

var VariantSelector = React.createClass({
  propTypes: {
    name: React.PropTypes.string.isRequired
  },
  getInitialState: function(){
    return {
      variants: []
    }
  },
  addVariant: function(name) {
    var variants = this.state.variants;
    variants.push(name);
    this.setState({
      variants: variants
    });
  },
  componentWillMount: function(){
    this.variantSubscription = emitter.addVariantListener(this.props.name, this.addVariant);
  },
  componentWillUnmount: function(){
    this.variantSubscription.remove();
  },
  changeVariant: function(variantName, e) {
    emitter.setExperimentValue(this.props.name, variantName);
  },
  render: function(){
    return <div>
      {this.state.variants.map(variantName => {
        <div className="radio" key={variantName}>
          <label>
            <input type="radio" name="variant" value={variantName} onClick={this.changeVariant.bind(this, variantName)}/>
            Variant {variantName}
          </label>
        </div>
      })}
    </div>;
  }
});

var App = React.createClass({
  onButtonClick: function(e){
    this.refs.experiment.win();
  },
  render: function(){
    return <div>
      <Experiment ref="experiment" name="example">
        <Variant name="A">
          <h1>Headline A</h1>
        </Variant>
        <Variant name="B">
          <h1>Headline B</h1>
        </Variant>
      </Experiment>
      <button onClick={this.onButtonClick}>Click to emit a win!</button>
      <VariantSelector name="example" />
    </div>;
  }
});

// Executed when the experiment is run
var playSubscription = emitter.addPlayListener("example", function(variantName){
  console.log("Displaying experiment ‘example’ variant ‘" + variantName + "’");
});

// Executed when a 'win' is emitted, in this case by this.refs.experiment.win();
var winSubscription = emitter.addWinListener("example", function(variantName){
  console.log("Experiment ‘example’ variant ‘" + variantName + "’ was clicked on");
});

```