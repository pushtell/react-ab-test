import React from 'react';
import PropTypes from 'prop-types';

export default React.createClass({
  displayName: "Pushtell.Variant",
  propTypes: {
    name: PropTypes.string.isRequired
  },
  render(){
    if(React.isValidElement(this.props.children)) {
      return this.props.children;
    } else {
      return <span>{this.props.children}</span>;
    }
  }
});
