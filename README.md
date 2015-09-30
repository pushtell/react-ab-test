# Pushtell A/B Testing React Component

[![NPM Version](https://badge.fury.io/js/pushtell-react.svg)](https://www.npmjs.com/package/pushtell-react)
![Test Passing Status](https://circleci.com/gh/pushtell/react.svg?style=shield&circle-token=:circle-token)
[![Coverage Status](https://coveralls.io/repos/pushtell/react/badge.svg?branch=master&service=github)](https://coveralls.io/github/pushtell/react?branch=master)
[![Dependency Status](https://david-dm.org/olahol/react-ab.svg)](https://david-dm.org/pushtell/react)

## Install

```bash
npm install pushtell-react --save
```

## Basic Usage

```js

var Expiriment = require("pushtell-react").Expiriment;
var Variant = require("pushtell-react").Variant;

var App = React.createClass({
  onClickVariant: function(e){
    this.refs.expiriment.win();
  },
  render: function(){
    return <Expiriment ref="expiriment" name="your-expiriment-name">
      <Variant name="A">
        <a id="expiriment-a" href="#A" onClick={this.onClickVariant}>A</a>
      </Variant>
      <Variant name="B">
        <a id="expiriment-b" href="#B" onClick={this.onClickVariant}>B</a>
      </Variant>
    </Expiriment>;
  }
});

// Executed when the component mounts.
var playSubscription = Expiriment.emitter.addListener('play', function(name, value){
  alert("Displaying expiriment '" + name + "' with variant '" + value + "'");
});

// Executed when a 'win' is recorded, in this case by this.refs.expiriment.win();
var winSubscription = Expiriment.emitter.addListener('win', function(name, value){
  alert("Expiriment " + name + " with variant '" + value + "'" was clicked on.");
});

```

Try it [on JSFiddle](https://jsfiddle.net/ydb573Ly/)

