declare type ItemDescriptor = [string, string, string, number];
declare type ItemSetDescriptor = ItemDescriptor[];
declare type ClassItemSetDescriptor = ItemSetDescriptor[];
interface ItemMap {
    [key: string]: ClassItemSetDescriptor;
}
export declare const itemMap: ItemMap;
export {};
