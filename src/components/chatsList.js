import { Divider } from '@material-ui/core';
import React, { useRef, useState } from 'react';
import addIcon from "../add.svg"
import { useHistory } from 'react-router-dom';
import { useContext } from 'react';
import { SocketContext } from '../pages/chats';
import UserBubble from './userBubble';
import "../stylesheets/chatList.css"
import { signOutRequest } from '../data/requests';
import { useEffect } from 'react';


function Chat({ chat }) {

    const history = useHistory()
    const [color, setColor] = useState("#C8DFFF")
    const socket = useContext(SocketContext)

    function onRoomClicked(e) {

        socket.emit("seenIndecator", { to: chat.recipients, lastSeen: true })
        setColor("transparent")
        history.push(`/chats/${chat.recipients.toString()}`)

    }

    // console.log("chat seeeeeeeeen")
    // var isSeen
    // if (chat.seen2)
    //     isSeen = (chat.seen2.filter(val => val.recipient == localStorage.getItem("currentUserId"))[0])
    // console.log(isSeen)


    useEffect(() => {
        if (chat.seen) {
            console.log("last   " + chat.seen)
            setColor(chat.seen ? "transparent" : "#C8DFFF")
        }
    }, [])



    return (
        <div className="unselectable" onClick={onRoomClicked} style={{
            background: color
        }}>
            <div className="chatItem">
                {chat.recipients.toString()}

                <div style={{
                    marginTop: "3px", fontWeight: "normal",
                    fontSize: "0.9em", lineBreak: "none",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                }}>
                    {chat.last.text}
                </div>
            </div>


            <Divider />
        </div>
    )
}

function Header() {

    const socket = useContext(SocketContext)
    const createdRoomName = useRef()
    const history = useHistory();

    function onComposeClicked(e) {

        const newRoom = createdRoomName.current.value
        if (newRoom.length != 0) {
            console.log(newRoom)
            const recipients = newRoom.split(",")
            socket.emit("createRoom", recipients)
            createdRoomName.current.value = null
        }

    }

    function onSignOutClicked(e) {
        signOutRequest()
        history.push("/signIn")
        // window.location.reload(true)

    }

    return (
        <>
            <div className="chatsHeader">
                <div>CHATS</div>
                <div onClick={onSignOutClicked}>
                    <UserBubble username={localStorage.getItem("currentUserId")} />
                </div>
            </div>
            <div>
                <div className="composeHeader">
                    <input className="composeTextField" placeholder="Enter username(s)" ref={createdRoomName} />
                    <div className="composeButton" >
                        <img src={addIcon} onClick={onComposeClicked} />
                    </div>
                </div>
                <Divider />
            </div>
        </>
    )
}

export default function ChatsList({ chats }) {


    return (
        <div className="chatListContainer">
            <Header />
            <div className="chatListFragment">
                {
                    chats.map(chat => {
                        return <Chat key={chat} chat={chat} />
                    })
                }
            </div>

        </div>
    )
}