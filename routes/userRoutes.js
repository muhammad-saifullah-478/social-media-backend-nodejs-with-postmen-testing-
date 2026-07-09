const express = require("express");
const router = express.Router();

const {
  registerUser,
  loginUser,
  getUserProfile,
  logoutUser
} = require("../controllers/userController");

const tweetController = require("../controllers/tweetController");
// const followUnfollowUser =require("../controllers/tweetController")
const isAuth = require("../config/auth");

// USER
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.get("/others", isAuth,tweetController.getOtherUsers);

router.get("/profile/:id", isAuth, getUserProfile);

// TWEETS
router.post("/create", isAuth, tweetController.createTweet);
router.get("/", isAuth, tweetController.getAllTweets);
router.get("/following-tweets", isAuth, tweetController.getFollowingTweets);
router.get("/:id", isAuth, tweetController.getTweetById);
router.put("/like/:id", isAuth, tweetController.toggleLikeTweet);
router.delete("/:id", isAuth, tweetController.deleteTweet);
router.put("/impression/:id", isAuth, tweetController.addImpression);
router.post("/comment/:id", isAuth, tweetController.addComment);
router.put("/repost/:id", isAuth, tweetController.repostTweet);
router.put("/bookmark/:id", isAuth, tweetController.toggleBookmarkTweet);
router.put("/follow/:id", isAuth, tweetController.followUser);
module.exports = router;