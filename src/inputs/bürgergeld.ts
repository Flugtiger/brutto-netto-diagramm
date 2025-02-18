import { type DiagramInput } from "../components/types";
import { Einkommensteuer } from "./einkommensteuer";
import { Rente } from "./rente";

function inRange(value: number, rangeStart: number, rangeEnd: number) {
    return Math.min(Math.max(value - rangeStart, 0), rangeEnd - rangeStart);
}

export const Bürgergeld: DiagramInput = {
    legende: "Bürgergeld",
    subtract: false,
    fn(brutto: number, settings): number {
        const regelbedarf_stufe1 = 563; // Anhang zu §28 SGB XII

        // §11b SGB II
        const monatlichBrutto = brutto / 12;
        let absetzbetrag = Math.min(monatlichBrutto, 100);
        absetzbetrag += inRange(monatlichBrutto, 100, 520) * 0.2;
        absetzbetrag += inRange(monatlichBrutto, 520, 1000) * 0.3;
        absetzbetrag += inRange(monatlichBrutto, 1000, 1200) * 0.1;
        absetzbetrag += Einkommensteuer.fn(brutto, settings) / 12;
        absetzbetrag += Rente.fn(brutto, settings) / 12;

        let wohnbedarf = 0;
        if (settings.wohnkosten) {
            // §22 SGB II
            // Potsdam: 550€ Bruttokalt, Heizkosten für ca. 12.000 kWh/a
            wohnbedarf = Math.min(settings.wohnkosten.kaltmiete, 550) + Math.min(settings.wohnkosten.heizkosten, 100);
        }

        const bürgergeldMonatlich = regelbedarf_stufe1 + wohnbedarf - (monatlichBrutto - absetzbetrag);
        return Math.max(bürgergeldMonatlich * 12, 0);
    },
};
