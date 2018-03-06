import store from "../../src/store.jsx"
import assert from "assert";

describe("Store", function() {
    it("should enable store", () =>  {
        assert.equal(store.available, true);
    });

    it("should store item", () =>  {
        //given
        let key = "key1";
        store.setItem(key, "value1");

        //when
        let result = store.getItem(key);

        assert.equal(result, "value1");
    });
});