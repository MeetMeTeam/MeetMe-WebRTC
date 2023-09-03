const User = require("../../models/user");
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken")

const postRegister = async (req,res) => {
    try {
        const { username , mail , password} = req.body;

        // check if user exists
        const userExists = await User.exists({mail});

        if (userExists) {
            return res.status(409).send("email already in user.")
        }

        // encrypt password
        const encryptedPassword = await bcrypt.hash(password, 10)

        //create user document and save in database
        const user = await User.create({
            username,
            mail: mail.toLowerCase(),
            password: encryptedPassword
        })

        //create jwt token
        const token = jwt.sign(
            {
                userId: user._id,
                mail
            },
            
            process.env.TOKEN_KEY,
            {
                expiresIn: '24h'
            }
        )
        
        res.status(201).json({
            userDetails: {
                mail: user.mail ,
                token: token,
                username : user.username,

            }
        })

    } catch (err) {
        return res.status(500).send('error . pls try again' + err)
    }
}


module.exports = postRegister