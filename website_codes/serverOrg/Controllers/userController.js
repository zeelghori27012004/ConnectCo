import User from "../Schema/User.js";
import Blog from "../Schema/Blog.js";
import bcrypt from 'bcryptjs';



export const search_user = async(req, res) => {

    let { query } = req.body; // Extract search query from the request body

    User.find({ "personal_info.username": new RegExp(query, 'i') }) // Case-insensitive search on usernames

        .limit(50) // Restrict results to a maximum of 50 users

        .select(
            "personal_info.fullname personal_info.username personal_info.profile_img -_id"
        ) // Include only specific user details

        .then(users => res.status(200).json({ users })) // Return the matched users

        .catch(err => res.status(500).json({ error: err.message })); // Handle errors with a 500 status
};

export const get_profile = async(req, res) => {

    let { username } = req.body; // Extract username from the request body

    // Find user by username and exclude sensitive or unnecessary fields
    User.findOne({ "personal_info.username": username })

        .select("-personal_info.password -google_auth -updatedAt -blogs")

        .then(user => {
            return res.status(200).json(user); // Send user details in the response
        })

        .catch(err => {
            console.error(err); // Log error for debugging
            return res.status(500).json({ error: err.message }); // Send error response
        });
};

export const update_profile_img = async (req, res) => {

    let { url } = req.body; // Extract new profile image URL from the request body

    // Update the user's profile image based on their authenticated user ID
    User.findOneAndUpdate(
        { _id: req.user }, // Match the user by ID from the verified token
        { "personal_info.profile_img": url } // Update the profile image field
    )

        .then(() => {
            return res.status(200).json({ profile_img: url }); // Respond with the updated profile image
        })

        .catch(err => {
            return res.status(500).json({ error: err.message }); // Handle any errors
        });
};

export const update_profile = async(req, res) => {

    let { username, bio, social_links } = req.body; // Extract data from the request body

    let bioLimit = 150; // Define the bio character limit

    // Validate username length
    if (username.length < 3) {
        return res.status(403).json({ error: "Username should be at least 3 letters long" });
    }

    // Validate bio length
    if (bio.length > bioLimit) {
        return res.status(403).json({ error: `Bio should not be more than ${bioLimit} characters` });
    }

    let socialLinksArr = Object.keys(social_links); // Extract social link keys for validation

    try {
        // Validate each social link's format
        for (let i = 0; i < socialLinksArr.length; i++) {

            if (social_links[socialLinksArr[i]].length) {

                let hostname = new URL(social_links[socialLinksArr[i]]).hostname; // Parse URL

                // Check if hostname matches the expected format
                if (!hostname.includes(`${socialLinksArr[i]}.com`) && socialLinksArr[i] !== 'website') {

                    return res.status(403).json({ error: `${socialLinksArr[i]} link is invalid. You must enter a full link` });

                }

            }

        }
    }

    catch (err) {
        // Handle invalid URL formatting
        return res.status(500).json({ error: "You must provide full social links with http(s) included" });
    }

    // Construct the object to update
    let updateObj = {
        "personal_info.username": username,
        "personal_info.bio": bio,
        social_links
    };

    // Update user profile in the database
    User.findOneAndUpdate({ _id: req.user }, updateObj, { runValidators: true })

        .then(() => {
            return res.status(200).json({ username }); // Respond with the updated username
        })

        .catch(err => {
            // Handle duplicate username error
            if (err.code == 11000) {
                return res.status(409).json({ error: "Username is already taken" });
            }
            // Handle other errors
            return res.status(500).json({ error: err.message });
        });
};

export const change_password = async(req,res) =>{
    let {currentPassword, newPassword} = req.body;
    if(!passwordRegex.test(currentPassword) || !passwordRegex.test(newPassword)){
        return res.status(403).json({error: "Password should be 6 to 20 characters long with a numeric, 1 lowercase and 1 uppercase letters"})
    }
    User.findOne({_id:req.user})
    .then((user)=>{
        if(user.google_auth){
            return res.status(403).json({error: "You can't change account's password because you logged in through google"})
        }

        bcrypt.compare(currentPassword,user.personal_info.password,(err,result)=>{
            if(err){
                return res.status(500).json({error:" some error occured while changing the password, please try again later"})
            }
            if(!result){
                return res.status(403).json({error:"Incorrect current password"})
            }
            bcrypt.hash(newPassword, 10, (err, hashed_password)=>{
                User.findOneAndUpdate({_id: req.User},{"personal_info.password":hashed_password})
                .then((u)=>{
                    return res.status(200).json({status: 'password changed'})
                })
                .catch(err => {
                    return res.status(500).json({error:'Some error occured while saving new password, please try again later'})
                })
            })
        })
    })
    .catch(err=>{
        console.log(err);
        res.status(500).json({error:"user not found"})
    })
};

export const user_written_blogs = async(req, res) => {
    let user_id = req.user;
    let { page, draft, query, deletedDocCount } = req.body;

    let maxLimit = 5;
    let skipDocs = (page - 1) * maxLimit;
    if(deletedDocCount){
        skipDocs -= deletedDocCount;
    }

    Blog.find({ author: user_id, draft, title: new RegExp(query, 'i') })
    .skip(skipDocs)
    .limit(maxLimit)
    .sort({ publishedAt: -1 })
    .select(" title banner publishedAt blog_id activity des draft -_id ")
    .then(blogs => {
        return res.status(200).json({ blogs })
    })
    .catch(err => {
        return res.status(500).json({ error: err.message });
    })
};

export const user_written_blogs_count = async(req, res) => {
    let user_id = req.user;
    let { draft, query } = req.body;

    Blog.countDocuments({ author: user_id, draft, title: new RegExp(query, 'i') })
    .then(count => {
        return res.status(200).json({ totalDocs: count })
    })
    .catch(err => {
        console.log(err.message);
        return res.status(500).json({ error: err.message });
    })
};

