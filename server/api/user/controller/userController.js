const User = require("../model/User");

exports.registerNewUser = async (req, res) => {
    try {
        let isUser = await User.find({email: req.body.email});
        console.log(isUser);
        if (isUser.length >= 1) {
            return res.status(409).json({
                message: "email already in use"
            });
        }
        const user = new User({
            name: req.body.name,
            surname: req.body.surname,
            email: req.body.email,
            password: req.body.password
        });
        let data = await user.save();
        const token = await user.generateAuthToken(); // here it is calling the method that we created in the model
        res.status(201).json({data, token});
    } catch (err) {
        res.status(400).json({err: err});
    }
};
exports.loginUser = async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;
        const user = await User.findByCredentials(email, password);
        if (!user) {
            return res
                .status(401)
                .json({error: "Login failed! Check authentication credentials"});
        }
        const token = await user.generateAuthToken();
        res.status(201).json({user, token});
    } catch (err) {
        res.status(400).json({err: err});
    }
};

//controller to add favourite film
exports.addFavouriteFilm = async (req, res) => {
    try {
        let isFilm = await User.findOne({_id: req.body.id});
        isFilm.favouriteFilms.push({film: req.body.favouriteFilms})
        const updatedUser = await isFilm.save();
        res.json(updatedUser);
    } catch (err) {
        res.status(400).json({err: err});
    }
};

//controller to remove all favourite films ???
exports.removeFavouriteFilm = async (req, res) => {
    try {
        let isFilm = await User.findOne({_id: req.body.id});
        isFilm.favouriteFilms.splice({film: req.body.favouriteFilms})
        const updatedUser = await isFilm.save();
        res.json(updatedUser);
    } catch (err) {
        res.status(400).json({err: err});
    }
};

//get user details
exports.getUserDetails = async (req, res) => {
    await res.json(req.userData);
};
