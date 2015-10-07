# A/B Testing React Component

[![NPM Version](https://badge.fury.io/js/react-ab-test.svg)](https://www.npmjs.com/package/react-ab-test)
![Test Passing Status](https://circleci.com/gh/pushtell/react-ab-test.svg?style=shield&circle-token=:circle-token)
[![Coverage Status](https://coveralls.io/repos/pushtell/react-ab-test/badge.svg?branch=master&service=github)](https://coveralls.io/github/pushtell/react-ab-test?branch=master)
[![Dependency Status](https://david-dm.org/pushtell/react-ab-test.svg)](https://david-dm.org/pushtell/react-ab-test)

Wrap test versions in the `<Variant />` component and nest in an `<Experiment />` component. Results are saved to local storage.

```js
<Experiment name="Example">
  <Variant name="A">
    <p>Version A</p>
  </Variant>
  <Variant name="B">
    <p>Version B</p>
  </Variant>
</Experiment>
```

Save results to your favorite analytics provider using the `emitter` object.

```js
emitter.addPlayListener("Example", function(experimentName, variantName){
  mixpanel.track("Start Experiment", {name: experimentName, variant: variantName});
});
```

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
  - [Standalone Component](#standalone-component)
  - [Coordinate Multiple Components](#coordinate-multiple-components)
  - [Debugging](#debugging)
- [Alternative Libraries](#alternative-libraries)
- [Resources for A/B Testing with React](#resources-for-ab-testing-with-react)
- [API Reference](#api-reference)
  - [`<Experiment />`](#experiment-)
    - [Properties](#properties)
      - [`name`](#name)
      - [`defaultValue`](#defaultvalue)
- [](#)
  - [`<Variant />`](#variant-)
    - [Properties](#properties-1)
      - [`name`](#name-1)
- [](#-1)
  - [`emitter`](#emitter)
    - [`emitter.emitWin(experimentName)`](#emitteremitwinexperimentname)
      - [Arguments](#arguments)
        - [`experimentName`](#experimentname)
    - [`emitter.addVariantListener([experimentName, ] callback)`](#emitteraddvariantlistenerexperimentname--callback)
      - [Arguments](#arguments-1)
        - [`experimentName`](#experimentname-1)
        - [`callback`](#callback)
    - [`emitter.addValueListener([experimentName, ] callback)`](#emitteraddvaluelistenerexperimentname--callback)
      - [Arguments](#arguments-2)
        - [`experimentName`](#experimentname-2)
        - [`callback`](#callback-1)
    - [`emitter.addPlayListener([experimentName, ] callback)`](#emitteraddplaylistenerexperimentname--callback)
      - [Arguments](#arguments-3)
        - [`experimentName`](#experimentname-3)
        - [`callback`](#callback-2)
    - [`emitter.addWinListener([experimentName, ] callback)`](#emitteraddwinlistenerexperimentname--callback)
      - [Arguments](#arguments-4)
        - [`experimentName`](#experimentname-4)
        - [`callback`](#callback-3)
    - [`emitter.addExperimentVariants(experimentName, variantNames)`](#emitteraddexperimentvariantsexperimentname-variantnames)
      - [Arguments](#arguments-5)
        - [`experimentName`](#experimentname-5)
        - [`variantName`](#variantname)
      - [Arguments](#arguments-6)
    - [`emitter.setExperimentValue(experimentName, variantName)`](#emittersetexperimentvalueexperimentname-variantname)
      - [Arguments](#arguments-7)
        - [`experimentName`](#experimentname-6)
        - [`variantName`](#variantname-1)
    - [`emitter.getExperimentValue(experimentName)`](#emittergetexperimentvalueexperimentname)
      - [Arguments](#arguments-8)
        - [`experimentName`](#experimentname-7)

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
      <button onClick={this.onButtonClick}>Click to emit a win!</button>
    </div>;
  }
});

// Executed when the experiment is run
var playSubscription = emitter.addPlayListener("My Example", function(experimentName, variantName){
  console.log("Displaying experiment ‘example’ variant ‘" + variantName + "’");
});

// Executed when a 'win' is emitted, in this case by this.refs.experiment.win();
var winSubscription = emitter.addWinListener("My Example", function(experimentName, variantName){
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
emitter.addExperimentVariants("My Example", ["A", "B", "C"]);

var Component1 = React.createClass({
  render: function(){
    return <div>
      <Experiment name="My Example">
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
      <Experiment name="My Example">
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
    emitter.emitWin("My Example");
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
var playSubscription = emitter.addPlayListener("My Example", function(experimentName, variantName){
  console.log("Displaying experiment ‘example’ variant ‘" + variantName + "’");
});

// Executed when a 'win' is emitted, in this case by emitter.emitWin("My Example")
var winSubscription = emitter.addWinListener("My Example", function(experimentName, variantName){
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
          <div>Section A</div>
        </Variant>
      </Experiment>
      <button onClick={this.onButtonClick}>Click to emit a win!</button>
      <VariantSelector name="My Example" />
    </div>;
  }
});

// Executed when the experiment is run
var playSubscription = emitter.addPlayListener("My Example", function(experimentName, variantName){
  console.log("Displaying experiment ‘example’ variant ‘" + variantName + "’");
});

// Executed when a 'win' is emitted, in this case by this.refs.experiment.win();
var winSubscription = emitter.addWinListener("My Example", function(experimentName, variantName){
  console.log("Experiment ‘example’ variant ‘" + variantName + "’ was clicked on");
});

```

## Alternative Libraries

| Description | Author |
| :---------- | :----- |
| [**react-ab**](https://github.com/olahol/react-ab) - Simple declarative and universal A/B testing component for React. | [Ola Holmström](https://github.com/olahol) |
| [**react-native-ab**](https://github.com/lwansbrough/react-native-ab/) - A component for rendering A/B tests in React Native. | [Loch Wansbrough](https://github.com/lwansbrough) |

## Resources for A/B Testing with React

* [Roll Your Own A/B Tests With Optimizely and React](http://engineering.tilt.com/roll-your-own-ab-tests-with-optimizely-and-react/) on the [Tilt Engineering Blog](http://engineering.tilt.com/)

## API Reference

### `<Experiment />`

Experiment container component. Children must be of type [Variant](#variant-).

#### Properties

##### `name`

The name of the experiment.

<ul>
  <li><samp>Required</samp></li>
  <li><samp>Type:</samp> <code>string</code></li>
  <li><samp>Example:</samp> <code>"My Example"</code></li>
</ul>

##### `defaultValue`

The name of the default variant. This property is useful for server side rendering but otherwise not recommended.

<ul>
  <li><samp>Optional</samp></li>
  <li><samp>Type:</samp> <code>string</code></li>
  <li><samp>Example:</samp> <code>"A"</code></li>
</ul>

---

### `<Variant />`

Variant component.

#### Properties

##### `name`

The name of the variant.

<ul>
  <li><samp>Required</samp></li>
  <li><samp>Type:</samp> <code>string</code></li>
  <li><samp>Example:</samp> <code>"My Example"</code></li>
</ul>

---

### `emitter`

Event emitter responsible for coordinating and reporting usage. Extended from [facebook/emitter](https://github.com/facebook/emitter).

#### `emitter.emitWin(experimentName)`

Emit a win event.

<ul>
  <li><samp>Returns:</samp> No returned value</li>
</ul>

##### Arguments

###### `experimentName`

The name of the experiment.

<ul>
  <li><samp>Required</samp></li>
  <li><samp>Type:</samp> <code>string</code></li>
  <li><samp>Example:</samp> <code>"My Example"</code></li>
</ul>

#### `emitter.addVariantListener([experimentName, ] callback)`

Listen for variants being added to an experiment.

<ul>
  <li><samp>Returns:</samp> <code>Subscription</code> object</li>
</ul>

##### Arguments

###### `experimentName`

The name of the experiment. If provided, the callback will only be called for specified experiment.

<ul>
  <li><samp>Optional</samp></li>
  <li><samp>Type:</samp> <code>string</code></li>
  <li><samp>Example:</samp> <code>"My Example"</code></li>
</ul>

###### `callback`

Called when a new variant is added.

<ul>
  <li><samp>Required</samp></li>
  <li><samp>Type:</samp> <code>function</code></li>
</ul>

#### `emitter.addValueListener([experimentName, ] callback)`

Listen for the chosen value of an experiment.

<ul>
  <li><samp>Returns:</samp> <code>Subscription</code> object</li>
</ul>

##### Arguments

###### `experimentName`

The name of the experiment. If provided, the callback will only be called for specified experiment.

<ul>
  <li><samp>Optional</samp></li>
  <li><samp>Type:</samp> <code>string</code></li>
  <li><samp>Example:</samp> <code>"My Example"</code></li>
</ul>

###### `callback`

Called when a new variant is added.

<ul>
  <li><samp>Required</samp></li>
  <li><samp>Type:</samp> <code>function</code></li>
</ul>

#### `emitter.addPlayListener([experimentName, ] callback)`

Listen for an experiment being displayed to the user. Trigged by the [React componentWillMount lifecycle method](https://facebook.github.io/react/docs/component-specs.html#mounting-componentwillmount).

<ul>
  <li><samp>Returns:</samp> <code>Subscription</code> object</li>
</ul>

##### Arguments

###### `experimentName`

The name of the experiment. If provided, the callback will only be called for specified experiment.

<ul>
  <li><samp>Optional</samp></li>
  <li><samp>Type:</samp> <code>string</code></li>
  <li><samp>Example:</samp> <code>"My Example"</code></li>
</ul>

###### `callback`

Called when a new variant is added.

<ul>
  <li><samp>Required</samp></li>
  <li><samp>Type:</samp> <code>function</code></li>
</ul>

#### `emitter.addWinListener([experimentName, ] callback)`

Listen for a successful outcome from the experiment. Trigged by the [emitter.emitWin(experimentName)](#emitteremitwinexperimentname) method.

<ul>
  <li><samp>Returns:</samp> <code>Subscription</code> object</li>
</ul>

##### Arguments

###### `experimentName`

The name of the experiment. If provided, the callback will only be called for specified experiment.

<ul>
  <li><samp>Optional</samp></li>
  <li><samp>Type:</samp> <code>string</code></li>
  <li><samp>Example:</samp> <code>"My Example"</code></li>
</ul>

###### `callback`

Called when successful outcome is emitted by the [emitter.emitWin(experimentName)](#emitteremitwinexperimentname) method.

<ul>
  <li><samp>Required</samp></li>
  <li><samp>Type:</samp> <code>function</code></li>
</ul>

#### `emitter.addExperimentVariants(experimentName, variantNames)`

Define experiment variant names. Required when an experiment [spans multiple components](#coordinate-multiple-components).

<ul>
  <li><samp>Returns:</samp> No return value</li>
</ul>

##### Arguments

###### `experimentName`

The name of the experiment.

<ul>
  <li><samp>Required</samp></li>
  <li><samp>Type:</samp> <code>string</code></li>
  <li><samp>Example:</samp> <code>"My Example"</code></li>
</ul>

###### `variantName`

The name of the variant.

<ul>
  <li><samp>Required</samp></li>
  <li><samp>Type:</samp> <code>string</code></li>
  <li><samp>Example:</samp> <code>"A"</code></li>
</ul>

##### Arguments

#### `emitter.setExperimentValue(experimentName, variantName)`

Set the active variant of an experiment.

<ul>
  <li><samp>Returns:</samp> No return value</li>
</ul>

##### Arguments

###### `experimentName`

The name of the experiment.

<ul>
  <li><samp>Required</samp></li>
  <li><samp>Type:</samp> <code>string</code></li>
  <li><samp>Example:</samp> <code>"My Example"</code></li>
</ul>

###### `variantName`

The name of the variant.

<ul>
  <li><samp>Required</samp></li>
  <li><samp>Type:</samp> <code>string</code></li>
  <li><samp>Example:</samp> <code>"A"</code></li>
</ul>

#### `emitter.getExperimentValue(experimentName)`

Returns the variant name currently displayed by the experiment.

<ul>
  <li><samp>Returns:</samp> <code>string</code></li>
  <li><samp>Example:</samp> <code>"A"</code></li>
</ul>

##### Arguments

###### `experimentName`

The name of the experiment.

<ul>
  <li><samp>Required</samp></li>
  <li><samp>Type:</samp> <code>string</code></li>
  <li><samp>Example:</samp> <code>"My Example"</code></li>
</ul>
