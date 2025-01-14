import { Type, type DiagramInput } from "./types";

export const Einkommensteuer: DiagramInput = {
    legende: "Einkommensteuer",
    type: Type.SUBSTRACT,
    fn(brutto_einkommen: number): number {
        // Werte von 2025 (§32a EstG):
        const webungskosten_pausch = 1230;
        const grundfreibetrag = 12096;
        const eckpunkt1 = 17447;
        const eckpunkt2 = 68496;
        const eckpunkt3 = 285048;

        const versteuerndes_einkommen = Math.max(brutto_einkommen - webungskosten_pausch, 0);

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
