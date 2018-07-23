export declare class DecisionProjection<T> {
    state: T;
    private handlers;
    register(eventType: any, action: (event: any) => void): DecisionProjection<T>;
    apply(events: any[] | any): DecisionProjection<T>;
}
