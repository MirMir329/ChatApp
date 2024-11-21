import React from 'react'
import { useChatStore } from "../../lib/chatStore.js"
import "./modalImageInfo.scss"

const ModalImageInfo = () => {
  const { changeShowModalImageInfo, resetModalGalleryImage, imageInfo } = useChatStore()

  const closeModalImageInfo = () => {
    changeShowModalImageInfo()
    resetModalGalleryImage()
  }

  const handleSend = async () => {

    let imgUrl = null

    try {
      if(img.file) {
        imgUrl = await upload(img.file)
        const chatsImgDocRef = doc(db, "chats", chatId); // Укажите правильный путь к документу

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
      })}
    } catch (err) {
      console.log(err);
    }

    setImg({
      file: null,
      url: ""
    })

    setText("")
  }
      

      

    

    

  return (
    <div className='background-modal'>
        <div className='modal-image-info'>
          <div className='image-container'>
            <img className='image' src={imageInfo} alt="#" />
          </div>
          <form className='form'>
            <input type="text" placeholder='Введите текст, если нужно'/>
            <button onClick={handleSend} className='sendButton'>Send</button>
          </form>
          <img onClick={closeModalImageInfo} className='cross' src="./cross.png" alt="#" />
        </div>
    </div>
  )
}

export default ModalImageInfo
