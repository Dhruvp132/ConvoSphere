import { Socket } from "socket.io";
import http from "http";
import express from "express";
import { Server } from 'socket.io';
import { UserManager } from "./UserManager";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*"
  }
});

const userManager = new UserManager();

io.on('connection', (socket: Socket) => {
  console.log('a user connected');
  // userManager.addUser("randomName", socket);

  socket.on("join", ({ name }) => {
    if(!name) name = "randomName";
    console.log(socket); 
    console.log(`User joined with name: ${name}`);
    userManager.addUser(name, socket);
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
    userManager.removeUser(socket);
  })
});

server.listen(8080, '0.0.0.0', () => {
    console.log('listening on *:8080');
});