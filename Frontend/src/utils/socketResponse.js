class Response{
    constructor(namespace,event,from,to,payload){
        this.namespace = namespace;
        this.event = event;
        this.from = from;
        this.to = to;
        this.payload = payload;
    }
}

export const socketResponse = (namespace,event,from,to,payload) =>{
    return JSON.stringify(new Response(namespace,event,from,to,payload));
}