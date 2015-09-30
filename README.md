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
  render: function() {
    return <Expiriment name="test">
      <Variant name="A">A</Variant>
      <Variant name="B">B</Variant>
    </Expiriment>;
  }
});

```

Try It [on JSFiddle](https://jsfiddle.net/ydb573Ly/)

