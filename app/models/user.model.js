const mongoose = require("mongoose");

const User = mongoose.model(
    "User",
    new mongoose.Schema({
        username:{type:String, required: [true,'required username'],unique: true},
        password: {type:String,required:[true,'password is required']},
        passwordConfirm:{type:String, required:[true,'confirm password is required']},
        roles: [
            {
              type: mongoose.Schema.Types.ObjectId,
              ref: "Role",
             
            },
         
             ]
             ,
       
        email: {type:String, unique:true, required:[true,'email is required']},
        phone:{type:String, required:[true, 'required phone number'],  validate: {
          validator: function(v) {
            return /\d{11}/.test(v);
          },
          message: '{VALUE} is not a valid phone number!'
        
      
        }
      },
      accessToken: {type:String},


    })

);
module.exports =User