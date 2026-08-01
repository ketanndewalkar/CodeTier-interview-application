// websocket/managers/connection.manager.js


const connections = new Map();



export function addConnection(
    socketId,
    data
){


    connections.set(
        socketId,
        data
    );

}



export function getConnection(
    socketId
){


    return connections.get(socketId);

}




export function removeConnection(
    socketId
){


    connections.delete(socketId);

}