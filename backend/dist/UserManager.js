"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserManager = void 0;
const RoomManager_1 = require("./RoomManager");
class UserManager {
    constructor() {
        this.users = [];
        this.queue = [];
        this.roomManager = new RoomManager_1.RoomManager();
    }
    addUser(name, socket) {
        this.users.push({
            name, socket
        });
        this.queue.push(socket.id);
        socket.send("lobby");
        this.clearQueue();
        this.initHandlers(socket);
    }
    removeUser(socket) {
        // const user = this.users.find(x => x.socket.id === socket.id)
        // this.users = this.users.filter(x => x.socket.id !== socket.id)
        // this.queue = this.queue.filter(x => x === socket.id)
        const user = this.users.find(x => x.socket.id === socket.id);
        console.log("removing user");
        if (user) {
            this.users = this.users.filter(x => x.socket.id !== socket.id);
            this.queue = this.queue.filter(x => x !== socket.id);
        }
    }
    clearQueue() {
        console.log("inside clear queue");
        console.log(this.queue.length);
        if (this.queue.length < 2)
            return;
        const id1 = this.queue.pop();
        const id2 = this.queue.pop();
        const user1 = this.users.find(x => x.socket.id === id1);
        const user2 = this.users.find(x => x.socket.id === id2);
        console.log(user1 === null || user1 === void 0 ? void 0 : user1.name);
        console.log(user2 === null || user2 === void 0 ? void 0 : user2.name);
        if (!user1 || !user2)
            return;
        console.log("creating room");
        const room = this.roomManager.createRoom(user1, user2);
        this.clearQueue();
    }
    initHandlers(socket) {
        socket.on("offer", ({ roomId, sdp }) => {
            console.log("offer received");
            this.roomManager.onOffer(roomId, sdp, socket.id);
        });
        socket.on("answer", ({ roomId, sdp }) => {
            console.log("answer receeived");
            this.roomManager.onAnswer(roomId, sdp, socket.id);
        });
        socket.on("add-ice-candidate", ({ roomId, candidate, type }) => {
            this.roomManager.onIceCandidates(roomId, socket.id, candidate, type);
        });
        socket.on("change", () => {
            this.removeUser(socket);
            this.addUser(socket.id, socket);
        });
    }
}
exports.UserManager = UserManager;
