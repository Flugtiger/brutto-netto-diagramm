import { expect, test } from "vitest";
import { Einkommensteuer } from "./einkommensteuer";

test("Berechnung Einkommensteuer", () => {
    const params = [
        [15000, 0],
        [20000, 436],
        [25000, 1330],
        [40000, 4518],
        [80000, 16104],
    ];
    for (const param of params) {
        const es = Einkommensteuer.fn(param[0], { kvErmäßigt: false });
        expect(es, "Einkommesteuer für Bruttolohn " + param[0]).toBe(param[1]);
    }
});
