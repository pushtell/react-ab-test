import React from 'react';

export default React.createClass({
  displayName: "Pushtell.Variant",
  propTypes: {
    name: React.PropTypes.string.isRequired
  },
  render(){
    if(React.isValidElement(this.props.children)) {
      return this.props.children;
    } else {
      return <span>{this.props.children}</span>;
    }
  }
});