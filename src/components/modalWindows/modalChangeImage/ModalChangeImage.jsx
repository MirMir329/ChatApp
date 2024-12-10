import React, { useState } from "react";
import { useChatStore } from "../../../lib/chatStore.js";
import "./modalChangeImage.scss";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db, storage } from "../../../lib/firebase";
import upload from "../../../lib/upload";
import { useUserStore } from "../../../lib/userStore.js";
import { deleteObject, ref } from "firebase/storage";

const ModalChangeImage = () => {
  const { currentUser, setCurrentUser } = useUserStore();
  const {
    changeShowModalChangeImage,
    modalChangeImage,
    resetModalChangeImage,
  } = useChatStore();

  const [loading, setLoading] = useState(false)

  const closeModalChangeImage = () => {
    changeShowModalChangeImage();
    resetModalChangeImage();
  };

  const handleSend = async (e) => {
    e.preventDefault();
    // console.log(modalChangeImage);
    setLoading(true)
    let imgUrl = null;

    try {
      if (modalChangeImage.file) {
        // imgUrl = await upload(imageInfo)
        imgUrl = await upload(modalChangeImage.file);
        const changeUserImgRef = doc(db, "users", currentUser.id); // Укажите правильный путь к документу

        // console.log(imgUrl);

        try {
          // Получаем текущие данные
          const changeUserImgRefSnap = await getDoc(changeUserImgRef);
        //   console.log(changeUserImgRefSnap);

          if (changeUserImgRefSnap.exists()) {
            const data = changeUserImgRefSnap.data();
            // console.log(data);

            // Извлечение пути из URL
            const pathToFile = decodeURIComponent(data.avatar.split('/o/')[1].split('?')[0]);

            // Ссылка на файл в Storage
            const fileRef = ref(storage, pathToFile);

            // Удаление файла
            deleteObject(fileRef)
            .then(() => {
                console.log("Файл успешно удален!");
            })
            .catch((error) => {
                console.error("Ошибка удаления файла:", error);
            });

            await updateDoc(changeUserImgRef, {
              avatar: imgUrl,
            });

            
            rewriteCurrentUserData()
          } else {
            console.log("No such document!");
          }
        } catch (error) {
          console.error("Error updating document: ", error);
        }
      }
    } catch (err) {
      console.log(err);
    }
    finally {
      setLoading(false)
      changeShowModalChangeImage()
      resetModalChangeImage();
    }
  };

  const rewriteCurrentUserData = async () => {
    const userRef = doc(db, "users", currentUser.id);
    const newUserSnapsShot = await getDoc(userRef);
    const newUserData = newUserSnapsShot.data();
    console.log(newUserData);
    setCurrentUser(newUserData);
  };

  return (
    <div className="background-modal">
      <div className="modal-change-image">
        <div className="image-container">
          <img className="image" src={modalChangeImage.url} alt="#" />
        </div>
        <form onSubmit={(e) => handleSend(e)} className="form">
          <button type="submit" disabled={loading} className="sendButton">
            {loading ? "Loading..." : "Send"}
          </button>
        </form>
        <img
          onClick={closeModalChangeImage}
          className="cross"
          src="./cross.png"
          alt="#"
        />
      </div>
    </div>
  );
};

export default ModalChangeImage;
