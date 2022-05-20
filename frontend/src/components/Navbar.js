import React from 'react'
import { Link } from "react-router-dom";

function Navbar(props) {

    const centerLinks = {
        position: "absolute",
        left: "50%",
        transform: "translatex(-50%)"
    }

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <a className="navbar-brand" href="#">Chat App</a>
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>

            <div className="collapse navbar-collapse" id="navbarSupportedContent">
                <ul className="navbar-nav mr-auto" style={centerLinks}>
                    <li className={`${props.active === "home" ? "nav-item active" : "nav-item"}`}>
                        <Link className="nav-link" to="/">Home</Link>
                    </li>
                    <li className={`${props.active === "groups" ? "nav-item active" : "nav-item"}`}>
                        <Link className="nav-link" to="/groups">Groups</Link>
                    </li>
                </ul>
            </div>
        </nav>
    )
}

Navbar.defaultProps = {
    active: "home"
}

export default Navbar