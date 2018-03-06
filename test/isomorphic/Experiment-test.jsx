import React from "react";

import Experiment from "../../src/Experiment.jsx";
import Enzyme, { shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-15";
import WeightedExperiment from "../../src/WeightedExperiment.jsx"
import Variant from "../../src/Variant.jsx"
import store from "../../src/store.jsx"
import emitter from "../../src/emitter.jsx";
import { expect } from "chai";
import sinon from "sinon";

Enzyme.configure({ adapter: new Adapter() });

let sandbox = sinon.createSandbox();

describe("Experiment test", () => {

    let getDefaultVariantName;
    let storeAvailable;

    beforeEach(() => {
        storeAvailable = sandbox.stub(store, "available");
        storeAvailable.value(true);
        getDefaultVariantName = sandbox.stub(emitter, "getDefaultVariantName");
    });

    afterEach(function () {
        sandbox.restore();
    });

    it("should display default variant when store is not available", () => {
        // given

        getDefaultVariantName.returns("v1");

        storeAvailable.value(false);

        // when
        const element = shallow(<Experiment name="experiment" runTest={ true }>
            <Variant name="v1" />
            <Variant name="v2" />
        </Experiment>);

        // then
        expect(element.find(WeightedExperiment)).to.have.lengthOf(0);
        expect(element.find(Variant)).to.have.lengthOf(1);
        expect(element.find(Variant).props().name).to.equal("v1");
    });

    it("should display experiment when runTest function is not defined", () => {
        // given
        getDefaultVariantName.returns("v2");

        // when
        const element = shallow(<Experiment name="experiment">
            <Variant name="v1" />
            <Variant name="v2" />
        </Experiment>);

        // then
        expect(element.find(WeightedExperiment)).to.have.lengthOf(1);
        expect(element.find(WeightedExperiment).contains(<Variant name="v1" />)).to.equal(true);
        expect(element.find(WeightedExperiment).contains(<Variant name="v2" />)).to.equal(true);
    });

    it("should display experiment when tests are enabled by runTest function", () => {
        // given

        getDefaultVariantName.returns("v2");

        // when
        const element = shallow(<Experiment name="experiment" runTest={ true }>
            <Variant name="v1" />
            <Variant name="v2" />
        </Experiment>);

        // then
        expect(element.find(WeightedExperiment)).to.have.lengthOf(1);
        expect(element.find(WeightedExperiment).contains(<Variant name="v1" />)).to.equal(true);
        expect(element.find(WeightedExperiment).contains(<Variant name="v2" />)).to.equal(true);
    });

    it("should display default variant when runTest disables test", () => {
        // given
        getDefaultVariantName.returns("v1");

        // when
        const element = shallow((<Experiment name="experiment2" runTest={ false }>
            <Variant name="v1" />
            <Variant name="v2" />
        </Experiment>));

        // then
        expect(element.find(WeightedExperiment)).to.have.lengthOf(0);
        expect(element.find(Variant)).to.have.lengthOf(1);
        expect(element.find(Variant).props().name).to.equal("v1");
    });

    it("should display empty component when default variant not defined in experiment", () => {
        // given
        getDefaultVariantName.returns("v1");

        // when
        const element = shallow((<Experiment name="experiment3" runTest={ false }>
            <Variant name="v2" />
        </Experiment>));

        // then
        expect(element.children()).to.have.lengthOf(0);
    });

    it("should throw exception when default variant is not declared and runTests is provided", () => {
        // given
        getDefaultVariantName.returns(undefined);

        // when
        const result = () => shallow((<Experiment name="experiment4" runTest={ true }>
            <Variant name="v2" />
        </Experiment>));

        // then
        expect(result).to.throw(Error, "Missing default variant for experiment");
    });

    it("display tests when default variant is not declared, but runTests is not provided", () => {
        // given
        getDefaultVariantName.returns(undefined);

        // when
        const element = shallow((<Experiment name="experiment4">
            <Variant name="v1" />
            <Variant name="v2" />
        </Experiment>));

        // then
        expect(element.find(WeightedExperiment)).to.have.lengthOf(1);
        expect(element.find(WeightedExperiment).contains(<Variant name="v1" />)).to.equal(true);
        expect(element.find(WeightedExperiment).contains(<Variant name="v2" />)).to.equal(true);
    });
});