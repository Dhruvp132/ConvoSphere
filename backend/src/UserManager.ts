import { Socket } from "socket.io";
import { RoomManager } from "./RoomManager";

export interface User { 
    socket : Socket; 
    name : string; 
}

export class UserManager {
    private users : User[];
    private queue : string[]; 
    private roomManager : RoomManager
    
    constructor() {
        this.users = [];
        this.queue = [];
        this.roomManager = new RoomManager();  
    }

    addUser(name :string, socket : Socket) {
        this.users.push({
            name, socket
        })
        this.queue.push(socket.id); 
        socket.send("lobby")
        this.clearQueue(); 
        this.initHandlers(socket); 
    }

    removeUser(socket : Socket) {
        // const user = this.users.find(x => x.socket.id === socket.id)

        // this.users = this.users.filter(x => x.socket.id !== socket.id)
        // this.queue = this.queue.filter(x => x === socket.id)

        const user = this.users.find(x => x.socket.id === socket.id);
        console.log("removing user")
        if (user) {
            this.users = this.users.filter(x => x.socket.id !== socket.id);
            this.queue = this.queue.filter(x => x !== socket.id);
        }
    }   

    clearQueue() { 
        console.log("inside clear queue")
        console.log(this.queue.length)
        if(this.queue.length < 2) return; 

        const id1 = this.queue.pop();
        const id2 = this.queue.pop();
        const user1 = this.users.find(x => x.socket.id === id1)
        const user2 = this.users.find(x => x.socket.id === id2)  
        console.log(user1?.name)
        console.log(user2?.name)
        if(!user1 || !user2) return;

        console.log("creating room")
        const room = this.roomManager.createRoom(user1, user2);
        this.clearQueue(); 
    }

    initHandlers(socket : Socket) {
        socket.on("offer", ({roomId, sdp} : {sdp : string, roomId : string}) => {
            console.log("offer received")
            this.roomManager.onOffer(roomId, sdp, socket.id); 
        })

        socket.on("answer", ({roomId, sdp} : {sdp : string, roomId : string}) => {
            console.log("answer receeived")
            this.roomManager.onAnswer(roomId, sdp, socket.id); 
        })

        socket.on("add-ice-candidate", ({roomId, candidate, type}) => {
            this.roomManager.onIceCandidates(roomId, socket.id, candidate, type)
        })
        
        socket.on("change", () => {
            this.removeUser(socket); 
            this.addUser(socket.id, socket); 
        })
    }
}