export enum Type {
    ADD = "ADD",
    SUBSTRACT = "SUBSTRACT",
}

export interface DiagramInput {
    legende: string;
    type: Type;
    fn: (bruttoJahr: number) => number;
}
