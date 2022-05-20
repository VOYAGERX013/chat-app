import React, { useState, useEffect } from 'react'
import Navbar from "./Navbar";
import loginCheck from "../authenticate";
import Card from "./Card";
import { useNavigate } from 'react-router-dom';
import "../styles/Groups.css";
import Search from "./Search";
import Add from './Add';

function Group() {

    const navigate = useNavigate();

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

    const [relatedGroups, setRelatedGroups] = useState([]);

    useEffect(() => {
        async function checkLogIn(){
            const checkLogin = await loginCheck();
            if (!checkLogin.state){
                navigate("/register");
            } else {
                const getGroups = async () => {
                    const fetchData = await fetch("http://localhost:5000/api/find-related-groups", {
                        method: "POST",
                        credentials: "include",
                        headers: {
                            "Content-Type": 'application/json',
                            'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS'
                        }
                    })
        
                    const jsonFetch = await fetchData.json();
                    setRelatedGroups(jsonFetch.data);
                    console.log(relatedGroups);
                }
        
                getGroups();        
            }
        }
        checkLogIn();
    }, [])

    return (
        <>
            <Navbar active="groups" />
            <Search />
            <div className="my-3 mx-5 groups-container">
                <h3 className="heading-text">Related groups</h3>
                <div className="all-groups">
                    <div className="row">
                        {relatedGroups.map((elem, idx) => {
                            return <Card action={() => joinGroup(elem[0])} message="Join group" key={idx} heading={elem[0]} description={elem[1]} />
                        })}
                    </div>
                </div>
            </div>
            <Add />
        </>
    )
}

export default Group