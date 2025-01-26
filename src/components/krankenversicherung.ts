import { beitragspflichtigeEinnahmeArbeitnehmer } from "./sozialversicherung";
import { type DiagramInput, type Settings } from "./types";

export const Beitragsbemessungsgrenze = 5512.5 * 12; // SVReGV 2025

export const Krankenversicherung: DiagramInput = {
    legende: "Krankenversicherung",
    subtract: true,
    fn(bruttoJahr: number, { kvErmäßigt }: Settings) {
        // Werte für 2025:
        const beitragsSatz = (kvErmäßigt ? 14 : 14.6) + 2.5;

        const beitragspflichtigeEinnahmeJahr = beitragspflichtigeEinnahmeArbeitnehmer(bruttoJahr);
        const beitragJahr = (Math.min(beitragspflichtigeEinnahmeJahr, Beitragsbemessungsgrenze) * beitragsSatz) / 100;
        const beitragArbeitnehmerJahr = beitragJahr / 2; // § 249 SGB V
        return beitragArbeitnehmerJahr;
    },
};
