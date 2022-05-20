const express = require("express");
const auth = require("authenticatejs"); // -> My own package
const { List } = require("list-maker"); // -> My own package;
const User = require("../models/User");
const Group = require("../models/Group");
const Message = require("../models/Message");
const bcrypt = require("bcryptjs");
const http = require("http");
const { Server } = require("socket.io");
const router = express.Router();

// Socket server

const server = http.createServer(express());
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["POST", "GET"]
    }
});

io.on("connection", (socket) => {
    socket.on("send", (data) => {
        socket.broadcast.emit("receive", data)
    });

    socket.on("join-user", (group_name) => {
        socket.join(group_name);
    })
    
    socket.on("new-message", (group_name, msg, sender) => {
        const newMsg = new Message({
            sender,
            group: group_name,
            message: msg
        })

        newMsg.save();
        io.to(group_name).emit("retrieve-new-message", msg, sender);
    })
})

// Group and message routes

router.get("/group/:name", (req, res) => {
    if (auth.isLoggedIn(req, process.env.SECRET)){
        const groupName = req.params.name;
        Group.find({ name: groupName }, (error, groupData) => {
            if (error){
                res.json({ success: false, msg: "DatabaseError" });
            } else{
                if (groupData.length > 0){
                    Message.find({ group: groupName }, (err, rawData) => {
                        if (err){
                            res.json({ success: false, msg: "DatabaseError" });
                        } else {
                            const sendData = [];
                            rawData.map((elem) => {
                                sendData.push([elem.message, elem.sender]);
                            })

                            io.emit("retrieve", sendData);
                            res.json({ success: true, data: sendData });  
                        }
                    })                            
                } else{
                    res.json({ success: false, msg: "GroupNotFound" });
                }
            }
        })
    } else{
        res.json({ success: false, msg: "LoginError" });
    }
})

router.post("/create-group", async (req, res) => {
    if (auth.isLoggedIn(req, process.env.SECRET)){
        const creator = await auth.getUsername(req, "username", process.env.SECRET);
        if (req.body.isPrivate){
            const salt = await bcrypt.genSalt(10);
            const hashed_password = await bcrypt.hash(req.body.password, salt);
            const newGroup = new Group({
                name: req.body.name,
                description: req.body.description,
                creator,
                participants: [creator],
                password: hashed_password,
                public: false,
                tags: req.body.tags.split(" ")
            });
    
            newGroup.save();
    
            res.json({success: true});
        } else{
            const newGroup = new Group({
                name: req.body.name,
                description: req.body.description,
                creator,
                participants: [creator],
                public: true,
                tags: req.body.tags.split(" ")
            });

            newGroup.save();

            res.json({ success: true });
        }
    } else{
        res.json({ success: false });
    }
})

router.get("/get-groups", async (req, res) => {
    if (auth.isLoggedIn(req, process.env.SECRET)){
        const username = await auth.getUsername(req, "username", process.env.SECRET);
        const groupData = [];
        Group.find({  }, (err, response) => {
            if (err){
                res.json({ success: false });
            } else{
                response.map((group) => {
                    if (group.participants.includes(username)){
                        groupData.push([group.name, group.description]);
                    }
                })

                res.json({ groupData });
            }
        })
    } else{
        res.json({ success: false });
    }
})

router.post("/add-participant", async (req, res) => {
    if (auth.isLoggedIn(req, process.env.SECRET)){
        const group = await Group.findOne({ name: req.body.name });
        let participants = group.participants;
        participants.push(req.body.participant);

        console.log("Hello mercury");
        console.log(group.name);
        console.log(req.body.participant);
        console.log(participants);
        console.log(!participants.includes(req.body.participant));

        Group.findOneAndUpdate({
            name: req.body.name
        }, {
            participants
        }, {
            new: true,
            useFindAndModify: false,
        }, (err) => {
            if (err){
                res.json({ success: false });
            } else{
                res.json({ success: true });
            }
        })

    } else{
        res.json({ success: false });
    }
})

router.post("/add-message", (req, res) => {
    if (auth.isLoggedIn(req, process.env.SECRET)){
        const sender = auth.getUsername(req, "username", process.env.SECRET);
        const newMsg = new Message({
            sender,
            group: req.body.group,
            message: req.body.message
        });

        newMsg.save();

        res.json({ success: true });
    } else{
        res.json({ success: false });
    }
})

