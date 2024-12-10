import { arrayUnion, collection, doc, getDocs, query, serverTimestamp, setDoc, updateDoc, where } from "firebase/firestore"
import "./addUser.scss"
import { db } from "../../../../../lib/firebase"
import { useState } from "react"
import { useUserStore } from "../../../../../lib/userStore"

const AddUser = ({chats, setAddMode}) => {

    const [user, setUser] = useState(null)
    const [isExistUser, setIsExistUser] = useState(false)
    const [isSameUser, setIsSameUser] = useState(false)
    const [isNothingFound, setIsNothingFound] = useState(false)
    
    const { currentUser } = useUserStore()

    const handleSearch = async (e) => {
        setUser(null)
        e.preventDefault()
        const formData = new FormData(e.target)
        const uniqueId = formData.get("uniqueId")

        try {
            const userRef = collection(db, "users");
            const foundedUser = query(userRef, where("uniqueId", "==", uniqueId));
            const querySnapShot = await getDocs(foundedUser)

            setIsExistUser(false)
            setIsSameUser(false)
            setIsNothingFound(false)

            if(!querySnapShot.empty) {
                console.log(querySnapShot);
                console.log(querySnapShot.docs);
                console.log(querySnapShot.docs[0].data());

                setUser(querySnapShot.docs[0].data())                
                const findExistUser = chats.find((chat) => {
                    return chat.receiverId === querySnapShot.docs[0].data().id
                })
                const checkSameUser = currentUser.id === querySnapShot.docs[0].data().id  
                
                if (findExistUser) {
                    setIsExistUser(true)
                    console.log("Этот пользователь уже добавлен в контакты!");
                } else if (checkSameUser) {
                    setIsSameUser(true)
                }
            } else {
                setIsNothingFound(true)
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
            <input type="text" placeholder="Unique ID" name="uniqueId"/>
            <button>Search</button>
            </form>
            {user && (
                <div className="user">
                    
                    {(!isExistUser && !isSameUser) && (
                        <>
                            <div className="detail">
                                <img src={user?.avatar || "./avatar.png"} alt=""/>
                                <span>{user?.username}</span>
                            </div>
                            <button onClick={handleAdd}>Add User</button>
                        </>
                    )}

                    {isExistUser && (
                        <>
                            <div className="detail">
                                <img src={user?.avatar || "./avatar.png"} alt=""/>
                                <span>{user?.username}</span>
                            </div>
                            <span className="grey">This user is already in your contacts!</span>
                        </>
                    )}

                    {isSameUser && (
                        <>
                            <div className="detail">
                                <img src={user?.avatar || "./avatar.png"} alt=""/>
                                <span>{user?.username}</span>
                            </div>
                            <span className="grey">This user is you!</span>
                        </>
                    )}                                       
                </div>
            )}
            
            {isNothingFound && (
                <div className="not-found">
                    <span className="grey">User not found :(</span>
                </div>               
            )}
        </div>
    )
}

export default AddUser
                