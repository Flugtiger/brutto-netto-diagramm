import type { DiagramInput } from "../components/types";
import { Einkommensteuer, WerbungskostenPausch } from "./einkommensteuer";
import { Krankenversicherung } from "./krankenversicherung";
import { Pflegeversicherung } from "./pflegeversicherung";
import { Rente } from "./rente";

export const Wohngeld: DiagramInput = {
    legende: "Wohngeld",
    subtract: false,
    fn(bruttoJahr, settings) {
        if (!settings.wohnkosten) {
            return 0;
        }
        const { kaltmiete } = settings.wohnkosten;

        // WoGG Anlage 1 (zu §12 Absatz 1) für ein Haushaltsmitglied und Mietstufe III
        const höchstbetrag = 456;
        // WoGG §12 Absatz 6
        const heizkosten = 110.4;
        // WoGG §12 Absatz 7
        const klimakomponente = 19.2;

        // § 16 WoGG
        let abzug = 0;
        if (Einkommensteuer.fn(bruttoJahr, settings) > 0) {
            abzug += 0.1;
        }
        if (Krankenversicherung.fn(bruttoJahr, settings) > 0 && Pflegeversicherung.fn(bruttoJahr, settings) > 0) {
            abzug += 0.1;
        }
        if (Rente.fn(bruttoJahr, settings) > 0) {
            abzug += 0.1;
        }
        const bruttoJahrWG = (bruttoJahr - WerbungskostenPausch) * (1 - abzug);

        const Y = Math.max(bruttoJahrWG / 12, 396);
        const M = Math.min(kaltmiete, höchstbetrag + klimakomponente) + heizkosten;

        // WoGG Anlage 2, 1 Haushaltsmitlglied:
        const a = 4e-2,
            b = 4.797e-4,
            c = 4.08e-5;

        // WoGG Anlage 3 (zu §19 Absatz 2)
        const z1 = a + b * M + c * Y;
        const z2 = z1 * Y;
        const z3 = M - z2;
        const z4 = 1.15 * z3;

        const wohngeld = Math.min(z4, höchstbetrag);

        if (wohngeld < 10) {
            // WoGG §21 Absatz 1 Punkt 1
            return 0;
        }

        return wohngeld * 12;
    },
};
