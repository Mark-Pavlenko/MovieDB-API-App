const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const userSchema = mongoose.Schema({
    userId:{
        type: String,
    },
    name: {
        type: String,
        required: [true, "Please Include your name"]
    },
    surname: {
        type: String,
        required: [true, "Please Include your surname"]
    },
    email: {
        type: String,
        required: [true, "Please Include your email"]
    },
    password: {
        type: String,
        required: [true, "Please Include your password"]
    },
    favouriteFilms: [
        {
            film: {
                type: String
            }
        }
    ],
    ratingFilms: [
        {
            filmId: {
                type: String
            },
            filmRating: {
                type: String
            }
        }
    ],
    tokens: [
        {
            token: {
                type: String,
                required: true
            }
        }
    ]
});

userSchema.pre("save", async function (next) {
    // Hash the password before saving the user model
    const user = this;
    // if (user.isModified("password")) {
    //   user.password = await bcrypt.hash(user.password, 8);
    // }
    next();
});

//this function generates an auth token for the user
userSchema.methods.generateAuthToken = async function () {
    const user = this;
    const token = jwt.sign(
        {
            userId: user.userId,
            _id: user._id,
            name: user.name,
            surname: user.surname,
            email: user.email,
            favouriteFilms: user.favouriteFilms,
            ratingFilms: user.ratingFilms
        },
        "secret"
    );
    user.tokens = user.tokens.concat({token});
    await user.save();
    return token;

    console.log(token);
};

//this method search for a user by email and password.
userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({email});
    console.log(user);
    if (!user) {
        throw new Error({error: "Invalid login details"});
    }
    // const isPasswordMatch = await bcrypt.compare(password, user.password);
    // if (!isPasswordMatch) {
    //   throw new Error({ error: "Invalid login details" });
    // }
    return user;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
