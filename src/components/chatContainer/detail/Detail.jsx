import { doc, onSnapshot } from "firebase/firestore"
import { useEffect, useState } from "react"
import { useChatStore } from "../../../lib/chatStore.js"
import { db } from "../../../lib/firebase.js"
import "./detail.scss"
import UserDetail from "./userDetail/UserDetail.jsx"
import Gallery from "./gallery/Gallery.jsx"

const Detail = () => {

    const { chatId, isShowInfo } = useChatStore();

    const [images, setImages] = useState(null)
    const [imagesSlice, setImagesSlice] = useState(null)
    const [isShowGallery, setIsShowGallery] = useState(false)

    useEffect(() => {
        const unSub = onSnapshot(doc(db, "chats", chatId), async (res) => {
            if(res.data()) {
                console.log(res);
                console.log(res.data());
                console.log(res.data().images);

                setImages(res.data().images)
                setImagesSlice(res.data().images.slice(0, 3))
            }
            
        });

        return () => {
            unSub()
        }
    }, [])

    return (
        <div className="detail">
            {isShowGallery ? (
                <Gallery setIsShowGallery={setIsShowGallery} images={images}/>
                
            ) : (
                <UserDetail setIsShowGallery={setIsShowGallery} images={images} imagesSlice={imagesSlice}/>
            )}
        </div>
    )
}


export default Detail