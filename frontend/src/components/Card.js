import React from 'react'
import { Link } from "react-router-dom"

function Card(props) {
    return (
        <div className="col-sm-3 my-2">
            <div className="card groups-container">
                <div className="card-body">
                    <h5 className="card-title" style={{fontWeight: "bold"}}>{props.heading}</h5>
                    <p className="card-text">{props.description}</p>
                    <Link onClick={props.action} to={`/group/${props.heading}`} className="btn btn-dark">{props.message}</Link>
                </div>
            </div>
        </div>
    )
}

Card.defaultProps = {
    message: "Navigate",
    action: (() => null)
}

export default Card