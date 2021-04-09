import {test} from "tap";

test('two plus two is four', t => {
    t.plan(3);
    t.equal(2 + 2, 4);
    t.equal(2 + 2, 4);
    t.equal(2 + 2, 4);
})
