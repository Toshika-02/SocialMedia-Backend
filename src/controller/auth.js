const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const Usermodel = require('../models/authmodel.js');

let isValid = function (value) {
    if (typeof value === "undefined" || value === "null") return false;
    if (typeof value === "string" && value.trim().length === 0) return false;
    return true;
  };

//=====================================create user===========================
let createUser = async function (req, res) {
    try {
      let requestBody = req.body;               //getting data from request body
      let {  name, email, password,} = requestBody; //Destructuring data coming from request body

      
      if (!isValid(name)) {
        return res.status(400).send({
          status: false,
          message: "Please provide a Name or a Valid Name",
        });
      }
  
      if (!isValid(email)) {
        return res.status(400).send({
          status: false,
          message: "Please provide a Email d or a Valid Email Id",
        });
      }

      if (!isValid(password)) {
        return res.status(400).send({
          status: false,
          message: "Please provide a password",
        });
      }
  
      let isAllreadyExistEmail = await Usermodel.findOne({ email: email });
      if (isAllreadyExistEmail) {
        return res.status(400).send({
          status: false,
          message: `this email id -${email} already exist`,
        });
      }
  
       //validation ended here

      let createUser = await Usermodel.create(requestBody);
      return res
        .status(201)
        .send({ status: true, message: "User Created", data: createUser }); //sending data in response
    } catch (error) {
      return res.status(500).send({ status: false, message: error.message });
    }
  };



//========================================== Authenticate user==========================
let userLogin = async function (req, res) {
  try {
    let requestBody = req.body;                      
    let { email, password } = requestBody;              
    
    //here performing validation for data
    if (!isValid(email)) {
      return res
        .status(400)
        .send({ status: false, message: `Email is required` });
    }


    if (!isValid(password)) {
      return res
        .status(400)
        .send({ status: false, message: `Password is required` });
    }
    let user = await Usermodel.findOne({ email: email, password: password });
    if (!user)
      return res.status(400).send({
        status: false,
        message: "Invalid Email or Password",
      });

    let token = jwt.sign(
      {
        userId: user._id.toString(),
        iat: Date.now() / 1000, 
      },
        "Backend assignment",
      
      {
        expiresIn: Math.floor(Date.now() / 1000) + 10 * 60 * 60,
      }
    );

    res.setHeader("x-api-key", token);

    return res.status(200).send({
      status: true,
      data: token,
      message: "User Logged in Successfully",
    }); 
  } catch (error) {
    res.status(500).send({ status: false, error: error.message });
  }
};


module.exports = { userLogin, createUser};