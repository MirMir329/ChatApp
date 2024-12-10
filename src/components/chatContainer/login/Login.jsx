import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import "./login.scss"
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth"
import { auth, db } from "../../../lib/firebase"
import { doc, setDoc } from "firebase/firestore"
import upload from "../../../lib/upload"
import { useUserStore } from "../../../lib/userStore"
import { v4 as uuidv4 } from 'uuid';
import { useScreenWidthStore } from "../../../lib/screenWidthStore.js"

const Login = () => {

    const { fetchUserInfo } = useUserStore()

    const [avatar, setAvatar] = useState({
        file: null,
        url: "",
    })

    const [loading, setLoading] = useState(false)
    const { screenWidth, setScreenWidth, isMobileLoginBlockLeft, isMobileLoginBlockRight, setIsMobileLoginBlockLeftFalse, setIsMobileLoginBlockLeftTrue, setIsMobileLoginBlockRightFalse, setIsMobileLoginBlockRightTrue } = useScreenWidthStore();

    const handleResize = () => {
        setScreenWidth(window.innerWidth); // Обновляем состояние в zustand    
        
        // console.log(window.innerWidth);
        
        // if(window.innerWidth < 800) {
        //     console.log("sdffffffffffffffff");
            
        //     setIsMobileLoginBlockRightFalse()
        // }
    };

    useEffect(() => {
        window.addEventListener('resize', handleResize);

        // console.log(screenWidth);    

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const openRightItem = () => {
        setIsMobileLoginBlockLeftFalse()
        setIsMobileLoginBlockRightTrue()
    }

    const openLeftItem = () => {
        setIsMobileLoginBlockLeftTrue()
        setIsMobileLoginBlockRightFalse()
    }
    const handleAvatar = (e) => {
        if(e.target.files[0]) {
            setAvatar({
                file: e.target.files[0],
                url: URL.createObjectURL(e.target.files[0])
            })
        }
    }

    const handleRegister = async (e) => {
          // console.log("Сработала функция handleRegister");
          e.preventDefault()
          setLoading(true)
          const formData = new FormData(e.target)
          const {username, email, password} = Object.fromEntries(formData)

          try {
              const res = await createUserWithEmailAndPassword(auth, email, password)
              const uniqueUserId = uuidv4();
              
              if (avatar.file) {
                const imgUrl = await upload(avatar.file)

                await setDoc(doc(db, "users", res.user.uid), {
                    username,
                    email,
                    avatar: imgUrl,
                    id: res.user.uid,
                    uniqueId: uniqueUserId,
                    description: "",
                    blocked: [],
                });
            } else {
                await setDoc(doc(db, "users", res.user.uid), {
                    username,
                    email,
                    avatar: false,
                    id: res.user.uid,
                    uniqueId: uniqueUserId,
                    description: "",
                    blocked: [],
                });
            }           
            await setDoc(doc(db, "userchats", res.user.uid), {
                chats: [],
            });
            fetchUserInfo(res.user.uid);
            toast.success("Account created!")
        } catch (err) {
            console.log(err);
            console.log(err.message);

            if (err.message == "Firebase: Error (auth/invalid-email).") {
                toast.error("You entered the wrong ID!")
            } else if (err.message == "Firebase: Error (auth/email-already-in-use).") {
                toast.error("This email is already in use!")
            } else {
                toast.error("Something went wrong.")
            }
        } finally {
            setLoading(false)
        }
    }

    const handleLogin = async (e) => {
                // console.log("Сработала функция handleLogin");     
                e.preventDefault();
                setLoading(true);
                const formData = new FormData(e.target);
                const { email, password} = Object.fromEntries(formData);

                try {
                    await signInWithEmailAndPassword(auth, email, password)
                    fetchUserInfo()
                    toast.success("Welcome!")
                } catch (error) {
                   console.log(error);
                   console.log(error.message);  
                   toast.error("Something went wrong.")
                } finally {
                    setLoading(false)
                }
            }
        
            return (
                <div className="login">
                                {isMobileLoginBlockLeft && (
                <div className="item left-item">
                    <h2>Welcome back!</h2>
                    <form onSubmit={handleLogin}>
                        <input type="text" placeholder="Email" name="email"/>
                        <input type="password" placeholder="Password" name="password"/>
                        {screenWidth < 800 && (
                            <p className="link" onClick={openRightItem}>Register if you don't have an account</p>
                            // <p>Register if you don't have an account</p>
                        )}                     
                        <button type="submit" disabled={loading}>{loading ? "Loading..." : "Sign In"}</button>
                    </form>
                </div>
            )}

            {screenWidth > 800 && (
                <div className="separator"></div>
            )}

            {(screenWidth > 800 || isMobileLoginBlockRight) && (
                <div className="item right-item">
                    <h2>Create an Account</h2>
                    <form onSubmit={handleRegister}>
                        <label htmlFor="file">
                            <img src={avatar.url || "./avatar.png"} alt=""/>
                            Upload an image
                        </label>
                        <input type="file" id="file" style={{display: "none"}} onChange={handleAvatar}/>
                        <input type="text" placeholder="Username" name="username"/>
                        <input type="text" placeholder="Email" name="email"/>
                        <input type="password" placeholder="Password" name="password"/>
                        {screenWidth < 800 && (
                            <p className="link" onClick={openLeftItem}>Already have an account?</p>
                            // <p>Already have an account?</p>
                        )}                   
                        <button type="submit" disabled={loading}>{loading ? "Loading..." : "Sign Up"}</button>
                    </form>
                </div>
            )}
                    </div>
    )
}

export default Login