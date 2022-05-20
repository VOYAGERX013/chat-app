import React, { useEffect, useState } from 'react'
import Navbar from "./Navbar";
import Card from "./Card";
import { useNavigate, useParams } from 'react-router-dom';

function Searchgroups() {

    const navigate = useNavigate()
    const params = useParams();

    const [groupData, setGroupData] = useState([]);

    const joinGroup = async (group_name) => {

        const fetchUsername = await fetch("http://localhost:5000/api/get-username", {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": 'application/json',
                'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS'
            }
        });

        const jsonUsername = await fetchUsername.json();
        const username = jsonUsername.username;

        const fetchGroupState = await fetch("http://localhost:5000/api/check-public", {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": 'application/json',
                'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS'
            },
            body: JSON.stringify({
                name: group_name
            })
        })

        const jsonFetchState = await fetchGroupState.json();

        if (jsonFetchState.public){
            const join = await fetch("http://localhost:5000/api/add-participant", {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": 'application/json',
                    'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS'
                },
                body: JSON.stringify({
                    name: group_name,
                    participant: username
                })
            })
    
            const jsonJoin = await join.json();
            if (!jsonJoin.success){
                navigate("/notfound");
            }
        } else{
            const inputPass = prompt("What is the password to join this group?");
            const passCheck = await fetch("http://localhost:5000/api/check-group-password", {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": 'application/json',
                    'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS'
                },
                body: JSON.stringify({
                    name: group_name,
                    password: inputPass
                })
            })
    
            const jsonPassCheck = await passCheck.json();
            if (jsonPassCheck.check){
                const join = await fetch("http://localhost:5000/api/add-participant", {
                    method: "POST",
                    credentials: "include",
                    headers: {
                        "Content-Type": 'application/json',
                        'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS'
                    },
                    body: JSON.stringify({
                        name: group_name,
                        participant: username
                    })
                })
        
                const jsonJoin = await join.json();
                if (!jsonJoin.success){
                    navigate("/notfound");
                }    
            } else{
                navigate("/");
            }
        }

    }

    useEffect(() => {
        async function fetchGroups(){
            const groupFetch = await fetch("http://localhost:5000/api/search-groups", {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": 'application/json',
                    'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS'
                },
                body: JSON.stringify({ query: params.query })
            })

            const jsonResult = await groupFetch.json();

            if (jsonResult.success){
                setGroupData(jsonResult.result);
                console.log(jsonResult.result);
            } else{
                if (!jsonResult.login){
                    navigate("/register");
                }
            }
        }

        fetchGroups();

    }, [])

    return (
        <>
            <Navbar active="groups" />
            <div className="result-groups-container my-5 mx-5">
                <h1>Results</h1>
                <div className="row">
                    {groupData.map((elem, idx) => {
                        return <Card action={() => joinGroup(elem[0])} key={idx} message="Join group" heading={elem[0]} description={elem[1]} initial_link="join" />
                    })}
                </div>
            </div>
        </>
    )
}

export default Searchgroups