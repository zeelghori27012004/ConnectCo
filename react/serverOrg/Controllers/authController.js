import User from "../Schema/User.js";
import bcrypt from 'bcryptjs';
import { formatDatatoSend, generateUsername } from "../Services/authService.js";
import { getAuth } from "firebase-admin/auth";

import aws from 'aws-sdk';

// admin.initializeApp({
//     credential: admin.credential.cert(serviceAccountKey)
// })

const s3 = new aws.S3({
    region: 'ap-south-1',
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
})


//import { getAuth } from "firebase-admin/auth";



// const formatDatatoSend = (user) => {
//     const access_token = jwt.sign({ id: user._id }, process.env.SECRET_ACCESS_KEY)

//     return {
//         access_token,
//         profile_img: user.personal_info.profile_img,
//         username: user.personal_info.username,
//         fullname: user.personal_info.fullname
//     }
// }
let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; // regex for email
let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/; // regex for password

export const signin = async (req, res) => {
    let { email, password } = req.body;
    User.findOne({ "personal_info.email": email })
        .then((user) => {
            if (!user) {
                return res.status(403).json({ "error": "Email not found" })
            }

            if (!user.google_auth) {
                bcrypt.compare(password, user.personal_info.password, (err, result) => {

                    if (err) {
                        return res.status(403).json({ "error": "Error occured while login please try again" });
                    }

                    if (!result) {
                        return res.status(403).json({ "error": "Incorrect password" })
                    } else {
                        return res.status(200).json(formatDatatoSend(user))
                    }

                })
            }
            else {
                return res.status(403).json({ "error": "Account was created using google.Try logging in with google." })
            }

        })
        .catch(err => {
            console.log(err.message);
            return res.status(500).json({ "error": err.message })
        })
};


export const signup = async (req, res) => {

    console.log(req.body);
    let { fullname, email, password } = req.body;

    if (fullname.length < 3) {
        return res.status(403).json({ "error": "Fullname must be atleast 3 letters long" })
    }
    if (!email.length) {
        return res.status(403).json({ "error": "Enter Email" })
    }
    if (!emailRegex.test(email)) {
        return res.status(403).json({ "error": "Email is invalid" })
    }
    if (!passwordRegex.test(password)) {
        return res.status(403).json({ "error": "Password should be 6 to 20 characters long with a numeric, 1 lowercase and 1 uppercase letter" })
    }
    bcrypt.hash(password, 10, async (err, hashed_password) => {
        let username = await generateUsername(email);
        let user = new User({
            personal_info: { fullname, email, password: hashed_password, username }
        })
        user.save().then((u) => {
            return res.status(200).json(formatDatatoSend(u))
        })
            .catch(err => {
                if (err.code == 11000) {
                    return res.status(500).json({ "error": "Email already exists - " + err.message });
                }
                return res.status(500).json({ "error": err.message })
            })
    })
    //return res.status(200).json({"status": "Loggend In"})
};

// export const google_auth = async (req, res) => {

//     let { access_token } = req.body;

//     getAuth()
//         .verifyIdToken(access_token)
//         .then(async (decodedUser) => {

//             let { email, name, picture } = decodedUser;

//             picture = picture.replace("s96-c", "s384-c");

//             let user = await User.findOne({ "personal_info.email": email }).select("personal_info.fullname personal_info.username personal_info.profile_img google_auth").then((u) => {
//                 return u || null
//             })
//                 .catch(err => {
//                     return res.status(500).json({ "error": err.message })
//                 })

//             if (user) { // login
//                 if (!user.google_auth) {
//                     return res.status(403).json({ "error": "This email was signed up without google. Please log in with password to access the account" })
//                 }
//             }
//             else { // sign up

//                 let username = await generateUsername(email);

//                 user = new User({
//                     personal_info: { fullname: name, email, username },
//                     google_auth: true
//                 })

//                 await user.save().then((u) => {
//                     user = u;
//                 })
//                     .catch(err => {
//                         return res.status(500).json({ "error": err.message })
//                     })

//             }

//             return res.status(200).json(formatDatatoSend(user))

//         })
//         .catch(err => {
//             return res.status(500).json({ "error": "Failed to authenticate you with google. Try with some other google account" })
//         })

// };