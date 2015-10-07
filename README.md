# A/B Testing React Components

[![NPM Version](https://badge.fury.io/js/react-ab-test.svg)](https://www.npmjs.com/package/react-ab-test)
[![Circle CI](https://circleci.com/gh/pushtell/react-ab-test.svg?style=shield)](https://circleci.com/gh/pushtell/react-ab-test)
[![Coverage Status](https://coveralls.io/repos/pushtell/react-ab-test/badge.svg?branch=master&service=github)](https://coveralls.io/github/pushtell/react-ab-test?branch=master)
[![Dependency Status](https://david-dm.org/pushtell/react-ab-test.svg)](https://david-dm.org/pushtell/react-ab-test)
[![Star on Github](https://img.shields.io/github/stars/pushtell/react-ab-test.svg?style=flat&label=%E2%98%85+Star)](https://github.com/pushtell/react-ab-test)

Wrap test versions in `<Variant />` and nest in `<Experiment />`. A version is chosen randomly and saved to local storage.

```js
<Experiment name="My Example">
  <Variant name="A">
    <div>Version A</div>
  </Variant>
  <Variant name="B">
    <div>Version B</div>
  </Variant>
</Experiment>
```

Report to your analytics provider using the `emitter`.

```js
emitter.addPlayListener(function(experimentName, variantName){
  mixpanel.track("Start Experiment", {name: experimentName, variant: variantName});
});
```

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
<h1>Table of Contents</h1>

- [Installation](#installation)
- [Usage](#usage)
  - [Standalone Component](#standalone-component)
  - [Coordinate Multiple Components](#coordinate-multiple-components)
  - [Debugging](#debugging)
- [Alternative Libraries](#alternative-libraries)
- [Resources for A/B Testing with React](#resources-for-ab-testing-with-react)
- [API Reference](#api-reference)
  - [`<Experiment />`](#experiment-)
- [](#)
  - [`<Variant />`](#variant-)
- [](#-1)
  - [`emitter`](#emitter)
    - [`emitter.emitWin(experimentName)`](#emitteremitwinexperimentname)
    - [`emitter.addVariantListener([experimentName, ] callback)`](#emitteraddvariantlistenerexperimentname--callback)
    - [`emitter.addValueListener([experimentName, ] callback)`](#emitteraddvaluelistenerexperimentname--callback)
    - [`emitter.addPlayListener([experimentName, ] callback)`](#emitteraddplaylistenerexperimentname--callback)
    - [`emitter.addWinListener([experimentName, ] callback)`](#emitteraddwinlistenerexperimentname--callback)
    - [`emitter.addExperimentVariants(experimentName, variantNames)`](#emitteraddexperimentvariantsexperimentname-variantnames)
      - [Arguments](#arguments)
    - [`emitter.setExperimentValue(experimentName, variantName)`](#emittersetexperimentvalueexperimentname-variantname)
    - [`emitter.getExperimentValue(experimentName)`](#emittergetexperimentvalueexperimentname)

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
      <Experiment ref="experiment" name="My Example">
        <Variant name="A">
          <div>Section A</div>
        </Variant>
        <Variant name="B">
          <div>Section B</div>
        </Variant>
      </Experiment>
      <button onClick={this.onButtonClick}>Emit a win</button>
    </div>;
  }
});

// Called when the experiment is displayed to the user.
emitter.addPlayListener(function(experimentName, variantName){
  console.log("Displaying experiment ‘" + experimentName + "’ variant ‘" + variantName + "’");
});

// Called when a 'win' is emitted, in this case by this.refs.experiment.win()
emitter.addWinListener(function(experimentName, variantName){
  console.log("Variant ‘" + variantName + "’ of experiment ‘" + experimentName + "’  was clicked");
});

```

### Coordinate Multiple Components

Try it [on JSFiddle](http://jsfiddle.net/pushtell/pcutps9q/)

```js

var Experiment = require("react-ab-test").Experiment;
var Variant = require("react-ab-test").Variant;
var emitter = require("react-ab-test").emitter;

// Define variants in advance.
emitter.addExperimentVariants("My Example", ["A", "B", "C"]);

var Component1 = React.createClass({
  render: function(){
    return <Experiment name="My Example">
      <Variant name="A">
        <div>Section A</div>
      </Variant>
      <Variant name="B">
        <div>Section B</div>
      </Variant>
    </Experiment>;
  }
});

var Component2 = React.createClass({
  render: function(){
    return <Experiment name="My Example">
      <Variant name="A">
        <div>Subsection A</div>
      </Variant>
      <Variant name="B">
        <div>Subsection B</div>
      </Variant>
      <Variant name="C">
        <div>Subsection C</div>
      </Variant>
    </Experiment>;
  }
});

var Component3 = React.createClass({
  onButtonClick: function(e){
    emitter.emitWin("My Example");
  },
  render: function(){
    return <button onClick={this.onButtonClick}>Emit a win</button>;
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

// Called when the experiment is displayed to the user.
emitter.addPlayListener(function(experimentName, variantName){
  console.log("Displaying experiment ‘" + experimentName + "’ variant ‘" + variantName + "’");
});

// Called when a 'win' is emitted, in this case by emitter.emitWin()
emitter.addWinListener(function(experimentName, variantName){
  console.log("Variant ‘" + variantName + "’ of experiment ‘" + experimentName + "’ was clicked");
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
      value: null,
      variants: []
    }
  },
  addVariant: function(experimentName, variantName) {
    var variants = this.state.variants;
    variants.push(variantName);
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
      <Experiment ref="experiment" name="My Example">
        <Variant name="A">
          <div>Section A</div>
        </Variant>
        <Variant name="B">
          <div>Section B</div>
        </Variant>
      </Experiment>
      <button onClick={this.onButtonClick}>Emit a win</button>
      <VariantSelector name="My Example" />
    </div>;
  }
});

// Called when the experiment is displayed to the user.
emitter.addPlayListener(function(experimentName, variantName){
  console.log("Displaying experiment ‘" + experimentName + "’ variant ‘" + variantName + "’");
});

// Called when a 'win' is emitted, in this case by this.refs.experiment.win()
emitter.addWinListener(function(experimentName, variantName){
  console.log("Variant ‘" + variantName + "’ of experiment ‘" + experimentName + "’ was clicked");
});

```

## Alternative Libraries


* [**react-ab**](https://github.com/olahol/react-ab) - “Simple declarative and universal A/B testing component for React” by [Ola Holmström](https://github.com/olahol)
* [**react-native-ab**](https://github.com/lwansbrough/react-native-ab/) - “A component for rendering A/B tests in React Native“ by [Loch Wansbrough](https://github.com/lwansbrough)

Please [let us know](https://github.com/pushtell/react-ab-test/issues/new) about alternate libraries not included here.

## Resources for A/B Testing with React

* [Roll Your Own A/B Tests With Optimizely and React](http://engineering.tilt.com/roll-your-own-ab-tests-with-optimizely-and-react/) on the [Tilt Engineering Blog](http://engineering.tilt.com/)

Please [let us know](https://github.com/pushtell/react-ab-test/issues/new) about React A/B testing resources not included here.

## API Reference

### `<Experiment />`

Experiment container component. Children must be of type [Variant](#variant-).

* **Properties:**
  * `name` - The name of the experiment.
    * **Required**
    * **Type:** `string`
    * **Example:** `"My Example"`
  * `defaultValue` - The name of the default variant. This property is useful for server side rendering but otherwise not recommended.
    * **Optional**
    * **Type:** `string`
    * **Example:** `"A"`

---

### `<Variant />`

Variant component.

* **Properties:**
  * `name` - The name of the variant.
    * **Required**
    * **Type:** `string`
    * **Example:** `"A"`

---

### `emitter`

Event emitter responsible for coordinating and reporting usage. Extended from [facebook/emitter](https://github.com/facebook/emitter).

#### `emitter.emitWin(experimentName)`

Emit a win event.

* **Return Type:** `Subscription`
* **Parameters:**
  * `experimentName` - The name of an experiment.
    * **Required**
    * **Type:** `string`
    * **Example:** `"My Example"`

#### `emitter.addVariantListener([experimentName, ] callback)`

Listen for variants being added to an experiment.

* **Return Type:** `Subscription`
* **Parameters:**
  * `experimentName` - The name of an experiment. If provided, the callback will only be called for the specified experiment.
    * **Optional**
    * **Type:** `string`
    * **Example:** `"My Example"`
  * `callback` - Function to be called when a variant is added to an experiment.
    * **Required**
    * **Type:** `function`

#### `emitter.addValueListener([experimentName, ] callback)`

Listen for the chosen value of an experiment.

* **Return Type:** `Subscription`
* **Parameters:**
  * `experimentName` - The name of an experiment. If provided, the callback will only be called for the specified experiment.
    * **Optional**
    * **Type:** `string`
    * **Example:** `"My Example"`
  * `callback` - Function to be called when a variant is chosen.
    * **Required**
    * **Type:** `function`

#### `emitter.addPlayListener([experimentName, ] callback)`

Listen for an experiment being displayed to the user. Trigged by the [React componentWillMount lifecycle method](https://facebook.github.io/react/docs/component-specs.html#mounting-componentwillmount).

* **Return Type:** `Subscription`
* **Parameters:**
  * `experimentName` - The name of an experiment. If provided, the callback will only be called for the specified experiment.
    * **Optional**
    * **Type:** `string`
    * **Example:** `"My Example"`
  * `callback` - Function to be called when an experiment is displayed to the user.
    * **Required**
    * **Type:** `function`

#### `emitter.addWinListener([experimentName, ] callback)`

Listen for a successful outcome from the experiment. Trigged by the [emitter.emitWin(experimentName)](#emitteremitwinexperimentname) method.

* **Return Type:** `Subscription`
* **Parameters:**
  * `experimentName` - The name of an experiment. If provided, the callback will only be called for the specified experiment.
    * **Optional**
    * **Type:** `string`
    * **Example:** `"My Example"`
  * `callback` - Function to be called when a win is emitted.
    * **Required**
    * **Type:** `function`

#### `emitter.addExperimentVariants(experimentName, variantNames)`

Define experiment variant names. Required when an experiment [spans multiple components](#coordinate-multiple-components).

* **Return Type:** No return value
* **Parameters:**
  * `experimentName` - The name of the experiment.
    * **Required**
    * **Type:** `string`
    * **Example:** `"My Example"`
  * `variantNames` - Array of variant names.
    * **Required**
    * **Type:** `Array.<string>`
    * **Example:** `"A"`

##### Arguments

#### `emitter.setExperimentValue(experimentName, variantName)`

Set the active variant of an experiment.

* **Return Type:** No return value
* **Parameters:**
  * `experimentName` - The name of the experiment.
    * **Required**
    * **Type:** `string`
    * **Example:** `"My Example"`
  * `variantName` - The name of the variant.
    * **Required**
    * **Type:** `string`
    * **Example:** `"A"`

#### `emitter.getExperimentValue(experimentName)`

Returns the variant name currently displayed by the experiment.

* **Return Type:** `string`
* **Parameters:**
  * `experimentName` - The name of the experiment.
    * **Required**
    * **Type:** `string`
    * **Example:** `"My Example"`

