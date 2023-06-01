const PostModel = require("../models/PostModel");
const fs = require("fs");
const path = require("path");
const userModel = require("../models/userModel");
const io = require("../socket");

// let posts = [
//   {
//     _id: 1,
//     title: "Chilling..",
//     content: "Drinking and parting on beach",
//     imageUrl: "none",
//     creator: { name: "Lupin" },
//     date: new Date(),
//   },
//   {
//     _id: 2,
//     title: "Bored..",
//     content: "Nothing to do this weekend",
//     imageUrl: "none",
//     creator: { name: "Walter white" },
//     date: new Date(),
//   },
// ];

exports.getPost = (req, res, next) => {
  // PostModel.find().then((data) => {
  //   res.status(200).json({
  //     posts: data,
  //   });
  // });

  const currentPage = req.query.page || 1;
  const perPage = 2;
  let totalItems;
  PostModel.find()
    .countDocuments()
    .then((total) => {
      totalItems = total;
      return PostModel.find()
        .populate("creator")
        .sort({ createdAt: -1 })
        .skip((currentPage - 1) * perPage)
        .limit(perPage);
    })
    .then((data) => {
      userModel.findById(req.userId).then((user) => {
        const posts = data.map((item) => {
          let liked = false;
          if (user.likedPosts.includes(item._id)) {
            liked = true;
          }
          return { ...item._doc, liked: liked };
        });
        res.status(200).json({
          posts: posts,
          totalItems: totalItems,
        });
      });

      // const posts = data.map((item) => {
      //   let liked = false;
      //   userModel.findById(req.userId).then((user) => {
      //     if (user.likedPosts.includes(item._id)) liked = true;
      //     console.log(user.likedPosts.includes(item._id));
      //   });
      //   return { ...item._doc, liked: liked };
      // });
    });
};

exports.requestedPost = (req, res, next) => {
  let { title, content, imageUrl } = req.body;
  let creator;
  // posts = [
  //   ...posts,
  //   {
  //     _id: posts.length + 1,
  //     title: title,
  //     content: content,
  //     imageUrl: imageUrl,
  //     creator: { name: "None" },
  //   },
  // ];
  if (req.file) imageUrl = req.file.path;
  else imageUrl = null;
  const post = new PostModel({
    title: title,
    content: content,
    imageUrl: imageUrl,
    creator: req.userId,
  });

  post
    .save()
    .then((data) => {
      return userModel
        .findById(req.userId)
        .then((user) => {
          creator = user;
          user.posts.push(post);
          return user.save();
        })
        .then(() => {
          io.getIO().emit("post", {
            action: "create",
            post: {
              ...post._doc,
              creator: { _id: req.userId, name: creator.name },
            },
          });
          res.status(200).json({
            message: "Post created successfully",
            post: post,
            creator: { _id: creator._id, name: creator.name },
          });
        });
    })
    .catch((err) => console.log(err));
};

exports.updatePost = (req, res, next) => {
  const id = req.params.id;
  const { title, content } = req.body;
  let imageUrl = req.body.imageUrl;

  PostModel.findById(id)
    .populate("creator")
    .then((post) => {
      if (post.creator._id.toString() !== req.userId) {
        throw new Error("Unauthorized user");
      }
      if (req.file) {
        imageUrl = req.file.path;
      } else {
        imageUrl = post.imageUrl;
      }
      if (imageUrl !== post.imageUrl) {
        clearImage(post.imageUrl);
      }
      if (title) post.title = title;
      post.imageUrl = imageUrl;
      post.content = content;
      return post.save();
    })
    .then((result) => {
      io.getIO().emit("post", { action: "update", post: result });
      res.status(200).json({ message: "post updated successfully" });
    })
    .catch((err) => {
      next(err);
    });
};

const clearImage = (filePath) => {
  filePath = path.join(__dirname, "..", filePath);
  fs.unlink(filePath, (err) => console.log(err));
};

exports.deletePost = (req, res, next) => {
  const id = req.params.id;
  PostModel.findById(id)
    .then((post) => {
      if (post.creator.toString() !== req.userId) {
        throw new Error("Unauthorized user");
      }
      if (post.imageUrl) clearImage(post.imageUrl);
      return PostModel.findByIdAndRemove(id);
    })
    .then(() => {
      return userModel.findById(req.userId);
    })
    .then((user) => {
      user.posts.pull(id);
      return user.save();
    })
    .then(() => {
      io.getIO().emit("post", { action: "delete" });
      res.status(200).json({ message: "Post deleted successfully" });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.likePost = (req, res, next) => {
  const liked = req.body.liked;
  const id = req.params.id;
  PostModel.findById(id).then((post) => {
    if (liked) post.likes -= 1;
    else post.likes += 1;
    post.save();
  });

  userModel
    .findById(req.userId)
    .then((user) => {
      if (liked) {
        user.likedPosts.splice(user.likedPosts.indexOf(id), 1);
      } else {
        user.likedPosts.push(id);
      }
      return user.save();
    })
    .then(() => {
      res.status(200).json({ message: "post liked" });
    });
};
