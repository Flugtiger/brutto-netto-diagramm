import { Einkommensteuer } from "./einkommensteuer";
import { Rente } from "./rente";
import { Type, type DiagramInput } from "./types";

function inRange(value: number, rangeStart: number, rangeEnd: number) {
    return Math.min(Math.max(value - rangeStart, 0), rangeEnd - rangeStart);
}

export const Bürgergeld: DiagramInput = {
    legende: "Bürgergeld",
    type: Type.ADD,
    fn(brutto: number): number {
        const regelbedarf_stufe1 = 563; // Anhang zu §28 SGB XII

        // §11b SGB II
        const monatlichBrutto = brutto / 12;
        let absetzbetrag = Math.min(monatlichBrutto, 100);
        absetzbetrag += inRange(monatlichBrutto, 100, 520) * 0.2;
        absetzbetrag += inRange(monatlichBrutto, 520, 1000) * 0.3;
        absetzbetrag += inRange(monatlichBrutto, 1000, 1200) * 0.1;
        absetzbetrag += Einkommensteuer.fn(brutto) / 12;
        absetzbetrag += Rente.fn(brutto) / 12;

        const bürgergeldMonatlich = regelbedarf_stufe1 - (monatlichBrutto - absetzbetrag);
        return Math.max(bürgergeldMonatlich * 12, 0);
    },
};
