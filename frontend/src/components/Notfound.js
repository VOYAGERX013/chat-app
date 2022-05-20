import React from 'react';
import { Link } from "react-router-dom";
import "../styles/Notfound.css";

function Notfound() {
    return (
        <>
        <div className="error-container">
            <div className="center-elem">
                <h1>404 Error</h1>
                <Link className="btn btn-dark navigate-btn" to="/">Home page</Link>
            </div>
        </div>
        </>
    )
}

export default Notfound