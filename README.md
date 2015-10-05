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

Try it [on JSFiddle](https://jsfiddle.net/pushtell/m14qvy7r/)

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

// Executed when the component mounts.
var playSubscription = emitter.addListener('play', function(name, value){
  alert("Displaying '" + name + "' variant '" + value + "'");
});

// Executed when a 'win' is recorded, in this case by this.refs.experiment.win();
var winSubscription = emitter.addListener('win', function(name, value){
  alert("Experiment '" + name + "' variant '" + value + "' was clicked on.");
});

```

