const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const app = express();
const PORT = 4000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

// mongoose connect
mongoose
    .connect("mongodb+srv://say_01:say_01@cluster0.4xvpm14.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
    .then(() => console.log("MongoDB connected..."))
    .catch((err) => console.log(err));

// mongoose set
const { Schema } = mongoose;

// User Schema
const UserSchema = new Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});

// Post Schema
const PostSchema = new Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    date: { type: Date, default: Date.now }
});

// User Model
const User = mongoose.model("User", UserSchema);

// Post Model
const Post = mongoose.model("Post", PostSchema);

// Register endpoint
app.post("/api/register", async (req, res) => {
    const { email, password, username } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return res.json({ error_message: "User already exists" });
    }

    // Create new user
    const newUser = new User({
        email,
        password,
        username,
    });

    try {
        await newUser.save();
        res.json({ message: "Account created successfully!" });
    } catch (error) {
        res.status(500).json({ error_message: "Failed to create account" });
    }
});

// Login endpoint
app.post("/api/login", async (req, res) => {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email, password });
    if (!user) {
        return res.json({ error_message: "Incorrect credentials" });
    }

    res.json({
        message: "Login successfully",
        id: user._id,
    });
});

// 게시글 생성 엔드포인트
app.post("/api/posts", async (req, res) => {
    const { title, content } = req.body;
    const newPost = new Post({
        title,
        content
    });

    try {
        await newPost.save();
        res.json({ message: "Post created successfully!" });
    } catch (error) {
        res.status(500).json({ error_message: "Failed to create post" });
    }
});

// 게시글 목록 가져오기 엔드포인트
app.get("/api/posts", async (req, res) => {
    const posts = await Post.find();
    res.json(posts);
});

// 특정 게시글 가져오기 엔드포인트
app.get("/api/posts/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const post = await Post.findById(id);
        if (!post) {
            return res.status(404).json({ error_message: "Post not found" });
        }
        res.json(post);
    } catch (error) {
        res.status(500).json({ error_message: "Failed to retrieve post" });
    }
});

// 기존 스레드 관련 엔드포인트 수정 필요

app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});
