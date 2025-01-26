import { Beitragsbemessungsgrenze } from "./rente";
import { beitragspflichtigeEinnahmeArbeitnehmer } from "./sozialversicherung";
import { type DiagramInput } from "./types";

export const Arbeitslosenversicherung: DiagramInput = {
    legende: "Arbeitslosenversicherung",
    subtract: true,
    fn(bruttoJahr, _settings) {
        const beitragsSatz = 2.6;

        const einkommen = beitragspflichtigeEinnahmeArbeitnehmer(bruttoJahr);
        const basis = Math.min(einkommen, Beitragsbemessungsgrenze);
        const beitrag = (basis * beitragsSatz) / 100;
        const beitragArbeitnehmer = beitrag / 2;
        return beitragArbeitnehmer;
    },
};
