export interface Settings {
    kvErmäßigt: boolean;
    wohnkosten?: {
        kaltmiete: number;
        heizkosten: number;
    };
}

export interface DiagramInput {
    legende: string;
    subtract: boolean;
    fn: (bruttoJahr: number, settings: Settings) => number;
}
