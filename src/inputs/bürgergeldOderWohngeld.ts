import type { DiagramInput } from "../components/types";
import { Bürgergeld } from "./bürgergeld";
import { Wohngeld } from "./wohngeld";

export const BürgergeldOhneWohngeld: DiagramInput = {
    ...Bürgergeld,
    fn(bruttoJahr, settings) {
        const bürgergeld = Bürgergeld.fn(bruttoJahr, settings);
        const wohngeld = Wohngeld.fn(bruttoJahr, settings);
        if (bürgergeld > wohngeld) {
            return bürgergeld;
        }
        return 0;
    },
};

export const WohngeldOhneBürgergeld: DiagramInput = {
    ...Wohngeld,
    fn(bruttoJahr, settings) {
        const bürgergeld = Bürgergeld.fn(bruttoJahr, settings);
        const wohngeld = Wohngeld.fn(bruttoJahr, settings);
        if (wohngeld > bürgergeld) {
            return wohngeld;
        }
        return 0;
    },
};
