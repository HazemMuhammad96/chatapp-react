import sendIcon from "../send.svg"
import { useRef } from "react"
import { useParams } from "react-router-dom"
import { useState, useEffect, useCallback } from "react"
import { useContext } from "react"
import { SocketContext } from "../pages/chats"
import { getMessages } from "../data/requests"
import { useMemo } from "react"
import axios from "axios"
import { Box } from "@material-ui/core"
import "../stylesheets/messagesList.css"
import ReactScrollableFeed from "react-scrollable-feed"
import handleUnauthorized from "../data/handleUnauthorized"
import { API_LINK } from "../data/apiLink"

function ReceivedItem({ value, style }) {

    const styleClass = `message ${style}`
    return (
        <div style={{
            margin: "10px 0px"
        }}>
            <div style={{ color: "#9C9C9C", marginLeft: "7px", fontSize: ".8em" }}>
                {value.from}
            </div>
            <div className={styleClass}>{value.text}</div>
        </div>
    )
}

function ReceivedMessage({ message }) {

    return (
        <ReceivedItem value={message} style={"recievedMessage"} />
    )
}

function TypingIndecator({ from }) {
    return (
        <div>
            <ReceivedItem value={{ from, text: `Is Typing...` }} style={"typingIndecator"} />
        </div>
    )
}
function SentMessage({ message }) {
    return (
        <div style={{ textAlign: "right" }}>
            <div dir="ltr" className="message sentMessage">
                {message.text}
            </div>
        </div>
    )
}

function AlertNoChatSelected() {
    return (
        <div style={{ height: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
            <div style={{ background: "#DDEBFF", padding: "16px", borderRadius: "50px" }}>Select a chat to start messaging.</div>
        </div>
    )
}



export default function MessagesList() {

    const socket = useContext(SocketContext)
    const { chatId } = useParams()
    var messageRef = useRef()
    const lastMessageRef = useRef()
    const [messages, setMessages] = useState([])
    const [typers, setTypers] = useState([])



    useEffect(() => {
        if (chatId) {

            var recievers = []
            recievers = chatId.split(",")
            const recipients = [localStorage.getItem("currentUserId"), ...recievers]

            setMessages([])
            axios.post(`${API_LINK}/messages/`, { recipients }, { withCredentials: true }).then(
                res => {
                    setMessages([...res.data])
                }
            )
                .catch(err => {
                    if (err.response)
                        console.log(err.response.status)
                    handleUnauthorized(err)
                })

            socket.on(`RecieveMessage-${chatId}`, (message) => {
                setMessages(prevMessages => {
                    return [...prevMessages, message]
                })
                console.log(message)
            })

            socket.on(`typing-${chatId}`, ({ id, indicator }) => {
                if (indicator) {
                    if (!typers.includes(id)) {
                        setTypers([...typers, id])
                    }
                }
                else {
                    const newTypers = typers.filter(val => val != id)
                    setTypers([...newTypers])

                }
            })


        }

        return () => {
            socket.off(`RecieveMessage-${chatId}`)
            socket.off(`typing-${chatId}`)
        }


    }, [chatId])

    useEffect(() => {
  
        if (lastMessageRef.current) {
            lastMessageRef.current.scrollIntoView({ smooth: true })
        }


    })

    function onSendClicked(e) {
        const recipients = chatId.split(",")
        socket.emit(`sendMessage`, { to: recipients, message: messageRef.current.value })
        messageRef.current.value = null
        socket.emit("typing", { to: recipients, indicator: false })
        socket.emit("seenIndecator", { to: recipients, lastSeen: true })

    }

    function handleTyping(e) {
        const recipients = chatId.split(",")
        socket.emit("typing", { to: recipients, indicator: messageRef.current.value.length != 0 })
        
    }



    if (chatId)
        return (

            <div className="messagesListContainer">

                <div className="chatHeader">
                    <div>{`Chatting with ${chatId}`}</div>
                </div>
                <div className="messagesList">
                    <div>
                        {
                            
                            messages.map((m, i) => {
                                const last = messages.length - 1 == i
                                if (m.from == localStorage.getItem("currentUserId")) {
                                    return <SentMessage key={m.from + m.sentAt} message={m} />
                                } else {
                                    return <ReceivedMessage key={m.from + m.sentAt} message={m} />
                                }
                            })


                        }
                    </div>
                    <div>
                        {
                            typers.map((t, i) => {
                                return <TypingIndecator key={t} from={t} />
                            })
                        }
                    </div>
                    <div ref={lastMessageRef} />
                </div>
                <div className="inputFragment">
                    <input ref={messageRef} className="messageTextField"
                        placeholder="Type your message here..." onChange={handleTyping}
                    />
                    <img className="sendButton" src={sendIcon} onClick={onSendClicked} />
                </div>
            </div>

        )
    else return (
        <AlertNoChatSelected />
    )

}