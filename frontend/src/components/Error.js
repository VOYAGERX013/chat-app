import React, { useState } from 'react'
import "../styles/Error.css";

function Error(props) {
    const [visibility, setVisibility] = useState(true);

    const hideError = () => {
        setVisibility(false);
    }

    return (
        <div className="error" style={{display: !visibility ? "none" : "block" }}>
            <button onClick={hideError} className="close-error">x</button>
            <h4>{props.error}</h4>
        </div>
    )
}

export default Error