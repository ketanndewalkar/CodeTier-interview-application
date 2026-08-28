export class socketResponse {
    constructor(namespace, event, from, to, payload) {
        this.namespace = namespace
        this.event = event
        this.from = from
        this.to = to
        this.payload = payload
    }
}