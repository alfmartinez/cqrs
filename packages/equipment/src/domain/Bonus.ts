export class Bonus {
    public category: string;
    public attribute: string;
    public value: number;

    constructor(category: string, attribute: string, value: number) {
        this.category = category;
        this.attribute = attribute;
        this.value = value;
    }
}
