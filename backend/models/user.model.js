import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Please enter your name"]
        },
        addr: { 
            type: String,
            required: [true, "Please enter your address"]
        },
        email: {
            type: String,
            required: [true, "Please enter your email address"],
            unique: true
        },
        contact: {
            type: String,  
            required: [true, "Please enter your contact number"]
        },        
        password: {
            type: String,
            required: [true, "Please enter your password"]
        }
    },
    {
        timestamps: true
    }
);

const User = mongoose.model("User", UserSchema);

export default User;
