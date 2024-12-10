import React, { useState } from "react";
import { useChatStore } from "../../../lib/chatStore.js";
import { toast } from "react-toastify";
import "./modalImageInfo.scss";
import { arrayUnion, doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../../lib/firebase.js";
import upload from "../../../lib/upload.js";
import { useUserStore } from "../../../lib/userStore.js";
import uploadDocument from "../../../lib/uploadDocument.js";
import { v4 as uuidv4 } from 'uuid';

const ModalImageInfo = () => {
  const { currentUser } = useUserStore();
  const { changeShowModalImageInfo, imageInfo, chatId, resetModalImageInfo, user } = useChatStore();
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false)

  const closeModalImageInfo = () => {
    changeShowModalImageInfo();
    resetModalImageInfo();
  };

  const handleSend = async (e) => {
    e.preventDefault();
    console.log(imageInfo);
    setLoading(true)

    const uniqueMessageId = uuidv4();

    let url = null;

    try {
      if (imageInfo.file) {

        // Максимальный размер файла 5MB
        const maxSize = 5 * 1024 * 1024; // 5MB

        if (imageInfo.file.size > maxSize) {
          toast.error("The file is too big! Maximum size 5MB.");
          changeShowModalImageInfo();
          resetModalImageInfo();
          return;
        } else if (imageInfo.file.size == 0) {
          toast.error("The file is too big! Maximum size 5MB.");
          changeShowModalImageInfo();
          resetModalImageInfo();
        }

        if (imageInfo.type === "image") {
          // setFileType('Image');
          // console.log("img");

          url = await upload(imageInfo.file);
          console.log(url);
        } else {
          // setFileType('Document');
          // console.log("doc");

          url = await uploadDocument(imageInfo.file);
          console.log(url);
        }

        const chatsImgDocRef = doc(db, "chats", chatId);

        try {
          const chatsImgDocSnap = await getDoc(chatsImgDocRef);
          console.log(chatsImgDocSnap);

          if (chatsImgDocSnap.exists()) {
            const data = chatsImgDocSnap.data();
            console.log(data);

            if (imageInfo.type === "image") {
              await updateDoc(chatsImgDocRef, {
                images: arrayUnion(url),
              });
            } else {
              await updateDoc(chatsImgDocRef, {
                documents: arrayUnion({
                  url,
                  name: imageInfo.file.name,
                  size: imageInfo.file.size,
                }),
              });
            }
          } else {
            console.log("No such document!");
          }
        } catch (error) {
          console.error("Error updating document: ", error);
        }
      }

      if (text !== "") {
        // console.log(fileType);

        await updateDoc(doc(db, "chats", chatId), {
          messages: arrayUnion({
            senderId: currentUser.id,
            text,
            uniqueMessageId: uniqueMessageId,
            createdAt: new Date(),
            ...(url && imageInfo.type === "image" && { img: url }),
            ...(url &&
              imageInfo.type === "document" && {
                document: {
                  url,
                  name: imageInfo.file.name,
                  size: imageInfo.file.size,
                },
              }),
          }),
        });
      } else {
        // console.log(fileType);

        await updateDoc(doc(db, "chats", chatId), {
          messages: arrayUnion({
            senderId: currentUser.id,
            createdAt: new Date(),
            uniqueMessageId: uniqueMessageId,
            ...(url && imageInfo.type === "image" && { img: url }),
            ...(url &&
              imageInfo.type === "document" && {
                document: {
                  url,
                  name: imageInfo.file.name,
                  size: imageInfo.file.size,
                },
              }),
          }),
        });
      }

      const userIDs = [currentUser.id, user.id];

      userIDs.forEach(async (id) => {
        const userChatsRef = doc(db, "userchats", id);
        const userChatsSnapsShot = await getDoc(userChatsRef);

        if (userChatsSnapsShot.exists()) {
          const userChatsData = userChatsSnapsShot.data();

          const chatIndex = userChatsData.chats.findIndex(
            (c) => c.chatId === chatId
          );

          userChatsData.chats[chatIndex].lastMessage = text
            ? text
            : imageInfo.type;
          userChatsData.chats[chatIndex].isSeen =
            id === currentUser.id ? true : false;
          userChatsData.chats[chatIndex].updatedAt = Date.now();

          await updateDoc(userChatsRef, {
            chats: userChatsData.chats,
          });
        }
      });
    } catch (err) {
      console.log(err);
    } finally {
      resetModalImageInfo();
      changeShowModalImageInfo();
      setText("");
      setLoading(false)
    }   
  };

  return (
    <div className="background-modal">
      <div className="modal-image-info">
        <div className="image-container">
          {imageInfo.type === "image" ? (
            <img className="image" src={imageInfo.url} alt="#" />
          ) : (
            <div className="doc">
              <img className="icon" src="/google-docs (1).png" alt="#" />
              <p>{imageInfo.file.name}</p>
              <p>
                {imageInfo.file.size < 1024
                  ? `${imageInfo.file.size} bytes`
                  : imageInfo.file.size < 1048576
                  ? `${(imageInfo.file.size / 1024).toFixed(2)} KB`
                  : `${(imageInfo.file.size / 1048576).toFixed(2)} MB`}
              </p>
            </div>
          )}
        </div>
        <form className="form">
          <input
            disabled={loading} 
            type="text"
            onChange={(e) => setText(e.target.value)}
            placeholder="Введите текст, если нужно"
          />
          <button disabled={loading} onClick={(e) => handleSend(e)} className="sendButton">
            {loading ? "Loading" : "Send"}
          </button>
        </form>
        <img
          onClick={closeModalImageInfo}
          className="cross"
          src="./cross.png"
          alt="#"
        />
      </div>
    </div>
  );
};

export default ModalImageInfo;
