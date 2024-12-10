import { useState, useEffect, useRef } from "react";
import "./chat.scss";
import EmojiPicker from "emoji-picker-react";
import { arrayUnion, doc, getDoc, onSnapshot, updateDoc, } from "firebase/firestore";
import { db } from "../../../lib/firebase";
import { useChatStore } from "../../../lib/chatStore";
import { useUserStore } from "../../../lib/userStore";
import { toast } from "react-toastify";
import { useScreenWidthStore } from "../../../lib/screenWidthStore.js"
import { v4 as uuidv4 } from 'uuid';

const Chat = () => {
  const [chat, setChat] = useState();
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  // const [chosenFile, setChosenFile] = useState({
  //   file: "",
  //   url: "",
  // });
  const [isShowIconsBlock, setIsShowIconsBlock] = useState(false);
  const { currentUser } = useUserStore();
  const { chatId, user, isCurrentUserBlocked, isReceiverBlocked, changeShowInfo, setModalImageInfo, changeShowModalRecording, removeChat, isRemove, changeIsOpenedDeleteWindow, setMessageId} = useChatStore();
  const { setIsMobileFalse } = useScreenWidthStore();

  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    const unSub = onSnapshot(doc(db, "chats", chatId), (res) => {
      setChat(res.data());
    });

    return () => {
      unSub();
    };
  }, [chatId]);

  const handleEmoji = (e) => {
    setText((prev) => prev + e.emoji);
    setOpen(false);
  };

  const showDeleteModal = (id) => {
    changeIsOpenedDeleteWindow()
    setMessageId(id)
  }

  const showIconsBlock = () => {
    setIsShowIconsBlock((prev) => !prev);
  };

  const handleImg = (e) => {
    if (e.target.files[0]) {
      if (e.target.files[0].type.startsWith("image/")) {
        console.log(e.target.files[0].type);

        setModalImageInfo({
          file: e.target.files[0],
          url: URL.createObjectURL(e.target.files[0]),
          type: "image",
        });
      } else {
        toast.error("You have selected the wrong file!")
      }
      showIconsBlock()
      e.target.value = "";
    } else {
      console.log(e.target.files);
    }
  };

  const removeBlocks = () => {
    removeChat()
    setIsMobileFalse()
  }

  const showRecordModal = () => {
    changeShowModalRecording()
    showIconsBlock()
  }

  const handleFile = (e) => {
    if (e.target.files[0]) {
      console.log(e.target.files[0].type);
      if (!e.target.files[0].type.startsWith("image/")) {
        setModalImageInfo({
            file: e.target.files[0],
            url: URL.createObjectURL(e.target.files[0]),
            type: "document",
        });
      } else {
        toast.error("You have selected the wrong file!")
      }

      showIconsBlock()
      e.target.value = "";
    } else {
      console.log(e.target.files);
    }
  };

  const handleSend = async () => {
    if (text === "") return;

    const uniqueUserId = uuidv4();

    try {
      await updateDoc(doc(db, "chats", chatId), {
        messages: arrayUnion({
          senderId: currentUser.id,
          text,
          createdAt: new Date(),
          uniqueMessageId: uniqueUserId
        }),
      });

      const userIDs = [currentUser.id, user.id];

      userIDs.forEach(async (id) => {
        const userChatsRef = doc(db, "userchats", id);
        const userChatsSnapsShot = await getDoc(userChatsRef);

        if (userChatsSnapsShot.exists()) {
          const userChatsData = userChatsSnapsShot.data();

          const chatIndex = userChatsData.chats.findIndex(
            (c) => c.chatId === chatId
          );

          userChatsData.chats[chatIndex].lastMessage = text;
          userChatsData.chats[chatIndex].isSeen = id === currentUser.id ? true : false;
          userChatsData.chats[chatIndex].updatedAt = Date.now();

          await updateDoc(userChatsRef, {
            chats: userChatsData.chats,
          });
        }
      });
    } catch (err) {
      console.log(err);
    } finally {
      setText("");
    }
  };

  return (
    <div className={`chat ${isRemove && "remove"}`}>
      <div className="top" onClick={ isCurrentUserBlocked || isReceiverBlocked ? null : changeShowInfo }>
        <div className="user">
          <img src={user?.avatar || "./avatar.png"} alt="" />
          <div className="texts">
            <span>{user?.username}</span>
            <p>Click here to view contact details</p>
          </div>
        </div>

        <img className="cross" onClick={removeBlocks} src="./cross.png" alt="cross png" />
        
      </div>
      <div className="center">
        {chat?.messages?.map((message) => (
          <div className={message.senderId === currentUser?.id ? "message own" : "message"} key={message?.createdAt}>
            <div className="texts">
              {message.img && <img src={message.img} alt="message img" />}
              {message.document && (
                <div className="doc">
                  <a
                    href={message.document.url}
                    target="_blank"
                    download={message.document.name}
                    rel="noopener noreferrer"
                  >
                    <img className="icon" src="/google-docs (1).png" alt="#" />
                    <div>
                      <p>{message.document.name}</p>
                      <p>
                        {message.document.size < 1024
                        ? `${message.document.size} bytes`
                        : message.document.size < 1048576
                        ? `${(message.document.size / 1024).toFixed(2)} KB`
                        : `${(message.document.size / 1048576).toFixed(2)} MB`}
                      </p>
                    </div>
                    <img src="/download.png" alt="download" />
                  </a>
                </div>
              )}
              {message.text && <span>{message.text}</span>}
              {message.audio && <audio controls src={message.audio} />}
              
              <span className="time">
                {new Date(parseInt(message.createdAt.seconds) * 1000)
                  .toLocaleTimeString()
                  .substring(0, 5)}
              </span>
            </div>
            
            <div className={message.senderId === currentUser?.id ? "hover-arrow-own" : "hover-arrow"}>
              <img className={message.senderId === currentUser?.id ? "arrowDownBtn-own" : "arrowDownBtn"} onClick={() => showDeleteModal(message.uniqueMessageId)} src="./trash-can.png" alt="arrowDownGray png" />
            </div>
          </div>
        ))}
        <div ref={endRef}></div>
      </div>
      <div className="bottom">
        <div className={`plus-background ${isShowIconsBlock && "clicked"}`}>
          <img
            src="/plus.png"
            className={`plus-icon ${isShowIconsBlock && "plus-anim"}`}
            alt="plus icon"
            onClick={ isCurrentUserBlocked || isReceiverBlocked ? null : showIconsBlock }            
          />
        </div>
        {isShowIconsBlock && (
          <div className="icons">
            <label htmlFor="image">
              <img src="./img-black.png" alt="image of image" />
              <p>Image</p>
            </label>
            <input
              type="file"
              id="image"
              style={{ display: "none" }}
              onChange={handleImg}
              disabled={isCurrentUserBlocked || isReceiverBlocked}
            />
            <label htmlFor="file">
              <img src="./folder-black.png" alt="folder image" />
              <p>Document</p>
            </label>
            <input
              type="file"
              id="file"
              style={{ display: "none" }}
              onChange={handleFile}
              disabled={isCurrentUserBlocked || isReceiverBlocked}
            />
            <label htmlFor="microphone" onClick={showRecordModal}>
              <img
                src="./mic-black.png"
                id="microphone"
                alt="microphone image"
                
              />
              <p>Microphone</p>
            </label>
          </div>
        )}

        <input
          type="text"
          placeholder={
            isCurrentUserBlocked || isReceiverBlocked
            ? "You cannot send a message"
            : "Type a message..."
          }
          onChange={(e) => setText(e.target.value)}
          value={text}
          disabled={isCurrentUserBlocked || isReceiverBlocked}
        />
        <div className="emoji">
          <img
            src="./emoji.png"
            alt="emoji png"
            onClick={() => setOpen((prev) => !prev)}
          />
          <div className="picker">
            <EmojiPicker
              width="100%" height="100%"
              open={open}
              onEmojiClick={ isCurrentUserBlocked || isReceiverBlocked ? null : handleEmoji }
              disabled={isCurrentUserBlocked || isReceiverBlocked}
            />
          </div>
        </div>
        <button
          className="sendButton"
          onClick={handleSend}
          disabled={isCurrentUserBlocked || isReceiverBlocked}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;