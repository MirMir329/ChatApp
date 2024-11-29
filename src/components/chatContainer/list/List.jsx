import "./list.scss"
import UserInfo from "./userInfo/UserInfo"
import ChatList from "./chatList/ChatList"
// import { useChatStore } from "../../../lib/chatStore.js"
import AboutUser from "./aboutUser/AboutUser.jsx"
import { useState } from "react"

const List = () => {

    // const { isShowUserDetails } = useChatStore();

    const [isShowUserDetails, setIsShowUserDetails] = useState(false)

    return (
        <div className="list">

            {isShowUserDetails ? (
                <AboutUser setIsShowUserDetails={setIsShowUserDetails}/>
            ) : (
                <>
                    <UserInfo setIsShowUserDetails={setIsShowUserDetails}/>
                    <ChatList/>
                </>
            )}
        </div>
    )
}


export default List