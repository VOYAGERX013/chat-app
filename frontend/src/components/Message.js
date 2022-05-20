import React from 'react'
import "../styles/Profile.css";

function Message(props) {
    return (
        <>
            <div className="profile-username-container">
                <div className="profile" style={{ background: props.background }}>{props.initial.toUpperCase()}</div>
                <p className="username-text">{props.username}</p>
            </div>
            <p className="text">{props.text}</p>
        </>
    )
}

export default Message