import { arrayRemove, arrayUnion, doc, updateDoc } from "firebase/firestore"
import { useChatStore } from "../../../../lib/chatStore.js"
import { db } from "../../../../lib/firebase.js"
import { useUserStore } from "../../../../lib/userStore.js"
import "./userDetail.scss"

const Detail = ({imagesSlice, setIsShowGallery, images}) => {

    const { user, isCurrentUserBlocked, isReceiverBlocked, changeBlock, changeShowInfo } = useChatStore();
    const { currentUser } = useUserStore();

    const handleBlock = async () => {
        if(!user) return

        const userDocRef = doc(db, "users", currentUser.id)

        try {
           await updateDoc(userDocRef, {
               blocked: isReceiverBlocked ? arrayRemove(user.id) : arrayUnion(user.id)
           });
           changeBlock()
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <div className="user-detail">
            
            <div className="user-title">
                <img onClick={changeShowInfo}  src="./cross.png" alt="#"/>
                <span>Contact details</span>
            </div>
            <div className="user">
                <img src={user?.avatar || "./avatar.png"} alt="" />
                <h2>{user?.username}</h2> 
            </div>
            <div className="user-info">
                <p>Information</p>
                <p>Lorem ipsum dolor, sit amet consectetur!</p>
            </div>
            <div className="info">
                <div className="option">
                    <div className="title">
                        <span>Chat Settings</span>
                        <img src="./arrowRight.png" alt="" />
                    </div>
                </div>
                <div className="option">
                    <div className="title">
                        <span>Chat Settings</span>
                        <img src="./arrowRight.png" alt="" />
                    </div>
                </div>
                <div className="option">
                    <div className="title">
                        <span>Privacy & Help</span>
                        <img src="./arrowRight.png" alt="" />
                    </div>
                </div>
                <div className="option">
                    <div className="title">
                        <span>Shared photos</span>
                        <div className="for-title" >
                            <span>{images?.length}</span>
                            <img onClick={() => setIsShowGallery(true)} src="./arrowRight.png" alt="" />
                        </div>
                    </div>
                    <div className="photos">
                        {imagesSlice?.map((photo) => (
                            <div className="photoItem" key={photo}>
                                <div className="photoDetail">
                                    <img src={photo} alt="" />
                                    {/* <span>{photo}</span> */}
                                </div>
                                {/* <img src="./download.png" alt="" className="icon"/> */}
                            </div>
                        ))}
                    </div>
                </div>
                <div className="option">
                    <div className="title">
                        <span>Shared Files</span>
                        <img src="./arrowUp.png" alt="" />
                    </div>
                </div>
                <button onClick={handleBlock}>
                    {isCurrentUserBlocked 
                        ? "You are Blocked!" 
                        : isReceiverBlocked 
                        ? "User Blocked" 
                        : "Block User"
                    }
                </button>
            </div>
        </div>
    )
}


export default Detail