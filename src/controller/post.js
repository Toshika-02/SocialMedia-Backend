const express = require('express');

const  authmodel = require('../models/authmodel');
const  postmodel = require('../models/postmodel');
const  userPostmodel = require('../models/userPostmodel');


//========================Follow user=========================================
const followUser = async (req, res) => {
  const { id } = req.params;
  const userId = req.body.userId

  try {
    
    const userToFollow = await authmodel.findById(id);
    if (!userToFollow) {
      return res.status(404).json({ message: 'User not found' });
    }

    const alreadyFollowed = userToFollow.followers.includes(userId);
    if (alreadyFollowed) {
      return res.status(400).json({ message: 'User is already followed' });
    }

    userToFollow.followers.push(userId);
    await userToFollow.save();

    const currentUser = await authmodel.findById(userId);
    currentUser.followings.push(userToFollow._id);
    await currentUser.save();

    res.status(200).json({ message: 'User followed successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


//=====================Unfollow user================================================

const UnfollowUser = async (req, res) =>{
  const { id } = req.params;
  const userId = req.body.userId;

  try {
    
    const userToUnfollow = await authmodel.findById(id);
    if (!userToUnfollow) {
      return res.status(404).json({ message: 'User not found' });
    }

    const alreadyUnfollowed = !userToUnfollow.followers.includes(userId);
    if (alreadyUnfollowed) {
      return res.status(400).json({ message: 'User is already unfollowed' });
    }

    userToUnfollow.followers.pull(userId);
    await userToUnfollow.save();

    // Remove the user from the current user's followings
    const currentUser = await authmodel.findById(userId);
    currentUser.followings.pull(userToUnfollow._id);
    await currentUser.save();

    res.status(200).json({ message: 'User unfollowed successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


//=======================Get user profile===================================

const getUserProfile = async (req, res) => {
  try {
    const user = await authmodel.findById(req.params.id);
    res.json({
      name: user.name,
      followers: user.followers.length,
      followings: user.followings.length
    });
  } catch (err) {
    res.status(500).json(err);
  }
};

//===============Create a post======================

  const createPost = async (req, res) => {
    const { title, description } = req.body;
    const author = req.userId;
    try {
      const post = await postmodel.create({
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
      const post = await postmodel.findById(req.params.id);
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



module.exports = { followUser, UnfollowUser, getUserProfile, createPost,deletePost }
  
  