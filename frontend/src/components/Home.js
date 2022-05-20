import React, { useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom";
import Navbar from './Navbar';
import Card from "./Card";
import loginCheck from "../authenticate";
import "../styles/Home.css";

function Home() {

    const navigate = useNavigate();
    const [groupData, setGroupData] = useState([]);

    useEffect(() => {
        async function checkLogIn(){
            const checkLogin = await loginCheck();
            console.log(`checkLogin: ${checkLogin}`)
            if (!checkLogin.state){
                navigate("/register");
            } else {
                const getGroups = async () => {
                    const fetchData = await fetch("http://localhost:5000/api/get-groups", {
                        method: "GET",
                        credentials: "include",
                        headers: {
                            "Content-Type": 'application/json',
                            'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS'
                        }
                    })
        
                    const jsonFetch = await fetchData.json();
                    setGroupData(jsonFetch.groupData);
                }
        
                getGroups();        
            }
        }
        checkLogIn();
    }, [])

    return (
        <>
            <Navbar />
            <div className="my-5 mx-5">
                <h3 className="heading-text">Your Network</h3>
                <div className="row">
                    {groupData?.map((elem, idx) => {
                        return <Card key={idx} heading={elem[0]} description={elem[1]} />
                    })}
                </div>
            </div>
        </>
    )
}

export default Home