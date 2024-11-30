import { useContext, useEffect, useRef, useState } from "react";
import { UserContext } from "../App";
import axios from "axios";
import { profileDataStructure } from "./profile.page";
import AnimationWrapper from "../common/page-animation";
import Loader from "../components/loader.component";
import toast, { Toaster } from "react-hot-toast";
import InputBox from "../components/input.component";
import { uploadImage } from "../common/aws";
import { storeInSession } from "../common/session";

const EditProfile = () => {

    // Access user authentication and state management from context
    let { userAuth, userAuth: { access_token }, setUserAuth } = useContext(UserContext);

    let bioLimit = 150; // Define the character limit for the bio field

    // References for profile image element and form
    let profileImgEle = useRef();
    let editProfileForm = useRef();

    // State variables to manage profile data, loading status, and form updates
    const [profile, setProfile] = useState(profileDataStructure); // Holds the profile information
    const [loading, setLoading] = useState(true); // Indicates if the page is loading
    const [charactersLeft, setCharctersLeft] = useState(bioLimit); // Tracks remaining characters for the bio
    const [updatedProfileImg, setUpdatedProfileImg] = useState(null); // Stores the updated profile image file

    // Destructure profile data for easy access
    let { personal_info: { fullname, username: profile_username, profile_img, email, bio }, social_links } = profile;

    // Fetch profile data on component mount or when access token changes
    useEffect(() => {
        if (access_token) {
            axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/get-profile", { username: userAuth.username })
                .then(({ data }) => {
                    setProfile(data); // Update profile data in state
                    setLoading(false); // Disable the loading state
                })
                .catch(err => {
                    console.log(err);
                });
        }
    }, [access_token]);

    // Handle character count for the bio field
    const handleCharacterChange = (e) => {
        setCharctersLeft(bioLimit - e.target.value.length); // Update the remaining character count
    };

    // Preview profile image before uploading
    const handleImagePreview = (e) => {
        let img = e.target.files[0];
        profileImgEle.current.src = URL.createObjectURL(img); // Set the preview image source
        setUpdatedProfileImg(img); // Update the state with the selected image
    };

    // Upload the selected profile image to the server
    const handleImageUpload = (e) => {
        e.preventDefault();

        if (updatedProfileImg) {
            let loadingToast = toast.loading("Uploading....");
            e.target.setAttribute("disabled", true); // Disable the upload button during the process

            uploadImage(updatedProfileImg)
                .then(url => {
                    if (url) {
                        axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/update-profile-img", { url }, {
                            headers: {
                                'Authorization': `Bearer ${access_token}`
                            }
                        })
                            .then(({ data }) => {
                                // Update user context and session with the new profile image URL
                                let newUserAuth = { ...userAuth, profile_img: data.profile_img };

                                storeInSession("user", JSON.stringify(newUserAuth));
                                setUserAuth(newUserAuth);

                                setUpdatedProfileImg(null); // Clear the uploaded image from state
                                toast.dismiss(loadingToast);
                                e.target.removeAttribute("disabled");
                                toast.success("Uploaded 👍");
                            })
                            .catch(({ response }) => {
                                toast.dismiss(loadingToast);
                                e.target.removeAttribute("disabled");
                                toast.error(response.data.error);
                            });
                    }
                })
                .catch(err => {
                    console.log(err);
                });
        }
    };

    // Submit the updated profile data to the server
    const handleSubmit = (e) => {
        e.preventDefault();

        let form = new FormData(editProfileForm.current);
        let formData = {};

        for (let [key, value] of form.entries()) {
            formData[key] = value; // Extract form data into an object
        }

        let { username, bio, youtube, facebook, twitter, github, instagram, website } = formData;

        // Validation for username and bio
        if (username.length < 3) {
            return toast.error("Username should be at least 3 letters long");
        }
        if (bio.length > bioLimit) {
            return toast.error(`Bio should not be more than ${bioLimit}`);
        }

        let loadingToast = toast.loading("Updating.....");
        e.target.setAttribute("disabled", true); // Disable the submit button during the process

        axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/update-profile", {
            username, bio,
            social_links: { youtube, facebook, twitter, github, instagram, website }
        }, {
            headers: {
                'Authorization': `Bearer ${access_token}`
            }
        })
            .then(({ data }) => {
                // Update the user authentication context if the username changes
                if (userAuth.username != data.username) {
                    let newUserAuth = { ...userAuth, username: data.username };

                    storeInSession("user", JSON.stringify(newUserAuth));
                    setUserAuth(newUserAuth);
                }

                toast.dismiss(loadingToast);
                e.target.removeAttribute("disabled");
                toast.success("Profile Updated");
            })
            .catch(({ response }) => {
                toast.dismiss(loadingToast);
                e.target.removeAttribute("disabled");
                toast.error(response.data.error);
            });
    };

    return (
        <AnimationWrapper>
            {
                loading ? <Loader /> : // Show loader while the profile data is being fetched
                    <form ref={editProfileForm}>
                        <Toaster /> {/* Toast notifications for user feedback */}

                        <h1 className="max-md:hidden">Edit Profile</h1>

                        <div className="flex flex-col lg:flex-row items-start py-10 gap-8 lg:gap-10">
                            
                            {/* Profile image upload section */}
                            <div className="max-lg:center mb-5">
                                <label htmlFor="uploadImg" id="profileImgLable"
                                    className="relative block w-48 h-48 bg-grey rounded-full overflow-hidden">
                                    <div className="w-full h-full absolute top-0 left-0 flex items-center justify-center text-white bg-black/30 opacity-0 hover:opacity-100 cursor-pointer">
                                        Upload Image
                                    </div>
                                    <img ref={profileImgEle} src={profile_img} />
                                </label>

                                <input type="file" id="uploadImg" accept=".jpeg, .png, .jpg" hidden onChange={handleImagePreview} />

                                <button className="btn-light mt-5 max-lg:center lg:w-full px-10" onClick={handleImageUpload}>Upload</button>
                            </div>

                            {/* Profile details form */}
                            <div className="w-full">

                                <div className="grid grid-cols-1 md:grid-cols-2 md:gap-5">
                                    <div>
                                        <InputBox name="fullname" type="text" value={fullname} placeholder="Full Name" disable={true} icon="fi-rr-user" />
                                    </div>
                                    <div>
                                        <InputBox name="email" type="email" value={email} placeholder="Email" disable={true} icon="fi-rr-envelope" />
                                    </div>
                                </div>

                                <InputBox type="text" name="username" value={profile_username} placeholder="Username" icon="fi-rr-at" />

                                <p className="text-dark-grey -mt-3">Username will be used to search for users and will be visible to all users</p>

                                <textarea name="bio" maxLength={bioLimit} defaultValue={bio} className="input-box h-64 lg:h-40 resize-none leading-7 mt-5 pl-5" placeholder="Bio" onChange={handleCharacterChange}></textarea>

                                <p className="mt-1 text-dark-grey">{charactersLeft} characters left</p>

                                <p className="my-6 text-dark-grey">Add your social handles below</p>

                                <div className="md:grid md:grid-cols-2 gap-x-6">

                                    {
                                        // Map over social links and render input boxes for each link
                                        Object.keys(social_links).map((key, i) => {

                                            let link = social_links[key];

                                            return <InputBox key={i} name={key} type="text" value={link} placeholder="https://" icon={"fi " + (key != 'website' ? "fi-brands-" + key : "fi-rr-globe")} />
                                        })
                                    }

                                </div>

                                <button className="btn-dark w-auto px-10" type="submit" onClick={handleSubmit}>Update</button>

                            </div>

                        </div>
                    </form>
            }
        </AnimationWrapper>
    );
};

export default EditProfile;
