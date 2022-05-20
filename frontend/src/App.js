import './App.css';
import { Routes, Route } from "react-router-dom";
import Register from "./components/Register";
import Login from "./components/Login";
import Home from "./components/Home";
import Groupchat from "./components/Groupchat";
import Groupform from "./components/Groupform";
import Notfound from './components/Notfound';
import Groups from './components/Groups';
import Searchgroups from "./components/Searchgroups";

function App() {
    return (
        <>
        <Routes>
            <Route exact path="/" element={<Home />}></Route>
            <Route exact path="/register" element={<Register />}></Route>
            <Route exact path="/login" element={<Login />}></Route>
            <Route exact path="/groups" element={<Groups />}></Route>
            <Route path="/group/:name" element={<Groupchat />}></Route>
            <Route path="/groups/search/:query" element={<Searchgroups />}></Route>
            <Route exact path="/new-group" element={<Groupform />}></Route>
            <Route exact path="/*" element={<Notfound />}></Route>
        </Routes>
        </>
    );
}

export default App;
