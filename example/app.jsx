import React from 'react';
import {Experiment, Variant, experimentDebugger} from '../index.js';
//import Experiment from "../src/LocalStorageExperiment";
//import Variant from "../src/Variant";
//import experimentDebugger from "../src/debugger";

experimentDebugger.enable();

const App = React.createClass({
  render() {
    return <div>
      <h1>Experiment 1</h1>
      <Experiment name="Experiment 1">
        <Variant name="A">
          <h2>Variant A</h2>
        </Variant>
        <Variant name="B">
          <h2>Variant B</h2>
        </Variant>
      </Experiment>
      <h1>Experiment 2</h1>
      <Experiment name="Experiment 2">
        <Variant name="X">
          <h2>Variant X</h2>
        </Variant>
        <Variant name="Y">
          <h2>Variant Y</h2>
        </Variant>
      </Experiment>
    </div>
  }
});

React.render(<App/>, document.getElementById('react'));


