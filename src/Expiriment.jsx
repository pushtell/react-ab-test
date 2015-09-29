import React from 'react';

export default React.createClass({
  displayName: "Pushtell.Expiriment",
  propTypes: {
    name: React.PropTypes.string.isRequired,
    value: React.PropTypes.string.isRequired,
    onPlay: React.PropTypes.func
  },
  getInitialState(){
    let children = {};
    React.Children.forEach(this.props.children, element => {
      if(!React.isValidElement(element) || element.type.displayName !== "Pushtell.Variant"){
        throw new Error("Pushtell Expiriment children must be Pushtell Variant components.");
      }
      children[element.props.name] = element;
    });
    if(!children[this.props.value]) {
      if("production" !== process.env.NODE_ENV) {
        console.debug('Expiriment “' + this.props.name + '” does not contain variant “' + this.props.value + '”');
        console.trace();
      }
      return null;
    }
    return {
      element: children[this.props.value]
    };
  },
  componentDidMount(){
    if(this.props.onPlay){
      this.props.onPlay(this.props.value);
    }
  },
  render(){
    return this.state.element;
  }
});