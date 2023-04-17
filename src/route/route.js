const express = require("express");

const router = express.Router();
const auth = require("../controller/auth");
const post = require("../controller/post");
const userPost = require("../controller/userPost");

router.post("/register", auth.createUser);
router.post("/api/authenticate", auth.userLogin);
router.post("/api/follow/:id",  post.followUser)
router.post("/api/unfollow/:id",  post.UnfollowUser)
router.get("/api/user/:id", post.getUserProfile)
router.post("/api/posts", userPost.createPost)
router.delete("/api/posts/:id", userPost.deletePost)
router.post("/api/like/:id", userPost.likePost)
router.post("/api/unlike/:id", userPost.unlikePost)
router.post("/api/comment/:id", userPost.addComment)
router.get("/api/posts/:id", userPost.getOne)
router.get("/api/all_posts", userPost.getallPost)

module.exports = router;