import PiwikHelper from "../../../src/helpers/piwik.jsx";
import emitter from "../../../src/emitter.jsx";
import { spy } from "sinon";
import chai from "chai";
import sinonChai from "sinon-chai";

const expect = chai.use(sinonChai).expect;

describe("PiwikHelper", () => {

    beforeEach(() => {
        window._paq = {};
    });

    it("should enabled piwik helper and add two listener", () => {
        // given
        emitter.addPlayListener = spy();
        emitter.addWinListener = spy();

        // when
        PiwikHelper.enable();

        // then
        expect(emitter.addPlayListener).to.have.callCount(1);
        expect(emitter.addWinListener).to.have.callCount(1);
        expect(emitter.addPlayListener).to.have.been.calledWith(PiwikHelper.__pushPlay);
        expect(emitter.addWinListener).to.have.been.calledWith(PiwikHelper.__pushWin);
    });

    it("should push play action to piwik", () => {
        // given
        window._paq.push = spy();

        // when
        PiwikHelper.__pushPlay("experimentName", "experimentValue");

        // then
        expect(window._paq.push).to.have.been.calledWith(["trackEvent", "Simple metrics", "[Experiment] experimentName", "experimentValue"]);
    });

    it("should push win action to piwik", () => {
        // given
        window._paq.push = spy();

        // when
        PiwikHelper.__pushWin("experimentName", "experimentValue");

        // then
        expect(window._paq.push).to.have.been.calledWith(["trackEvent", "Simple metrics WIN", "[Experiment] experimentName", "experimentValue"]);
    });

    it("should disable play piwik helper", () => {
        // given
        window._paq.push = spy();
        PiwikHelper.enable();
        PiwikHelper.disable();

        // when
        emitter._emitPlay("test", "variant");

        // then
        expect(window._paq.push).to.have.callCount(0);
    });

    it("should disable win piwik helper", () => {
        // given
        window._paq.push = spy();
        PiwikHelper.enable();
        PiwikHelper.disable();

        // when
        emitter.emitWin("variant");

        // then
        expect(window._paq.push).to.have.callCount(0);
    });
});