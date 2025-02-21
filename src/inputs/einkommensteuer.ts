import { type DiagramInput, type Settings } from "../components/types";
import * as kv from "./krankenversicherung";
import * as rente from "./rente";

export const WerbungskostenPausch = 1230;

export const Einkommensteuer: DiagramInput = {
    legende: "Einkommensteuer",
    subtract: true,
    fn(bruttoJahr: number, _settings: Settings): number {
        // Werte von 2025 (§32a EstG):

        const sonderausgabenPausch = 36;
        const grundfreibetrag = 12096;
        const eckpunkt1 = 17443;
        const eckpunkt2 = 68480;
        const eckpunkt3 = 277825;

        // Vorsorgepauschale (§ 39b Absatz 2 Satz 5 Nummer 3 EStG)
        const ZRE4VP = Math.min(bruttoJahr, rente.Beitragsbemessungsgrenze);
        const VSP1 = (rente.BeitragsSatz / 2 / 100) * ZRE4VP;
        const VSP2 = 0.12 * Math.min(bruttoJahr, rente.Beitragsbemessungsgrenze);

        const VSPN = VSP1 + Math.min(VSP2, 1900);

        const ZRE4VP_KVPV = Math.min(bruttoJahr, kv.Beitragsbemessungsgrenze);
        const VSP3 = ZRE4VP_KVPV * (0.07 + 0.025 / 2 + 0.018 + 0.006);

        const vorsorgepausch = Math.max(VSPN, VSP1 + VSP3);

        const versteuerndes_einkommen = Math.max(
            bruttoJahr - WerbungskostenPausch - vorsorgepausch - sonderausgabenPausch,
            0,
        );

        // §32a EStG:
        let steuer;
        if (versteuerndes_einkommen < grundfreibetrag) {
            steuer = 0;
        } else if (versteuerndes_einkommen < eckpunkt1 + 1) {
            const basis = (versteuerndes_einkommen - grundfreibetrag) / 10000;
            steuer = (932.3 * basis + 1400) * basis;
        } else if (versteuerndes_einkommen < eckpunkt2 + 1) {
            const basis = (versteuerndes_einkommen - eckpunkt1) / 10000;
            steuer = (176.64 * basis + 2397) * basis + 1015.13;
        } else if (versteuerndes_einkommen < eckpunkt3 + 1) {
            steuer = 0.42 * versteuerndes_einkommen - 10911.92;
        } else {
            steuer = 0.45 * versteuerndes_einkommen - 19246.67;
        }

        return Math.floor(steuer);
    },
};
