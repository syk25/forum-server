//👇🏻index.js
const express = require("express");
const cors = require("cors");
const app = express();
const PORT = 4000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

/* 회원가입 db, id 생성기 */
const users = []; // 모든 사용자를 보관하기 위한 배열 db
const generateID = () => Math.random().toString(36).substring(2, 10); // id로 쓰일 예정

/* 회원가입 API */
app.post("/api/register", async (req, res) => {
	const { email, password, username } = req.body;
	const id = generateID();
	// 회원가입 시 동일인인지 유효성 검사
	const result = users.filter(
		(user) => user.email === email && user.password === password
	);
	//👇🏻 if true
	if (result.length === 0) {
		const newUser = { id, email, password, username };
		//👇🏻 adds the user to the database (array)
		users.push(newUser);
		//👇🏻 returns a success message
		return res.json({
			message: "Account created successfully!",
		});
	}
	//👇🏻 if there is an existing user
	res.json({
		error_message: "User already exists",
	});
});

/* api test */
app.get("/api", (req, res) => {
	res.json({
		message: "Hello world",
		도연: "그게 아니라! 근데!",
		우정: "에바지예",
		소미: "엽엽",
		상욱: "미정",
		세연: "허허",
		연준: "으악",
	});
});

/* 로그인 기능 구현 */
app.post("/api/login", (req, res) => {
	const { email, password } = req.body;
	//👇🏻 checks if the user exists
	let result = users.filter(
		(user) => user.email === email && user.password === password
	);
	//👇🏻 if the user doesn't exist
	if (result.length !== 1) {
		return res.json({
			error_message: "Incorrect credentials",
		});
	}
	//👇🏻 Returns the id if successfuly logged in
	res.json({
		message: "Login successfully",
		id: result[0].id,
	});
});

/* 스레드 생성 route */
app.post("/api/create/thread", async (req, res) => {
	const { thread, userId } = req.body;
	const threadId = generateID();

	console.log({ thread, userId, threadId });
});

//👇🏻 생성 된 포스트 저장
const threadList = [];

/* 스레드 생성 경로 */
app.post("/api/create/thread", async (req, res) => {
	const { thread, userId } = req.body;
	const threadId = generateID();

	//👇🏻 add post details to the array
	threadList.unshift({
		id: threadId,
		title: thread,
		userId,
		replies: [],
		likes: [],
	});

	//👇🏻 Returns a response containing the posts
	res.json({
		message: "Thread created successfully!",
		threads: threadList,
	});
});

/* 스레드 리스트 반환 */
app.get("/api/all/threads", (req, res) => {
    res.json({
        threads: threadList,
    });
});

/* 좋아요 함수 */
app.post("/api/thread/like", (req, res) => {
    //post id 와 user id 확인
    const { threadId, userId } = req.body;
    // 반응을 받은 스레드 확인
    const result = threadList.filter((thread) => thread.id === threadId);
    // 좋아요 수 확인
    const threadLikes = result[0].likes;
    // 반응 인가
    const authenticateReaction = threadLikes.filter((user) => user === userId);
    // 사용자들을 좋아요 배열에 담기
    if (authenticateReaction.length === 0) {
        threadLikes.push(userId);
        return res.json({
            message: "You've reacted to the post!",
        });
    }
    // 에러 유저에게 반환
    res.json({
        error_message: "You can only react once!",
    });
});

app.listen(PORT, () => {
	console.log(`Server listening on ${PORT}`);
});
