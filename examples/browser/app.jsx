var React = require('react');
var ReactDOM = require('react-dom');
var Experiment = require("../../lib/Experiment");
var Variant = require("../../lib/Variant");
var experimentDebugger = require("../../lib/debugger");

experimentDebugger.enable();

class App extends React.Component {
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
    </div>;
  }
}

ReactDOM.render(<App/>, document.getElementById('react'));


