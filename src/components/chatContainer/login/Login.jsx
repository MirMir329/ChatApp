import { useState } from "react"
import { toast } from "react-toastify"
import "./login.scss"
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth"
import { auth, db } from "../../../lib/firebase"
import { doc, setDoc } from "firebase/firestore"
import upload from "../../../lib/upload"
import { useUserStore } from "../../../lib/userStore"

const Login = () => {

    const { fetchUserInfo } = useUserStore()

    const [avatar, setAvatar] = useState({
        file: null,
        url: "",
    })

    const [loading, setLoading] = useState(false)

    const handleAvatar = (e) => {
        if(e.target.files[0]) {
            setAvatar({
                file: e.target.files[0],
                url: URL.createObjectURL(e.target.files[0])
            })
        }
    }

    const handleRegister = async (e) => {
        console.log("Сработала функция handleRegister");
        e.preventDefault()
        setLoading(true)
        const formData = new FormData(e.target)

        const {username, email, password} = Object.fromEntries(formData)

        try {
            const res = await createUserWithEmailAndPassword(auth, email, password)
            
            if (avatar.file) {
                // console.log(avatar.file, "123123");
                const imgUrl = await upload(avatar.file)

                await setDoc(doc(db, "users", res.user.uid), {
                    username,
                    email,
                    avatar: imgUrl,
                    id: res.user.uid,
                    blocked: [],
                });
            } else {
                // console.log(avatar.file, "456456");

                await setDoc(doc(db, "users", res.user.uid), {
                    username,
                    email,
                    avatar: false,
                    id: res.user.uid,
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
            
            toast.error("Something went wrong.")
        } finally {
            setLoading(false)
        }
    }

    const handleLogin = async (e) => {
        console.log("Сработала функция handleLogin");
        
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
            <div className="item">
                <h2>Welcome back!</h2>
                <form onSubmit={handleLogin}>
                    <input type="text" placeholder="Email" name="email"/>
                    <input type="text" placeholder="Password" name="password"/>
                    <button type="submit" disabled={loading}>{loading ? "Loading..." : "Sign In"}</button>
                </form>
            </div>
            <div className="separator"></div>
            <div className="item">
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
                    <button type="submit" disabled={loading}>{loading ? "Loading..." : "Sign Up"}</button>
                </form>
            </div>
        </div>
    )
}

export default Login