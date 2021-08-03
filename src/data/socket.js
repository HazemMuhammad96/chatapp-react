import socketIO from "socket.io-client"

var socket

export default socket = socketIO.connect("http://localhost:4000",
    { query: { id: localStorage.getItem("currentUserId") } })