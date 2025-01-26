import { Beitragsbemessungsgrenze } from "./krankenversicherung";
import { beitragspflichtigeEinnahmeArbeitnehmer } from "./sozialversicherung";
import { type DiagramInput, type Settings } from "./types";

export const Pflegeversicherung: DiagramInput = {
    legende: "Pflegeversicherung",
    subtract: true,
    fn(bruttoJahr: number, _settings: Settings) {
        const beitragsSatz = 2.4; // 2025, nicht Sachsen, kinderlos

        const beitragspflichtigeEinnahme = beitragspflichtigeEinnahmeArbeitnehmer(bruttoJahr);
        const basis = Math.min(beitragspflichtigeEinnahme, Beitragsbemessungsgrenze);

        return basis * (beitragsSatz / 100);
    },
};
