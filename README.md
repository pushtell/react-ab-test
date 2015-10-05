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
  - [`<Experiment />`](#experiment-)
    - [&nbsp;&nbsp;`props.name`](#&nbsp&nbsppropsname)
    - [&nbsp;&nbsp;`props.defaultValue`](#&nbsp&nbsppropsdefaultvalue)
  - [`<Variant />`](#variant-)
    - [`props.name`](#propsname)
  - [`emitter`](#emitter)
    - [`.emitWin(experimentName)`](#emitwinexperimentname)
      - [`experimentName`](#experimentname)
    - [`.addVariantListener([experimentName, ] callback)`](#addvariantlistenerexperimentname--callback)
    - [`.addValueListener([experimentName, ] callback)`](#addvaluelistenerexperimentname--callback)
    - [`.addPlayListener([experimentName, ] callback)`](#addplaylistenerexperimentname--callback)
    - [`.addWinListener([experimentName, ] callback)`](#addwinlistenerexperimentname--callback)
    - [`.getExperimentValue(experimentName)`](#getexperimentvalueexperimentname)
    - [`.addExperimentVariants(experimentName, variantNames)`](#addexperimentvariantsexperimentname-variantnames)
    - [`.setExperimentValue(experimentName, variantName)`](#setexperimentvalueexperimentname-variantname)
- [Alternative Libraries](#alternative-libraries)
- [Resources for A/B Testing with React](#resources-for-ab-testing-with-react)

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

### `<Experiment />`

Experiment container component. Children must be of type [Variant](#variant-).

#### &nbsp;&nbsp;`props.name`

&nbsp;&nbsp;The name of the experiment. Required. Type `string`. Example: `"My Test"`

#### &nbsp;&nbsp;`props.defaultValue`

&nbsp;&nbsp;The default variant name of the experiment. Required. Type `string`. Example: `"A"`

### `<Variant />`

Variant component.

#### `props.name`

 * **Description:** The name of the variant.
 * **Required:** Yes
 * **Type:** `string`
 * **Example:** `"My Test"`

### `emitter`

Event emitter.

#### `.emitWin(experimentName)`

##### `experimentName`

 * **Description:** The name of the experiment.
 * **Required:** Yes
 * **Type:** `string`
 * **Example:** `"My Test"`

#### `.addVariantListener([experimentName, ] callback)`
#### `.addValueListener([experimentName, ] callback)`
#### `.addPlayListener([experimentName, ] callback)`
#### `.addWinListener([experimentName, ] callback)`
#### `.getExperimentValue(experimentName)`
#### `.addExperimentVariants(experimentName, variantNames)`
#### `.setExperimentValue(experimentName, variantName)`

## Alternative Libraries

| Description | Author |
| :---------- | :----- |
| [**react-ab**](https://github.com/olahol/react-ab) - Simple declarative and universal A/B testing component for React. | [Ola Holmström](https://github.com/olahol) |
| [**react-native-ab**](https://github.com/lwansbrough/react-native-ab/) - A component for rendering A/B tests in React Native. | [Loch Wansbrough](https://github.com/lwansbrough) |

## Resources for A/B Testing with React

* [Roll Your Own A/B Tests With Optimizely and React](http://engineering.tilt.com/roll-your-own-ab-tests-with-optimizely-and-react/) on the [Tilt Engineering Blog](http://engineering.tilt.com/)
