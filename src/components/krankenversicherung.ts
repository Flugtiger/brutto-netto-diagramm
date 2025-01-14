import { beitragspflichtigeEinnahmeArbeitnehmer } from "./sozialversicherung";
import { Type, type DiagramInput } from "./types";

export const Krankenversicherung: DiagramInput = {
    legende: "Krankenversicherung",
    type: Type.SUBSTRACT,
    fn(bruttoJahr: number) {
        // Werte für 2025:
        const beitragsSatz = 14.6 + 2.5;
        const beitragsbemessungsgrenzeMonat = 5512.5; // SVReGV 2025

        const beitragspflichtigeEinnahmeJahr = beitragspflichtigeEinnahmeArbeitnehmer(bruttoJahr);
        const beitragJahr =
            (Math.min(beitragspflichtigeEinnahmeJahr, beitragsbemessungsgrenzeMonat * 12) * beitragsSatz) / 100;
        const beitragArbeitnehmerJahr = beitragJahr / 2; // § 249 SGB V
        return beitragArbeitnehmerJahr;
    },
};
