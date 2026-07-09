const Tweet = require("../models/tweetSchema");
const User = require("../models/userSchema");
const TweetUser = require("../models/userSchema");
;

// ==========================
// Create Tweet
// ==========================
exports.createTweet = async (req, res) => {
  try {
  const { description, image } = req.body;


    if (!description) {
      return res.status(400).json({ message: "Description is required" });
    }

    
const tweet = await Tweet.create({
  userId: req.user.id,   // 🔥 from JWT token
  description,
  image: image || ""
});

    res.status(201).json({
      message: "Tweet created successfully",
      tweet,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// BookMark 
exports.toggleBookmarkTweet = async (req, res) => {
  try {

    const userId = req.user.id;

    const tweet = await Tweet.findById(req.params.id);

    if (!tweet) {
      return res.status(404).json({
        message: "Tweet not found"
      });
    }

    // Safety
    if (!Array.isArray(tweet.bookmarks)) {
      tweet.bookmarks = [];
    }

    const alreadyBookmarked = tweet.bookmarks.some(
      (id) => id.toString() === userId
    );

    // Remove bookmark
    if (alreadyBookmarked) {

      tweet.bookmarks = tweet.bookmarks.filter(
        (id) => id.toString() !== userId
      );

      await tweet.save();

      return res.status(200).json({
        message: "Bookmark removed",
        bookmarksCount: tweet.bookmarks.length
      });
    }

    // Add bookmark
    tweet.bookmarks.push(userId);

    await tweet.save();

    res.status(200).json({
      message: "Tweet bookmarked successfully",
      bookmarksCount: tweet.bookmarks.length
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

// ==========================
// Get All Tweets
// ==========================


// exports.getAllTweets = async (req, res) => {
//   try {
//     const currentUserId = req.user.id;

//     const currentUser = await User.findById(currentUserId);

//     if (!currentUser) {
//       return res.status(404).json({
//         message: "User not found"
//       });
//     }

//     // Apni ID + Following users ki IDs
//     const usersIds = [
//       currentUserId,
//       ...currentUser.following
//     ];

//     const tweets = await Tweet.find({
//       userId: { $in: usersIds }
//     })
//       .populate(
//         "userId",
//         "fullname username email followers following"
//       )
//       .sort({ createdAt: -1 });

//     return res.status(200).json({
//       success: true,
//       totalTweets: tweets.length,
//       tweets
//     });

//   } catch (error) {
//     console.log(error);

//     return res.status(500).json({
//       message: error.message
//     });
//   }
// };
// comment 
exports.addComment = async (req, res) => {
  try {

    const tweet = await Tweet.findById(req.params.id);

    if (!tweet) {
      return res.status(404).json({
        message: "Tweet not found"
      });
    }

    if (!Array.isArray(tweet.comments)) {
      tweet.comments = [];
    }

    const comment = {
      userId: req.user.id,
      text: req.body.text
    };

    tweet.comments.push(comment);

    await tweet.save();

    res.status(200).json({
      message: "Comment added successfully",
      comments: tweet.comments
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};
// Repost
exports.repostTweet = async (req, res) => {
  try {
    const userId = req.user.id;

    const tweet = await Tweet.findById(req.params.id);

    if (!tweet) {
      return res.status(404).json({ message: "Tweet not found" });
    }

    const alreadyReposted = tweet.reposts.includes(userId);

    if (alreadyReposted) {
      // ❌ Undo Repost
      tweet.reposts = tweet.reposts.filter(
        (id) => id.toString() !== userId
      );

      await tweet.save();

      return res.status(200).json({
        message: "Repost removed",
        repostsCount: tweet.reposts.length
      });
    }

    // ✅ Repost
    tweet.reposts.push(userId);

    await tweet.save();

    res.status(200).json({
      message: "Reposted successfully",
      repostsCount: tweet.reposts.length
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ==========================
// Get Single Tweet
// ==========================
exports.getTweetById = async (req, res) => {
  try {
    const tweet = await Tweet.findById(req.params.id).populate(
      "userId",
      "name email"
    );

    if (!tweet) {
      return res.status(404).json({ message: "Tweet not found" });
    }

    res.status(200).json(tweet);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ==========================
// Like / Unlike Tweet
// ==========================
exports.toggleLikeTweet = async (req, res) => {
  try {
    const { userId } = req.body;

    const tweet = await Tweet.findById(req.params.id);

    if (!tweet) {
      return res.status(404).json({ message: "Tweet not found" });
    }

    const alreadyLiked = tweet.likes.includes(userId);

    if (alreadyLiked) {
      tweet.likes = tweet.likes.filter(
        (id) => id.toString() !== userId
      );
    } else {
      tweet.likes.push(userId);
    }

    await tweet.save();

    res.status(200).json({
      message: alreadyLiked ? "Unliked" : "Liked",
      likesCount: tweet.likes.length,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ==========================
// Delete Tweet
// ==========================
exports.deleteTweet = async (req, res) => {
  try {
    const tweet = await Tweet.findById(req.params.id);

    if (!tweet) {
      return res.status(404).json({ message: "Tweet not found" });
    }

    await tweet.deleteOne();

    res.status(200).json({ message: "Tweet deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ==========================
// Increase Impressions
// ==========================
exports.addImpression = async (req, res) => {
  try {
    const tweet = await Tweet.findById(req.params.id);

    if (!tweet) {
      return res.status(404).json({ message: "Tweet not found" });
    }

    tweet.impressions += 1;
    await tweet.save();

    res.status(200).json({
      message: "Impression added",
      impressions: tweet.impressions,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// ==========================
// Get Other Users
// ==========================

exports.getOtherUsers = async (req, res) => {
  try {

    // Logged in user id
    const currentUserId = req.user.id;

    // Get all users except logged in user
    const users = await User.find({
      _id: { $ne: currentUserId }
    }).select("-password");

    res.status(200).json({
      message: "Other users fetched successfully",
      users
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};
// const User = require("../models/userSchema");

// ==========================
// FOLLOW / UNFOLLOW USER
// ==========================



// const User = require("../models/userSchema");

// FOLLOW / UNFOLLOW USER
exports.followUser = async (req, res) => {
  try {
    const loggedInUserId = req.user.id;
    const userId = req.params.id;

    // Self follow prevent
    if (loggedInUserId === userId) {
      return res.status(400).json({
        message: "You cannot follow yourself"
      });
    }

    // Find users
    const loggedInUser = await User.findById(loggedInUserId);
    const user = await User.findById(userId);

    if (!loggedInUser || !user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    // Safety
    if (!Array.isArray(loggedInUser.following)) {
      loggedInUser.following = [];
    }

    if (!Array.isArray(user.followers)) {
      user.followers = [];
    }

    // Check if already following
    const isFollowing = loggedInUser.following.some(
      (id) => id.toString() === userId
    );

    // =====================
    // UNFOLLOW
    // =====================
    if (isFollowing) {
      loggedInUser.following = loggedInUser.following.filter(
        (id) => id.toString() !== userId
      );

      user.followers = user.followers.filter(
        (id) => id.toString() !== loggedInUserId
      );

      await loggedInUser.save();
      await user.save();

      return res.status(200).json({
        message: "Unfollowed successfully",
        followingCount: loggedInUser.following.length,
        followersCount: user.followers.length,
        success: true
      });
    }

    // =====================
    // FOLLOW
    // =====================
    loggedInUser.following.push(userId);
    user.followers.push(loggedInUserId);

    await loggedInUser.save();
    await user.save();

    return res.status(200).json({
      message: `${loggedInUser.username} just followed ${user.username}`,
      followingCount: loggedInUser.following.length,
      followersCount: user.followers.length,
      success: true
    });

  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: error.message
    });
  }
};

exports.getAllTweets = async (req, res) => {
  try {

    const loggedInUser = await User.findById(req.user.id);

    const tweets = await Tweet.find({
      userId: {
        $in: [
          req.user.id,
          ...loggedInUser.following
        ]
      }
    })
    .populate("userId", "fullname username")
    .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      tweets
    });

  } catch (error) {

    return res.status(500).json({
      message: error.message
    });
  }
};
exports.getFollowingTweets = async (req, res) => {
  try {

    const loggedInUser = await User.findById(req.user.id);

    const tweets = await Tweet.find({
      userId: { $in: loggedInUser.following }
    })
    .populate("userId", "fullname username")
    .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      tweets
    });

  } catch (error) {
    return res.status(500).json({
      message: error.message
    });
  }
};