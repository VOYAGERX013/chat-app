async function checkLogIn() {
    const fetchState = await fetch("http://localhost:5000/api/check-auth", {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": 'application/json',
            'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS'
        }
    })
    const loggedIn = await fetchState.json();
    return loggedIn;
}

export default checkLogIn;