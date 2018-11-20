import React, { Component } from "react";
import PropTypes from 'prop-types';
import emitter from "./emitter";
import WeightedExperiment from "./WeightedExperiment";
import store from "./store";

export default class Experiment extends Component {
    static propTypes = {
        name: PropTypes.string.isRequired,
        defaultVariantName: PropTypes.string,
        userIdentifier: PropTypes.string,
        runTest: PropTypes.bool
    };

    static displayName = "Pushtell.Experiment";

    constructor(...props) {
        super(...props);

        this.state = {
            defaultVariant: null
        };
    }

    componentWillMount() {
        if (typeof this.props.runTest !== "undefined" && !emitter.getDefaultVariantName(this.props.name)) {
            throw new Error("Missing default variant for experiment");
        }

        const defaultVariant = this.findDefaultVariant();

        this.setState({
            defaultVariant: defaultVariant
        });
    }

    findDefaultVariant = () => {
        const children = React.Children.toArray(this.props.children);

        for (let i = 0; i < children.length; i++) {
            const child = children[i];

            if (child.props.name === emitter.getDefaultVariantName(this.props.name)) {
                return child;
            }
        }

        return null;
    };

    runTest = () => {
        let runTest = store.available;

        if (typeof this.props.runTest !== "undefined") {
            runTest = runTest && this.props.runTest;
        }

        return runTest;
    };

    render() {
        if (this.runTest()) {
            return (
                <WeightedExperiment { ...this.props }>
                    {this.props.children}
                </WeightedExperiment>
            );
        } else {
            return this.state.defaultVariant;
        }
    }
}