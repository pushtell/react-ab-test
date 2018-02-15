var React = require("react");
var Experiment = require("../../lib/Experiment");
var Variant = require("../../lib/Variant");

class App extends React.Component {
  static propTypes = {
    userIdentifier: React.PropTypes.string.isRequired
  };

  render(){
    return <div>
      <Experiment ref="experiment" name="My Example" userIdentifier={this.props.userIdentifier}>
        <Variant name="A">
          <div>Section A</div>
        </Variant>
        <Variant name="B">
          <div>Section B</div>
        </Variant>
      </Experiment>
    </div>;
  }
}

module.exports App;
