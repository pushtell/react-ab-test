# Pushtell A/B Testing React Component

[![NPM Version](https://badge.fury.io/js/pushtell-react.svg)](https://www.npmjs.com/package/pushtell-react)
![Test Passing Status](https://circleci.com/gh/pushtell/react.svg?style=shield&circle-token=:circle-token)
[![Coverage Status](https://coveralls.io/repos/pushtell/react/badge.svg?branch=master&service=github)](https://coveralls.io/github/pushtell/react?branch=master)
[![Dependency Status](https://david-dm.org/olahol/react-ab.svg)](https://david-dm.org/pushtell/react)

## Notes

This project is under active development and not suitable for use in production environments.

## Install

```bash
npm install pushtell-react --save
```

## Basic Usage

### In a single component

Try a single component example [on JSFiddle](https://jsfiddle.net/pushtell/m14qvy7r/)

```js

var Experiment = require("pushtell-react").Experiment;
var Variant = require("pushtell-react").Variant;
var emitter = require("pushtell-react").emitter;

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
      <button onClick={this.onButtonClick}>Click me to record a win!</button>
    </div>;
  }
});

// Executed when the experiment is run
var playSubscription = emitter.addPlayListener("example", function(name, value){
  alert("Displaying experiment ‘" + name + "’ variant ‘" + value + "’");
});

// Executed when a 'win' is emitted, in this case by this.refs.experiment.win();
var winSubscription = emitter.addWinListener("example", function(name, value){
  alert("Experiment experiment ‘" + name + "’ variant ‘" + value + "’ was clicked on.");
});

```

### Across multiple components

Try a multi-component example at [on JSFiddle](http://jsfiddle.net/pushtell/pcutps9q/)

```js

var Experiment = require("pushtell-react").Experiment;
var Variant = require("pushtell-react").Variant;
var emitter = require("pushtell-react").emitter;

// Add variants in advance.
emitter.addExperimentVariants("example", ["A", "B", "C"]);

var Component1 = React.createClass({
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
    </div>;
  }
});

var Component2 = React.createClass({
  render: function(){
    return <div>
      <Experiment ref="experiment" name="example">
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
      <button onClick={this.onButtonClick}>Click me to record a win!</button>
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

// Executed when the experiment is run.
var playSubscription = emitter.addPlayListener("example", function(name, value){
  alert("Displaying experiment ‘" + name + "’ variant ‘" + value + "’");
});

// Executed when a 'win' is emitted, in this case by emitter.emitWin("example")
var winSubscription = emitter.addWinListener("example", function(name, value){
  alert("Experiment experiment ‘" + name + "’ variant ‘" + value + "’ was clicked on.");
});

```