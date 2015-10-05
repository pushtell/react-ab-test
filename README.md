# Pushtell A/B Testing React Component

[![NPM Version](https://badge.fury.io/js/react-ab-test.svg)](https://www.npmjs.com/package/react-ab-test)
![Test Passing Status](https://circleci.com/gh/pushtell/react-ab-test.svg?style=shield&circle-token=:circle-token)
[![Coverage Status](https://coveralls.io/repos/pushtell/react-ab-test/badge.svg?branch=master&service=github)](https://coveralls.io/github/pushtell/react-ab-test?branch=master)
[![Dependency Status](https://david-dm.org/pushtell/react-ab-test.svg)](https://david-dm.org/pushtell/react-ab-test)

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
##Table of Contents

- [Installation](#installation)
- [Usage](#usage)
  - [Standalone Component](#standalone-component)
  - [Coordinate Multiple Components](#coordinate-multiple-components)
  - [Debugging](#debugging)
- [API](#api)
  - [`&lt;Expiriment /&gt;`](#&ltexpiriment-&gt)
    - [`expiriment.props.name`](#expirimentpropsname)
    - [`expiriment.props.defaultValue`](#expirimentpropsdefaultvalue)
  - [`&lt;Variant name="Variant Name" /&gt;`](#&ltvariant-namevariant-name-&gt)
    - [`variant.props.name`](#variantpropsname)
  - [`emitter`](#emitter)
    - [`emitter.emitWin(experimentName)`](#emitteremitwinexperimentname)
    - [`emitter.addVariantListener([experimentName, ] callback)`](#emitteraddvariantlistenerexperimentname--callback)
    - [`emitter.addValueListener([experimentName, ] callback)`](#emitteraddvaluelistenerexperimentname--callback)
    - [`emitter.addPlayListener([experimentName, ] callback)`](#emitteraddplaylistenerexperimentname--callback)
    - [`emitter.addWinListener([experimentName, ] callback)`](#emitteraddwinlistenerexperimentname--callback)
    - [`getExperimentValue(experimentName)`](#getexperimentvalueexperimentname)
    - [`emitter.addExperimentVariants(experimentName, variantNames)`](#emitteraddexperimentvariantsexperimentname-variantnames)
    - [`emitter.setExperimentValue(experimentName, variantName)`](#emittersetexperimentvalueexperimentname-variantname)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Installation

```bash
npm install react-ab-test
```

## Usage

### Standalone Component

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
          <div>Section A</div>
        </Variant>
        <Variant name="B">
          <div>Section B</div>
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

### Coordinate Multiple Components

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
          <div>Section A</div>
        </Variant>
        <Variant name="B">
          <div>Section B</div>
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
          <div>Subsection A</div>
        </Variant>
        <Variant name="B">
          <div>Subsection B</div>
        </Variant>
        <Variant name="C">
          <div>Subsection C</div>
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
    this.setState({
      variants: emitter.getSortedVariants(this.props.name)
    });
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
        return <div className="radio" key={variantName}>
          <label>
            <input
              type="radio"
              name="variant"
              value={variantName}
              onClick={this.changeVariant.bind(this, variantName)}
              defaultChecked={this.state.value === variantName} />
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
          <div>Section A</div>
        </Variant>
        <Variant name="B">
          <div>Section A</div>
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

## API

### `&lt;Expiriment /&gt;`

Experiment container component. Children must be of type [Variant](#&ltvariant-&gt).

#### `expiriment.props.name`

The name of the expiriment. (Required. String. Example: "my-test")

#### `expiriment.props.defaultValue`

The name of the variant to default to. (Optional. String. Example: "A")

### `&lt;Variant name="Variant Name" /&gt;`

Variant component.

#### `variant.props.name`

The name of the variant. (Required. String. Example: "A")

### `emitter`

Event emitter.

#### `emitter.emitWin(experimentName)`
#### `emitter.addVariantListener([experimentName, ] callback)`
#### `emitter.addValueListener([experimentName, ] callback)`
#### `emitter.addPlayListener([experimentName, ] callback)`
#### `emitter.addWinListener([experimentName, ] callback)`
#### `getExperimentValue(experimentName)`
#### `emitter.addExperimentVariants(experimentName, variantNames)`
#### `emitter.setExperimentValue(experimentName, variantName)`

