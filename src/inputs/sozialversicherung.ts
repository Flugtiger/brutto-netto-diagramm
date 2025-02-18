import { Geringfügigkeitsgrenze } from "./grundlage";

export function beitragspflichtigeEinnahme(bruttoJahr: number) {
    // Werte für 2025
    const f = 0.6683;
    const g = Geringfügigkeitsgrenze;

    const bruttoMonat = bruttoJahr / 12;

    // § 20 Absatz 2a Satz 1 SGB IV:
    const beMonat = f * g + (2000 / (2000 - g) - (g * f) / (2000 - g)) * (bruttoMonat - g);
    return beMonat * 12;
}

export function beitragspflichtigeEinnahmeArbeitnehmer(bruttoJahr: number) {
    // Werte für 2025
    const g = Geringfügigkeitsgrenze; // geringfügigkeitsgrenze

    const bruttoMonat = bruttoJahr / 12;

    // §20 SGB IV
    if (bruttoMonat < 2000) {
        const beMonat = (2000 / (2000 - g)) * Math.max(bruttoMonat - g, 0);
        return beMonat * 12;
    }
    return bruttoJahr;
}
