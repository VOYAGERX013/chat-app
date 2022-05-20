import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom';
import loginCheck from "../authenticate";
import Error from "./Error";

function Register() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [key, setKey] = useState(Math.random());
    const [error, setError] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        async function checkLogIn(){
            const checkLogin = await loginCheck();
            if (checkLogin.state){
                navigate("/");
            }
        }
        checkLogIn();
    }, [])

    const loginUser = async (e) => {
        e.preventDefault();
        if (username !== "" && password !== ""){
            const loginUser = await fetch("http://localhost:5000/api/login", {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": 'application/json',
                    'Access-Control-Allow-Methods':'GET,PUT,POST,DELETE,PATCH,OPTIONS'
                },
                body: JSON.stringify({username, password})
            });
            const resultLogin = await loginUser.json();
            if (resultLogin.success) {
                navigate("/");
            } else {
                setError("Invalid credentials");
                setKey(Math.random());
            }    
        }
    }

    return (
        <>
            <div className="body-container">
                <div className="container" id="container">
                    <div className="form-container sign-in-container">
                        <form className="register-form" onSubmit={loginUser}>
                            <h2 className="heading">Login</h2>
                            <input onChange={(e) => setUsername(e.target.value)} className="form-input" type="text" name="username" placeholder="Username" autoComplete="off" />
                            <input onChange={(e) => setPassword(e.target.value)} type="password" name="password" className="input-password simple-password form-input" placeholder="Password" autoComplete="off" />
                            <Link className="forgot-link" to="/login">Don't have an account? Register</Link>
                            <button type="submit" className="btn btn-dark">Login</button>
                        </form>    
                    </div>
                </div>
            </div>
            {error && <Error key={key} error={error} />}
        </>
    )
}

export default Register