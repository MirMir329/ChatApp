import React, { useState } from 'react'
import { useChatStore } from "../../lib/chatStore.js"
import "./modalImageInfo.scss"
import { arrayUnion, doc, getDoc, updateDoc } from "firebase/firestore"
import { db } from "../../lib/firebase"
import upload from "../../lib/upload"
import { useUserStore } from "../../lib/userStore"

const ModalImageInfo = () => {

  const { currentUser } = useUserStore()
  const { changeShowModalImageInfo, resetModalGalleryImage, imageInfo, chatId, resetModalImageInfo, user } = useChatStore()

  const [text, setText] = useState("")

  const closeModalImageInfo = () => {
    changeShowModalImageInfo()
    resetModalGalleryImage()
  }

  const handleSend = async (e) => {
    e.preventDefault()
    console.log(imageInfo);

    let imgUrl = null

    try {
      if(imageInfo.file) {
        // imgUrl = await upload(imageInfo)
        imgUrl = await upload(imageInfo.file)
        const chatsImgDocRef = doc(db, "chats", chatId); // Укажите правильный путь к документу

        console.log(imgUrl);

        try {
          // Получаем текущие данные
          const chatsImgDocSnap = await getDoc(chatsImgDocRef);
          console.log(chatsImgDocSnap);
        
          if (chatsImgDocSnap.exists()) {
            const data = chatsImgDocSnap.data();
            console.log(data);
            
            await updateDoc(chatsImgDocRef, {
              images: arrayUnion(imgUrl)
            });
          } else {
            console.log("No such document!");
          }
        } catch (error) {
          console.error("Error updating document: ", error);
        }

      }

      if(text !== "") {
        await updateDoc(doc(db, "chats", chatId), {
          messages:arrayUnion({
            senderId: currentUser.id,
            text,
            createdAt: new Date(),
            ...(imgUrl && {img: imgUrl}),
          }),
        });
      } else {
        await updateDoc(doc(db, "chats", chatId), {
          messages:arrayUnion({
            senderId: currentUser.id,
            createdAt: new Date(),
            ...(imgUrl && {img: imgUrl}),
          }),
        });
      }

        

        const userIDs = [currentUser.id, user.id]

        userIDs.forEach(async (id) => {
        const userChatsRef = doc(db, "userchats", id)
        const userChatsSnapsShot = await getDoc(userChatsRef)

        if(userChatsSnapsShot.exists()) {
          const userChatsData = userChatsSnapsShot.data();

          const chatIndex = userChatsData.chats.findIndex(c => c.chatId === chatId)

          userChatsData.chats[chatIndex].lastMessage = text
          userChatsData.chats[chatIndex].isSeen = id === currentUser.id ? true : false
          userChatsData.chats[chatIndex].updatedAt = Date.now();

          await updateDoc(userChatsRef, {
            chats: userChatsData.chats,
          })
        }
      })
    } catch (err) {
      console.log(err);
    }

    resetModalImageInfo()
    changeShowModalImageInfo()

    setText("")
  }
    
  return (
    <div className='background-modal'>
        <div className='modal-image-info'>
          <div className='image-container'>
            <img className='image' src={imageInfo.url} alt="#" />
          </div>
          <form className='form'>
            <input type="text" onChange={(e) => setText(e.target.value)} placeholder='Введите текст, если нужно'/>
            <button onClick={(e) => handleSend(e)} className='sendButton'>Send</button>
          </form>
          <img onClick={closeModalImageInfo} className='cross' src="./cross.png" alt="#" />
        </div>
    </div>
  )
}

export default ModalImageInfo
