import React, { useEffect, useState } from "react";
import "./aboutUser.scss";
import { useUserStore } from "../../../../lib/userStore";
import { doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "../../../../lib/firebase";
import { useChatStore } from "../../../../lib/chatStore.js"

const AboutUser = ({ setIsShowUserDetails }) => {
  const { currentUser, setCurrentUser } = useUserStore();
  const { changeShowModalChangeImage, setModalChangeImage, isShowModalChangeImage } = useChatStore();

  const [usernameVisability, setUsernameVisability] = useState(false);
  const [infoVisability, setInfoVisability] = useState(false);
  const [newUsername, setNewUsername] = useState(currentUser.username || "");
  const [newDescription, setNewDescription] = useState(currentUser.description || "");
  // const [newImage, setNewImage] = useState({
  //   file: "",
  //   url: "",
  // })

  const rewriteCurrentUserData = async () => {
    const userRef = doc(db, "users", currentUser.id);
    const newUserSnapsShot = await getDoc(userRef);
    const newUserData = newUserSnapsShot.data();
    // console.log(newUserData);
    setCurrentUser(newUserData);
  };

  const changeUserImage = (e) => {
    
    if (e.target.files[0]) {
      setModalChangeImage({
        file: e.target.files[0],
        url: URL.createObjectURL(e.target.files[0]),
      });
      changeShowModalChangeImage(true)
      e.target.value = "";
    } else {
      console.log(e.target.files);
    }   
  };

  const changeUserData = async (whichInfo) => {
    const userRef = doc(db, "users", currentUser.id);
    const userSnapsShot = await getDoc(userRef);

    if (userSnapsShot.exists()) {
      if (whichInfo === "username") {
        // console.log("username changed");

        await updateDoc(userRef, {
          username: newUsername,
        });

        rewriteCurrentUserData();
        setUsernameVisability(false);
      } else if (whichInfo === "info") {
        // console.log("description changed");

        await updateDoc(userRef, {
          description: newDescription,
        });

        rewriteCurrentUserData();
        setInfoVisability(false);
      } else {
        console.log("Ничего не сработало!");
      }
    }
  };

  return (
    <div className="about-user-block">
      <div className="user-title">
        <img
          onClick={() => setIsShowUserDetails(false)}
          src="./cross.png"
          alt="#"
        />
        <span>User details</span>
      </div>
      <div className="user-about">
        <div className="image-container">
          <div className="img-background">
            <label htmlFor="file">
              <div className="hover-image">
                <img src="./img.png" alt="#" />

                <input
                  type="file"
                  id="file"
                  style={{ display: "none" }}
                  onChange={changeUserImage}
                />

                <p>
                  CHANGE <br /> PROFILE <br /> PHOTO
                </p>
              </div>
            </label>
            <img
              src={currentUser.avatar ? currentUser.avatar : `/avatar.png`}
              alt="#"
            />
          </div>
        </div>

        <div className="line">
          <h3>Name</h3>
          <div className="line-inside">
            {!usernameVisability ? (
              <>
                <p>{currentUser?.username}</p>
                <img
                  src="/edit.png"
                  alt="#"
                  onClick={() => setUsernameVisability(true)}
                />
              </>
            ) : (
              <div className="bottom">
                <input
                  type="text"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                />
                <img
                  src="/checkmark.png"
                  alt="#"
                  onClick={() => changeUserData("username")}
                />
              </div>
            )}
          </div>
        </div>

        <div className="line">
          <h3>Information</h3>
          <div className="line-inside">
            {!infoVisability ? (
              <>
                <p>{currentUser.description ? currentUser.description : "Here you can write information about yourself"}</p>
                <img
                  src="/edit.png"
                  alt="#"
                  onClick={() => setInfoVisability(true)}
                />
              </>
            ) : (
              <div className="bottom">
                <input
                  type="text"
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                />
                <img
                  src="/checkmark.png"
                  alt="#"
                  onClick={() => changeUserData("info")}
                />
              </div>
            )}
          </div>
        </div>

        <div className="line">
          <h3>Unique ID</h3>
          <p>{currentUser.uniqueId}</p>
          <p className="advise">(Thanks to a unique ID you can find your friend)</p>
        </div>
      </div>
    </div>
  );
};

export default AboutUser;