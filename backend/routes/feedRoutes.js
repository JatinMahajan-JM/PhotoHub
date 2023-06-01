const express = require("express");
const isAuth = require("../middleware/is-auth");
const {
  getPost,
  requestedPost,
  updatePost,
  deletePost,
  likePost,
} = require("../controllers/feedController");
const router = express.Router();

router.get("/post", isAuth, getPost);
router.post("/post", isAuth, requestedPost);
router.put("/post/:id", isAuth, updatePost);
router.delete("/post/:id", isAuth, deletePost);
router.put("/post/like/:id", isAuth, likePost);

module.exports = router;
