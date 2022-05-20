import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import "../styles/Search.css";

function Search() {

    const navigate = useNavigate();
    const [query, setQuery] = useState("");

    const searchGroup = () => {
        navigate(`search/${query}`);
    }

    return (
        <div className="search-bar">
            <input onChange={(e) => setQuery(e.target.value)} type="text" className="input-search-bar" placeholder="Search groups" />
            <button onClick={searchGroup} className="btn btn-dark mx-2">Search</button>
        </div>
    )
}

export default Search