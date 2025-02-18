import type { DiagramInput } from "../components/types";

export const Wohnkosten: DiagramInput = {
    legende: "Wohnkosten",
    subtract: true,
    fn(_bruttoJahr, settings) {
        if (settings.wohnkosten) {
            return (settings.wohnkosten.kaltmiete + settings.wohnkosten.heizkosten) * 12;
        }
        return 0;
    },
};
