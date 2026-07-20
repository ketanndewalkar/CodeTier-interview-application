import {WebSocketServer} from "ws"

export const setupWebSocket = async (server) =>{
    if(!server){
        throw new Error("Server Not Provided.");
    }

    const wss = new WebSocketServer({server});

    wss.on("connection",(socket,request)=>{
        socket.on("message",(data)=>{
            socket.send(data.toString)
        })
    })
}