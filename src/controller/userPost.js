const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const  userPostmodel = require('../models/userPostmodel');
const postmodel = require('../models/postmodel');
const commentmodel = require('../models/commentmodel');
const authmodel = require('../models/authmodel');



//===============Create a post======================

const createPost = async (req, res) => {
    const { title, description } = req.body;
    const author = req.body.userId;
    try {
      const post = await userPostmodel.create({
        title, 
        description,
        author,
        createdAt: new Date(),
      });
      res.json({
        id: post._id,
        title: post.title,
        description: post.description,
        createdAt: post.createdAt
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server Error' });
    }
  };


  //==================Delete post===========================

  const deletePost = async (req, res) => {
    try {
      const post = await userPostmodel.findById(req.params.id);
      if (post.userId === req.body.userId) {
        await post.deleteOne();
        res.status(200).json("the post has been deleted");
      } else {
        res.status(403).json("you can delete only your post");
      }
    } catch (err) {
      res.status(500).json(err);
    }
  };

  //===============Like post==================================

  const likePost = async (req, res) => {
    const postId = req.params.id;
    const userId = req.body.userId;
  
    try {
      const post = await userPostmodel.findById(postId);
  
      if (!post) {
        return res.status(404).json({ message: 'Post not found' });
      }
  
      if (!post.likes) {
        post.likes = [];
      }
  
      if (post.likes.includes(userId)) {
        return res.status(400).json({ message: 'Post already liked' });
      }
  
      post.likes.push(userId);
      await post.save();
  
      res.json({ message: 'Post liked successfully' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server Error' });
    }
  };

  //===============unLike post==================================

  const unlikePost = async (req, res) => {
    const postId = req.params.id;
    const userId = req.body.userId;
    try {
      const post = await userPostmodel.findById(postId);
      if (!post) {
        return res.status(404).json({ message: 'Post not found' });
      }
      if (!post.likes.includes(userId)) {
        return res.status(400).json({ message: 'You have not liked this post yet' });
      }
      post.likes = post.likes.filter((likeId) => likeId.toString() !== userId.toString());
      await post.save();
      res.json({ message: 'Post unliked successfully' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server Error' });
    }
  };


  //========================comment for post===============================

  const addComment = async (req, res) => {
    const { comment } = req.body;
    const { id: postId } = req.params;
    const userId = req.body.userId;
  
    try {
      const newComment = await commentmodel.create({
        post: postId,
        user: userId,
        comment,
      });
  
      res.status(201).json({ commentId: newComment._id });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server Error' });
    }
  };



//====================Get a single post============================

const getOne = async (req, res) =>{
   const id = Number(req.params.userId);
  const post = userPostmodel.find(post => post.id === id);

  if (!post) {
    return res.status(404).send('Post not found');
  }

  const result = {
    id: post.id,
    title: post.title,
    description: post.description,
    created_at: post.created_at,
    likes: post.likes,
    comments: post.comments
  };

  res.send(result);

};


//======================Get all post==========================================

const getallPost = async (req, res) => {
    const userId = req.body.userId;

    try {
      const posts = await userPostmodel.find({ author: userId })
        .populate('author', 'name')
        .populate('comments')
        .populate({
          path: 'likes',
          select: '_id',
        })
        .sort({ createdAt: -1 });
  
      const postsData = posts.map((post) => {
        const comments = post.comments.map((comment) => {
          return {
            id: comment._id,
            comment: comment.comment,
            createdAt: comment.createdAt,
          };
        });
  
        const likesCount = post.likes.length;
        const commentsCount = comments.length;
  
        return {
          id: post._id,
          title: post.title,
          desc: post.description,
          created_at: post.createdAt,
          author: post.author,
          comments,
          likes: likesCount,
          commentsCount,
        };
      });
  
      res.json(postsData);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error' });
    }
  };


    
  
module.exports = {createPost,deletePost, likePost, unlikePost, addComment, getOne, getallPost}
