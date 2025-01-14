import { Geringfügigkeitsgrenze } from "./grundlage";
import { beitragspflichtigeEinnahmeArbeitnehmer } from "./sozialversicherung";
import { Type, type DiagramInput } from "./types";

export const Rente: DiagramInput = {
    legende: "Rentenbeitrag",
    type: Type.SUBSTRACT,
    fn(bruttoJahr: number): number {
        // Werte für 2025:
        const beitragsSatz = 18.6;
        const beitragsbemessungsgrenzeMonat = 8050; // SVReGV 2025

        const bruttoMonat = bruttoJahr / 12;
        if (bruttoMonat < Geringfügigkeitsgrenze) {
            const arbeitgeberBeitrag = 15; // § 168 Abs. 1 Nr. 1b SGB VI
            const beitragspflichtigeEinnahmeMonat = Math.max(bruttoMonat, 175); // § 163 Abs. 8 SGB VI
            const beitragMonat = (beitragspflichtigeEinnahmeMonat * (beitragsSatz - arbeitgeberBeitrag)) / 100;
            return beitragMonat * 12;
        }
        const beitragspflichtigeEinnahmeJahr = beitragspflichtigeEinnahmeArbeitnehmer(bruttoJahr);
        const beitragJahr =
            (Math.min(beitragspflichtigeEinnahmeJahr, beitragsbemessungsgrenzeMonat * 12) * beitragsSatz) / 100;
        const beitragArbeitnehmerJahr = beitragJahr / 2; // § 168 SGB VI
        return beitragArbeitnehmerJahr;
    },
};
