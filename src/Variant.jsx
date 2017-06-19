import React, {Component} from 'react';
import PropTypes from 'prop-types';

export default class Variant extends Component {
  static propTypes = {
    name: PropTypes.string.isRequired
  };

  static displayName = "Pushtell.Variant";

  render() {
    if (React.isValidElement(this.props.children)) {
      return this.props.children;
    } else {
      return <span>{this.props.children}</span>;
    }
  }
};
