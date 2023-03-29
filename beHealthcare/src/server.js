import express from "express";
import bodyParser from "body-parser";
import configViewEngine from "./config/viewEngine";
import initWebRoutes from "./routes/web";
import connectDB from "./config/connectDB";
const { Server } = require("socket.io");
const cors = require('cors');
const http = require('http');

require('dotenv').config();

let app = express();
// Add headers before the routes are defined
app.use(cors({
    origin: "*"
}))


const server = http.createServer(app);
const io = new Server(server, {
    cors:{
        origin: process.env.REACT_URL
    }
})

io.on("connection", (socket) => {
    console.log(`some one has connected: ${socket.id}`)

    socket.on("send_message", (data) => {
        console.log(data);
    })

    socket.on("disconnect", () => {
        console.log("someone has left")
    })
})

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))

configViewEngine(app);
initWebRoutes(app);

connectDB();

const port = process.env.PORT || 3001;
app.listen(port, () => {
    console.log("Backend running" + port);
})