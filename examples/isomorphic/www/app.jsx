var React = require('react');
var ReactDOM = require('react-dom');
var Experiment = require("../../../lib/Experiment");
var Variant = require("../../../lib/Variant");
var Component = require("../Component.jsx");

ReactDOM.render(<Component userIdentifier={SESSION_ID} />, document.getElementById("react-mount"));
