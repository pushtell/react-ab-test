var React = require("react");
var createReactClass = require('create-react-class');
var Experiment = require("../../lib/Experiment");
var Variant = require("../../lib/Variant");

module.exports = createReactClass({
  propTypes: {
    userIdentifier: React.PropTypes.string.isRequired
  },
  render: function(){
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
});