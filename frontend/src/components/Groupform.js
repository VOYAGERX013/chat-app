import React, { useState } from 'react'
import { Link, useNavigate } from "react-router-dom";
import "../styles/Groupform.css";

function Groupform() {
    const [isPrivate, setIsPrivate] = useState(false);
    const [name, setName] = useState("");
    const [tags, setTags] = useState("");
    const [description, setDescription] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();

    const changeType = () => {
        setIsPrivate(!isPrivate);
    }

    const createGroup = async (e) => {
        e.preventDefault();
        const fetchData = await fetch("http://localhost:5000/api/create-group", {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": 'application/json',
                'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS'
            },
            body: JSON.stringify({
                name,
                tags,
                description,
                isPrivate,
                password
            })
        })

        const jsonFetch = await fetchData.json();
        if (jsonFetch.success){
            navigate(`/group/${name}`);
        }
    }

    return (
        <>
            <div className="form-container">
                <form onSubmit={createGroup}>
                    <div className="form-group">
                        <label className="label" htmlFor="group-name">Group name</label>
                        <input onChange={(e) => setName(e.target.value)} type="text" className="form-control create-group-data" id="group-name" placeholder="Enter your group name" />
                    </div>
                    <div className="form-group">
                        <label className="label" htmlFor="tags">Tags (separate the tags with a space)</label>
                        <input onChange={(e) => setTags(e.target.value)} type="text" className="form-control create-group-data" id="tags" placeholder="Enter your group tags" />
                    </div>
                    <div className="form-group">
                        <label className="label" htmlFor="description">Description</label>
                        <textarea style={{resize: "none"}} onChange={(e) => setDescription(e.target.value)} className="form-control create-group-data" id="description" placeholder="This group is for..." rows="4" cols="50">

                        </textarea>
                    </div>
                    <div className="form-group">
                        <label className="label" htmlFor="type">Group type</label>
                        <select onChange={changeType} className="form-control create-group-data">
                            <option>Public</option>
                            <option>Private</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label className="label" htmlFor="password">Password</label>
                        <input onChange={(e) => setPassword(e.target.value)} type="password" className="form-control create-group-data" id="password" disabled={!isPrivate} placeholder="Enter group password" />
                    </div>
                    <div className="btn-container">
                        <Link to="/" className="btn btn-dark mx-2">Go to home page</Link>
                        <button type="submit" className="btn btn-dark mx-2">Create group</button>
                    </div>
                </form>
            </div>
        </>
    )
}

export default Groupform