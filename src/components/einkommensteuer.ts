import { Arbeitslosenversicherung } from "./arbeitslosenversicherung";
import { Krankenversicherung } from "./krankenversicherung";
import { Rente } from "./rente";
import { Type, type DiagramInput } from "./types";

export const Einkommensteuer: DiagramInput = {
    legende: "Einkommensteuer",
    type: Type.SUBSTRACT,
    fn(bruttoJahr: number): number {
        // Werte von 2025 (§32a EstG):
        const webungskosten_pausch = 1230;
        const grundfreibetrag = 12096;
        const eckpunkt1 = 17443;
        const eckpunkt2 = 68480;
        const eckpunkt3 = 277825;

        const rente = Rente.fn(bruttoJahr);
        const kv = Krankenversicherung.fn(bruttoJahr);
        const av = Arbeitslosenversicherung.fn(bruttoJahr);

        const sonderausgaben = rente + kv + av;

        const versteuerndes_einkommen = Math.max(bruttoJahr - webungskosten_pausch - sonderausgaben, 0);

        const tarif1_basis = Math.min(
            Math.max(versteuerndes_einkommen - grundfreibetrag, 0),
            eckpunkt1 - grundfreibetrag,
        );
        const tarif1_steuer = (((954.8 * tarif1_basis) / 10000 + 1400) * tarif1_basis) / 10000;

        const tarif2_basis = Math.min(Math.max(versteuerndes_einkommen - eckpunkt1, 0), eckpunkt2 - eckpunkt1);
        const tarif2_steuer = (((181.19 * tarif2_basis) / 10000 + 2397) * tarif2_basis) / 10000;

        const tarif3_basis = Math.min(Math.max(versteuerndes_einkommen - eckpunkt2, 0), eckpunkt3 - eckpunkt2);
        const tarif3_steuer = 0.42 * tarif3_basis;

        const tarif4_basis = Math.max(versteuerndes_einkommen - eckpunkt3, 0);
        const tarif4_steuer = 0.45 * tarif4_basis;

        return tarif1_steuer + tarif2_steuer + tarif3_steuer + tarif4_steuer;
    },
};
