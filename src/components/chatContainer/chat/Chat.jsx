import { useState, useEffect, useRef } from "react"
import "./chat.scss"
import EmojiPicker from "emoji-picker-react"
import { arrayUnion, doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore"
import { db } from "../../../lib/firebase"
import { useChatStore } from "../../../lib/chatStore"
import { useUserStore } from "../../../lib/userStore"
import upload from "../../../lib/upload"

const Chat = () => {
    
    const [chat, setChat] = useState()
    const [open, setOpen] = useState(false)
    const [text, setText] = useState("")
    const [img, setImg] = useState({
        file: null,
        url: "",

    })  
    const { currentUser } = useUserStore()
    const { chatId, user, isCurrentUserBlocked, isReceiverBlocked, changeShowInfo } = useChatStore()
    
    const date = new Date();

    const endRef = useRef(null)

    useEffect(() => {
        endRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [])

    useEffect(() => {
        const unSub = onSnapshot(doc(db, "chats", chatId), (res) => {
            setChat(res.data())
        })

        return () => {
            unSub();
        }
    }, [chatId])

    const handleEmoji = (e) => {
        setText((prev) => prev + e.emoji)
        setOpen(false)   
    }

    const handleImg = (e) => {
        console.log("12312");
        if(e.target.files[0]) {
            console.log(e.target.files);
            setImg({
                file: e.target.files[0],
                url: URL.createObjectURL(e.target.files[0])
            })
            e.target.value = ''
            console.log("Картинка была отправлена!");
            
        } else {
            console.log("Не получилось!");
            console.log(e.target.files);
            
        }

    }

    const handleSend = async () => {
        if(text === "") return;

        let imgUrl = null

        try {

            if(img.file) {
                imgUrl = await upload(img.file)

                const chatsImgDocRef = doc(db, "chats", chatId);

                try {
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
            })

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
        <div className="chat">
            <div className="top" onClick={changeShowInfo}>
                <div className="user">
                    <img src={user?.avatar || "./avatar.png"} alt="" />
                    <div className="texts">
                        <span>{user?.username}</span>
                        <p>Click here to view contact details</p>
                    </div>
                </div>
                <div className="icons">
                    <img src="./phone.png" alt="" />
                    <img src="./video.png" alt="" />
                    <img src="./info.png" alt="" />
                </div>
            </div>
            <div className="center">
                {chat?.messages?.map(message => (
                    <div className={message.senderId === currentUser?.id ? "message own" : "message"} key={message?.createdAt}>
                        <div className="texts">
                            {message.img && <img 
                                src={message.img} 
                                alt="" 
                            />}
                            <span>
                                {message.text}
                            </span>
                            <span className="time">
                                {new Date(parseInt(message.createdAt.seconds) * 1000).toLocaleTimeString().substring(0, 5)}
                            </span>
                        </div>
                    </div>
                ))}
                <div ref={endRef}></div>
            </div>
            <div className="bottom">
                <div className="icons">
                    <label htmlFor="file">
                        <img src="./img.png" alt="" />
                    </label>
                    <input type="file" id="file" style={{display: "none"}} onChange={handleImg} disabled={isCurrentUserBlocked || isReceiverBlocked}/>
                    <img src="./camera.png" alt="" />
                    <img src="./mic.png" alt="" />
                </div>
                <input type="text" placeholder={(isCurrentUserBlocked || isReceiverBlocked) ? "You cannot send a message" : "Type a message..."} onChange={(e) => setText(e.target.value)} value={text} disabled={isCurrentUserBlocked || isReceiverBlocked}/>
                <div className="emoji">
                    <img src="./emoji.png" alt="" onClick={() => setOpen((prev) => !prev)}/>
                    <div className="picker">
                        <EmojiPicker open={open} onEmojiClick={handleEmoji} disabled={isCurrentUserBlocked || isReceiverBlocked}/>
                    </div>
                    
                </div>
                <button className="sendButton" onClick={handleSend} disabled={isCurrentUserBlocked || isReceiverBlocked}>
                    Send
                </button>
            </div>
        </div>
    )
}


export default Chat