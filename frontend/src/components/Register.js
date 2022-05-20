import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom';
import Error from "./Error";
import loginCheck from "../authenticate";
import "../styles/Register.css";

function Register() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [passwordProtected, setPasswordProtected] = useState(true);
    const [key, setKey] = useState(Math.random());
    const [error, setError] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        async function checkLogIn() {
            const checkLogin = await loginCheck();
            if (checkLogin.state) {
                navigate("/");
            }
        }
        checkLogIn();
    }, [])

    const registerUser = async (e) => {
        e.preventDefault();
        if (username !== "" && password !== "") {
            const registerUser = await fetch("http://localhost:5000/api/register", {
                method: "POST",
                headers: {
                    "Content-Type": 'application/json',
                    'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS'
                },
                body: JSON.stringify({ username, password })
            });
            const resultRegister = await registerUser.json();
            if (resultRegister.success) {
                navigate("/login");
            } else {
                setError("Username has been used");
                setKey(Math.random());
            }
        }
    }

    return (
        <>
            <div className="body-container">
                <div className="register-container" id="container">
                    <div className="form-container sign-in-container">
                        <form className="register-form" onSubmit={registerUser}>
                            <h2 className="heading">Register</h2>
                            <input onChange={(e) => setUsername(e.target.value)} className="form-input" type="text" name="username" placeholder="Username" autoComplete="off" />
                            <input onChange={(e) => setPassword(e.target.value)} type="password" name="password" className="input-password simple-password form-input" placeholder="Password" autoComplete="off" />
                            <Link className="forgot-link" to="/login">Already have an account? Login</Link>
                            <button type="submit" className="btn btn-dark">Register</button>
                        </form>    
                    </div>
                </div>
            </div>
            {error && <Error key={key} error={error} />}
        </>
    )
}

export default Register