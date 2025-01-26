export interface Settings {
    kvErmäßigt: boolean;
}

export interface DiagramInput {
    legende: string;
    subtract: boolean;
    fn: (bruttoJahr: number, settings: Settings) => number;
}
