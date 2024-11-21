import { useState } from "react"
import { useUserStore } from "../../../../lib/userStore"
import "./userInfo.scss"
import { auth } from "../../../../lib/firebase.js"


const UserInfo = () => {

    const [isOpen, setIsOpen] = useState(false)

    const { currentUser } = useUserStore()

    return (
        <div className="userInfo">
            <div className="user">
                <img src={currentUser.avatar || "avatar.png"} alt="" />
                <h2>{currentUser.username}</h2>
            </div>
            <div className="icons">
                <div className="more">
                    <img src="./more.png" alt=""  onClick={() => setIsOpen((prev) => !prev)} />
                    {isOpen && (
                        <div className="more-details">
                            <p onClick={() => auth.signOut()}>Logout</p>
                            {/* <button className="logout" onClick={()=>auth.signOut()}>Logout</button> */}
                        </div>
                    )}
                    
                </div>
                
                <img src="./video.png" alt="" />
                <img src="./edit.png" alt="" />
            </div>
        </div>
    )
}


export default UserInfo