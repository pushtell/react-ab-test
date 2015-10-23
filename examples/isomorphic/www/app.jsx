import React from 'react';
import ReactDOM from 'react-dom';
import Experiment from "../../lib/Experiment";
import Variant from "../../lib/Variant";
import Component from "../Component.jsx";

ReactDOM.render(<Component userIdentifier={SESSION_ID} />, document.getElementById("react-mount"));
