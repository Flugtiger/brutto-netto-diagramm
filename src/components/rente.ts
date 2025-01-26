import { Geringfügigkeitsgrenze } from "./grundlage";
import { beitragspflichtigeEinnahmeArbeitnehmer } from "./sozialversicherung";
import { type DiagramInput, type Settings } from "./types";

// Werte für 2025:
export const Beitragsbemessungsgrenze = 8050 * 12; // SVReGV 2025
export const BeitragsSatz = 18.6;

export const Rente: DiagramInput = {
    legende: "Rentenbeitrag",
    subtract: true,
    fn(bruttoJahr: number, _settings: Settings): number {
        // Werte für 2025:

        const bruttoMonat = bruttoJahr / 12;
        if (bruttoMonat < Geringfügigkeitsgrenze) {
            const arbeitgeberBeitrag = 15; // § 168 Abs. 1 Nr. 1b SGB VI
            const beitragspflichtigeEinnahmeMonat = Math.max(bruttoMonat, 175); // § 163 Abs. 8 SGB VI
            const beitragMonat = (beitragspflichtigeEinnahmeMonat * (BeitragsSatz - arbeitgeberBeitrag)) / 100;
            return beitragMonat * 12;
        }
        const beitragspflichtigeEinnahmeJahr = beitragspflichtigeEinnahmeArbeitnehmer(bruttoJahr);
        const beitragJahr = (Math.min(beitragspflichtigeEinnahmeJahr, Beitragsbemessungsgrenze) * BeitragsSatz) / 100;
        const beitragArbeitnehmerJahr = beitragJahr / 2; // § 168 SGB VI
        return beitragArbeitnehmerJahr;
    },
};
