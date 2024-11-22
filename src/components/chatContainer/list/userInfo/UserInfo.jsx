import { useState } from "react"
import { useChatStore } from "../../../../lib/chatStore.js"
import { useUserStore } from "../../../../lib/userStore"
import "./userInfo.scss"
import { auth } from "../../../../lib/firebase.js"


const UserInfo = () => {

    const [isOpen, setIsOpen] = useState(false)

    const { resetUser, resetChatId, resetIsShowInfo } = useChatStore();
    const { currentUser, fetchUserInfo } = useUserStore()

    const logOut = () => {
        auth.signOut()
        resetUser()
        resetChatId()
        resetIsShowInfo()
        fetchUserInfo()
    }

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
                            <p onClick={logOut}>Logout</p>
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