router.post("/search-groups", (req, res) => {
    if (auth.isLoggedIn(req, process.env.SECRET)){
        const query = req.body.query;
        console.log("Log in");
        Group.find({  }, (err, response) => {
            console.log("Enter")
            if (err){
                console.log("Error");
                console.log(err);
                res.json({ success: false, login: true });
            } else{
                console.log(response);
                console.log(query);
                const filterGroups = [];
                response.map((elem) => {
                    if (elem.tags.includes(query)){
                        filterGroups.push([elem.name, elem.description, elem.tags]);
                    }
                })

                console.log(filterGroups);

                res.json({ success: true, result: filterGroups });
            }
        })
    } else{
        res.json({ success: false, login: false });
    }
})

router.post("/find-related-groups", (req, res) => {
    if (auth.isLoggedIn(req, process.env.SECRET)){
        const username = auth.getUsername(req, "username", process.env.SECRET);
        Group.find({  }, (err, response) => {
            if (err){
                res.json({ success: false });
            } else{
                // Getting all the tags of groups the user is in

                const userTags = [];
                response.map((elem) => {
                    if (elem.participants.includes(username)){
                        elem.tags.map((tag) => {
                            userTags.push(tag);
                        })
                    }
                })

                // Finding other groups that have any of the tags the user does and storing the number of similar tags and the name of that group

                let hits = [];
                let groupName = [];
                let groupDesc = [];

                response.map((elem, idx) => {
                    userTags.map((userTag) => {
                        if (elem.tags.includes(userTag) && !elem.participants.includes(username)){
                            if (!hits[idx]){
                                hits[idx] = 1;
                            } else{
                                hits[idx] ++;
                            }
                            if (!groupName[idx]){
                                groupName[idx] = elem.name;
                                groupDesc[idx] = elem.description;
                            }
                        }
                    })
                })

                // Removing undefined or null values from both arrays

                let filteredHits = hits.filter((elem) => {
                    return elem !== null && typeof elem !== undefined
                })

                let filteredGroupName = groupName.filter((elem) => {
                    return elem !== null && typeof elem !== undefined;
                })

                let filteredDesc = groupDesc.filter((elem) => {
                    return elem !== null && typeof elem !== undefined;
                })

                // Combining both lists together

                let collectiveData = [];
                for(let i=0; i < filteredHits.length; i++){
                    collectiveData.push([filteredGroupName[i], filteredHits[i], filteredDesc[i]]);
                }

                // Sorting the list in descending order of hits so that the group with most hits is at the start of the list

                collectiveData = new List(collectiveData);
                collectiveData.sortInnerListDesc(1);

                // Limiting the yield to a maximum of fifteen values

                collectiveData.removeRange(15, collectiveData.length);

                // Removing hit number as a part of the data to be sent
                console.log(collectiveData);
                for (let i=0; i < collectiveData.array.length; i++){
                    collectiveData.array[i] = [collectiveData.array[i][0], collectiveData.array[i][2]];
                }

                res.json({ data: collectiveData.array });
            }
        })
    }
})

router.post("/check-public", async (req, res) => {
    if (auth.isLoggedIn(req, process.env.SECRET)){
        const groupData = await Group.findOne({ name: req.body.name });
        const isPublic = groupData.public;
        res.json({ public: isPublic });
    } else{
        res.json({ success: false });
    }
})

router.post("/check-group-password", async (req, res) => {
    if (auth.isLoggedIn(req, process.env.SECRET)){
        const groupData = await Group.findOne({ name: req.body.name });
        const check = await bcrypt.compare(req.body.password, groupData.password);
        res.json({ check });
    } else{
        res.json({ success: false });
    }
})

// Authentication routes

router.post("/register", async (req, res) => {
    const register = await auth.register(User, req.body.username, req.body.password);
    if (register.success){
        res.json({ success: true });
    } else{
        res.json({ success: false, msg: register.msg });
    }
})

router.post("/login", async (req, res) => {
    const login = await auth.login(res, User, process.env.SECRET, req.body.username, req.body.password);
    if (login.success){
        res.json({ success: true });
    } else{
        res.json({ success: false, msg: login.msg });
    }
})

router.post("/logout", (req, res) => {
    auth.logout(res);
    res.json({ success: true });
})

router.post("/check-auth", (req, res) => {
    const isLoggedIn = auth.isLoggedIn(req, process.env.SECRET);
    res.json({ state: isLoggedIn });
})

router.post("/get-username", (req, res) => {
    if (auth.isLoggedIn(req, process.env.SECRET)){
        const username = auth.getUsername(req, "username", process.env.SECRET);
        res.json({ username });
    } else{
        res.json({ username: null });
    }
})

server.listen(3001, () => console.log("Socket running at port 3001"));

module.exports = router;