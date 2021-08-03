import React from "react"
import MessagesList from "../components/messagesList"
import ChatsList from "../components/chatsList"
import socketIO from "socket.io-client"
import { useState, useEffect } from "react"
import axios from "axios"
import handleUnauthorized from "../data/handleUnauthorized"
import { useHistory } from "react-router-dom"
import { API_LINK, SOCKETS_LINK } from "../data/apiLink"


export const SocketContext = React.createContext()

const socket = socketIO.connect(SOCKETS_LINK,
    {
        query: { id: localStorage.getItem("currentUserId") },
    }
)


export default function Chats() {

    const [chats, setChats] = useState([])
    const history = useHistory()
    useEffect(() => {
        const currentUser = localStorage.getItem("currentUserId")
        axios.post(`${API_LINK}/chats/`, { username: currentUser }, { withCredentials: true })
            .then(res => {
                console.log(res.data)
                const retrievedChats = res.data.map((chat) => {
                    const recipients = chat.recipients

                    return recipients.filter(val => val != currentUser)
                })
                console.log(retrievedChats)
                setChats([...retrievedChats])
            })
            .catch(err => {
                if (err.response)
                    console.log(err.response.status)
                handleUnauthorized(err)

            })

    }, [])

    useEffect(() => {
        socket.on("connect", () => {
            console.log(`Connected ${socket.id}`);
        });

        socket.on("connect_error", (err) => {
            console.log(`connect_error due to ${err.message}`);
        });

        socket.on("RecieveRoom", (room) => {
            setChats(prevRooms => {
                return [room, ...prevRooms]
            })
            console.log(`receivedRoom ${room}`)
        })


        return () => socket.close()
    }, [])

    return (
        <SocketContext.Provider value={socket}>

            <div className="container">
                <div className="chatsFragment" style={{ height: "100%" }}>
                    <ChatsList socket={socket} chats={chats} />
                </div>

                <div className="messagesFragment" style={{ background: "#F5F9FF" }}>
                    <MessagesList />
                </div>
            </div>

        </SocketContext.Provider>
    )
}

