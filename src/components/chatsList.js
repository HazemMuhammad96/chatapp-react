import { Divider } from '@material-ui/core';
import React, { useRef } from 'react';
import addIcon from "../add.svg"
import { useHistory } from 'react-router-dom';
import { useContext } from 'react';
import { SocketContext } from '../pages/chats';
import UserBubble from './userBubble';
import "../stylesheets/chatList.css"
import { signOutRequest } from '../data/requests';


function Chat({ chat }) {

    const history = useHistory();

    function onRoomClicked(e) {
        history.push(`/chats/${chat}`)
    }

    return (
        <div onClick={onRoomClicked}>
            <div className="unselectable chatItem">
                {chat.toString()}
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