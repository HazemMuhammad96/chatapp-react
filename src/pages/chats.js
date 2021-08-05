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
                const retrievedChats = res.data
                console.log("chatsssss")
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



        socket.on("RecieveRoom", (chatId) => {
            console.log(`receivedRoom ${chatId}`)

            setChats(prevRooms => {
                return [...prevRooms, {
                    recipients: chatId.toString().split(","),
                    last: {
                        from: "hint",
                        text: "Send a message...",
                        sentAt: new Date().getTime(),
                    }
                }]
            })


        })


        return () => socket.close()
    }, [])

    useEffect(() => {


        socket.on("RecieveNotification", ({ chatId, last, seen }) => {
            const index = chats.findIndex(current => {
                return current.recipients.toString() == chatId
            }
            )

            if (chats[index]) {
                chats[index].last = last
                chats[index].seen = seen
            }

            if (chats && chats.length > 1)
                chats.sort((first, second) => first.last.sentAt > second.last.sentAt ? -1 : 1)
            setChats([...chats])

        })



    }, [chats])

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

