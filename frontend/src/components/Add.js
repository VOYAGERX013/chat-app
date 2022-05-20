import React from "react";
import { Link } from "react-router-dom";
import "../styles/Add.css";

function Add() {
    return (
        <div className="button-container">
            <Link className="add-btn bg-dark" to="/new-group">+</Link>
        </div>
    )
}

export default Add;