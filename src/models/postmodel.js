const mongoose = require("mongoose");
const postSchema = new mongoose.Schema(
    {

        name: {
            type: String,
            required: true,
            trim: true,
          },

            email: {
            type: String,
            required: true,
            trim: true,
          },
          password: {
            type: String,
            required: true,
            trim: true,
          },

          followers: {
            type: mongoose.Schema.Types.ObjectId,
             ref: "user"
          },

          followings: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user"
         }
    }
)

module.exports = mongoose.model("posts", postSchema);