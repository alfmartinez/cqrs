export class DecisionProjection<T> {

    public state: T = {} as T;
    private handlers: any = {};

    public register(eventType: any, action: (event: any) => void): DecisionProjection<T> {
        this.handlers[eventType.name] = action;
        return this;
    }

    public apply(events: any[] | any): DecisionProjection<T> {
        if (events instanceof Array) {
            events.forEach((singleEvent: any) => this.apply.call(this, singleEvent));
            return this;
        }

        const event = events;
        const typeName = event.constructor.name;

        const handler = this.handlers[typeName];
        if (handler) {
            handler.call(this.state, event);
        }

        return this;
    }
}
