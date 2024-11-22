import { arrayUnion, collection, doc, getDocs, query, serverTimestamp, setDoc, updateDoc, where } from "firebase/firestore"
import "./addUser.scss"
import { db } from "../../../../../lib/firebase"
import { useState } from "react"
import { useUserStore } from "../../../../../lib/userStore"

const AddUser = ({chats, setAddMode}) => {

    const [user, setUser] = useState(null)
    const [isExistUser, setIsExistUser] = useState(false)
    const [isSameUser, setIsSameUser] = useState(false)

    const { currentUser } = useUserStore()

    const handleSearch = async (e) => {
        e.preventDefault()
        const formData = new FormData(e.target)
        const username = formData.get("username")

        try {
            const userRef = collection(db, "users");
            const q = query(userRef, where("username", "==", username));
            const querySnapShot = await getDocs(q)
            if(!querySnapShot.empty) {
                setUser(querySnapShot.docs[0].data())

                console.log(querySnapShot.docs[0].data());
                

                const findExistUser = chats.find((chat) => {
                    return chat.receiverId === querySnapShot.docs[0].data().id
                })

                const checkSameUser = currentUser.id === querySnapShot.docs[0].data().id

                setIsExistUser(false)
                setIsSameUser(false)

                if (findExistUser) {
                    setIsExistUser(true)
                    console.log("Этот пользователь уже добавлен в контакты!");
                } else if (checkSameUser) {
                    setIsSameUser(true)
                }
            }

        } catch (err) {
            console.log(err);
        }
    }

    const handleAdd = async () => {

        const chatRef = collection(db, "chats")
        const userChatsRef = collection(db, "userchats")

        try {
            const newChatRef = doc(chatRef)

            await setDoc(newChatRef, {
                createdAt: serverTimestamp(),
                images: [],
                messages: [],
            });

            await updateDoc(doc(userChatsRef, user.id), {
                chats:arrayUnion({
                    chatId: newChatRef.id,
                    lastMessage: "",
                    receiverId: currentUser.id,
                    updatedAt: Date.now(),
                })
            })

            await updateDoc(doc(userChatsRef, currentUser.id), {
                chats:arrayUnion({
                    chatId: newChatRef.id,
                    lastMessage: "",
                    receiverId: user.id,
                    updatedAt: Date.now(),
                })
            })

            console.log(newChatRef.id);

            setAddMode((prev) => !prev)
            
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <div className="addUser">
            <form onSubmit={handleSearch}>
                <input type="text" placeholder="Username" name="username"/>
                <button>Search</button>
            </form>
            {user && (
                <div className="user">
                    <div className="detail">
                        <img src={user.avatar || "./avatar.png"} alt=""/>
                        <span>{user.username}</span>
                    </div>

                    {!isExistUser && !isSameUser && (
                        <button onClick={handleAdd}>Add User</button>
                    )}

                    {isExistUser && (
                        <span className="grey">Этот пользователь уже в ваших контактах!</span>
                    )}

                    {isSameUser && (
                        <span className="grey">Этот пользователь вы!</span>
                    )}
                    
                </div>
            )}
            
        </div>
    )
}

export default AddUser