import React, { useEffect, useState, useRef } from 'react'
import { useParams, useNavigate } from "react-router-dom";
import io from "socket.io-client";
import Message from "./Message";
import loginCheck from "../authenticate";
import Navbar from "./Navbar";
import "../styles/Groupchat.css";

function Group() {
    const params = useParams();
    const navigate = useNavigate();
    const divRef = useRef(null);

    const [isLoggedIn, setIsLoggedIn] = useState(true);
    const [messages, setMessages] = useState([]);
    const [sendText, setSendText] = useState("");
    const [currentSocket, setCurrentSocket] = useState(null);

    const sendMessage = async () => {
        const fetchData = await fetch(`http://localhost:5000/api/get-username`, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": 'application/json',
                'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS'
            }
        })

        const jsonFetch = await fetchData.json();
        console.log("Username");
        console.log(jsonFetch.username);
        currentSocket.emit("new-message", params.name, sendText, jsonFetch.username);
        setSendText("");
    }

    useEffect(() => {
        let socket;

        if (isLoggedIn) {
            socket = io.connect("http://localhost:3001");
            setCurrentSocket(socket);

            socket.emit("join-user", params.name);

            socket.on("retrieve", (array) => {
                setMessages(array);
            })

            socket.on("retrieve-new-message", (message, sender) => {
                console.log(sender);
                console.log(message);
                setMessages(arr => [...arr, [message, sender]]);
            })
        }
    }, [isLoggedIn])

    useEffect(() => {
        async function checkLogIn() {
            const checkLogin = await loginCheck();
            if (!checkLogin) {
                setIsLoggedIn(false);
                navigate("/register");
            } else {
                const fetchData = await fetch(`http://localhost:5000/api/group/${params.name}`, {
                    method: "GET",
                    credentials: "include",
                    headers: {
                        "Content-Type": 'application/json',
                        'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS'
                    }
                })

                const jsonFetch = await fetchData.json();
                console.log(jsonFetch);
                if (!jsonFetch.success) {
                    navigate("/notfound");
                } else {
                    setIsLoggedIn(true);
                }
            }
        }

        checkLogIn();
    }, [])

    useEffect(() => {
        divRef.current.scrollIntoView({ block: "end", behavior: "smooth" });
    });

    return (
        <>
            <Navbar active="groups" />
            <h2 className="mx-3 my-3 font-weight-bold">{params.name}</h2>
            <div className="messages container bg-dark">
                <div ref={divRef} id={'el'} className="message-holder scrollbar scrollbar-dark">
                    {messages.map((message, idx) => {
                        return (
                            <div key={`div-${idx}`} data-first={idx === 0 ? "true" : "false"}>
                                <Message key={`message-${idx}`} username={message[1]} text={message[0]} initial={message[1][0]} background={"#6495ED"} />
                                <hr style={{ border: "1px solid rgb(71, 71, 71)" }} />
                            </div>
                        )
                    })}
                </div>
                <div className="message-sender container">
                    <input type="text" value={sendText} onChange={(e) => setSendText(e.target.value)} className="form-control" placeholder="Type a message" />
                    <button onClick={sendMessage} className="btn btn-primary send-btn">Send</button>
                </div>
            </div>
        </>
    )
}

export default Group