import { useRef } from "react";
import { Link } from "react-router-dom";
import InputBox from"../components/input.component";
import googleIcon from "../imgs/google_img.png"
import AnimationWrapper from "../common/page.animation";

const userAuthForm=({type})=>{

    const handleSubmit=(e) => {

        const authForm = useRef();


        e.preventDefault();


        let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; // regex for email
        let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/; // regex for password

        //formdata
        let form=new FormData(authForm.current);
        let formData=[]

        for(let[key,value] of form.entries()){
            formData[key]=value;



            let  {fullname,email,password}=formData;
            //form validation

            if(fullname){
                if(fullname.length < 3){
                    return console.log({"error": "Fullname must be atleast 3 letters long"})
                }
            }
            if(!email.length){
                return console.log({"error": "Enter Email"})
            }
            if(!emailRegex.test(email)){
                return console.log({"error": "Email is invalid"})
            }
            if(!passwordRegex.test(password)){
                return console.log({"error": "Password should be 6 to 20 characters long with a numeric, 1 lowercase and 1 uppercase letter"})
            }
        }
    }
    return(

        <AnimationWrapper keyValue={type}>

            <section className="h-cover flex items-center justify-center">
                <form ref={authForm} className="w-[80%] max-w-[400px]">
                    <h1 className="text-4xl font-gelasio capitalise text-center mb-24">
                        {type="sign in" ? "Welcome back" : "Join us today"}
                    </h1>


                    {
                        type != "sign-in" ?
                        <inputBox
                            name="fullname"
                            type="text"
                            placeholder="Full Name"
                            icon="fi-rr-user"
                        />
                        
                        :  " "
                    }



                        <inputBox
                            name="email"
                            type="email"
                            placeholder="Email"
                            icon="fi-rr-envelope"
                        />


                        <inputBox
                            name="password"
                            type="password"
                            placeholder="Password"
                            icon="fi-rr-key"
                        />

                        <button className="btn-dark center mt-14"
                            type="submit">
                                onClick={handleSubmit}
                            {type.replace("-"," ")}
                        </button>

                        <div relative w-full flex items-center gap-2 my-10 opacity-10 uppercase text-black font-bold >
                            <hr className="w-1/2 border-black"/>
                            <p>or</p>
                            <hr className="w-1/2 border-black"/>
                        </div>

                        <button className="btn-dark flex items-center justify-center gap-4 w-[90%] center">
                            <img src={googleIcon} className="w-5"/>
                            continue with google
                        </button>


                        {

                            type="sign-in" ?
                            <p className="mt-6 text-dark-grey text-xl text-center" >
                                Don't have an account?
                                <Link to="/signup" className="underline text-black text-xl ml-l">
                                    Join us today
                                </Link>
                            </p>
                            :
                            <p className="mt-6 text-dark-grey text-xl text-center" >
                                Already a member ?
                                <Link to="/signip" className="underline text-black text-xl ml-l">
                                    Sign in here.
                                </Link>
                            </p>

                        }

                </form>
            </section>
        </AnimationWrapper>

    )
}

export default userAuthForm;