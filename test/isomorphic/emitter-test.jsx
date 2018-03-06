import emitter from "../../src/emitter.jsx";
import { expect } from "chai";

describe("Emitter test", () => {
    it("should define default variants", () => {
        // when
        emitter.defineVariants("experiment", ["v1", "v2"], [50, 50], "v2");

        // then
        expect(emitter.getDefaultVariantName("experiment")).to.equal("v2");
        expect(emitter.getSortedVariants("experiment")).to.deep.equal(["v1", "v2"]);
        expect(emitter.getSortedVariantWeights("experiment")).to.deep.equal([50, 50]);
    });

    it("should throw exception when default variant is not defined", () => {
        // when
        const result = () => emitter.defineVariants("experiment", ["v1", "v2"], [50, 50], "v3");

        // then
        expect(result).to.throw(Error, "Required argument 'defaultVariant' should have existing variantName");
    });
});