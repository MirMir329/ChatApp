import React from 'react'
import List from "./list/List.jsx"
import Chat from "./chat/Chat.jsx"
import Detail from "./detail/Detail.jsx"
import Login from "./login/Login.jsx"
import Notification from "./notification/Notification"
import { useEffect } from "react"
import { onAuthStateChanged } from "firebase/auth"
import { auth } from "../../lib/firebase"
import { useUserStore } from "../../lib/userStore"
import { useChatStore } from "../../lib/chatStore"
import "./chatContainer.scss"

const ChatContainer = () => {

    const { currentUser, isLoading, fetchUserInfo } = useUserStore()
    const { chatId, isShowInfo } = useChatStore()

    useEffect(() => {
      
      const unSub = onAuthStateChanged(auth, (user) => {
        fetchUserInfo(user?.uid)
      })
    
      return () => {
        unSub();
      }
    }, [])
    
      // if(currentUser) {
      //   console.log(currentUser);
      // }

    return (
      <>
        {!isLoading ? (
          <div className='container'>
              {currentUser ? (
                  <>
                    <List/>
                    {chatId && <Chat/>}
                    {(chatId && isShowInfo) && <Detail/>}
                  </>
                  ) : (
                  <Login/>
                  )
              }
              <Notification/>
          </div>
        ) : (
          <span className="loader"></span>
        )}
      </>
    )
}

export default ChatContainer