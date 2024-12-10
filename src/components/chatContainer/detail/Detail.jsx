import { doc, onSnapshot } from "firebase/firestore"
import { useEffect, useState } from "react"
import { useChatStore } from "../../../lib/chatStore.js"
import { db } from "../../../lib/firebase.js"
import "./detail.scss"
import UserDetail from "./userDetail/UserDetail.jsx"
import Gallery from "./gallery/Gallery.jsx"

const Detail = () => {
    const { chatId, isRemove } = useChatStore();

    const [images, setImages] = useState(null)
    const [imagesSlice, setImagesSlice] = useState(null)

    const [documentsArr, setDocumentsArr] = useState(null)
    const [documentsArrSlice, setDocumentsArrSlice] = useState(null)

    const [isShowGallery, setIsShowGallery] = useState(false)
    const [typeOfDallery, setTypeOfDallery] = useState("")

    useEffect(() => {
        const unSubImages = onSnapshot(doc(db, "chats", chatId), async (res) => {
            if(res.data()) {
                // console.log(res);
                // console.log(res.data());
                // console.log(res.data().images);

                if (res.data().images) {
                    setImages(res.data().images)
                    setImagesSlice(res.data().images.slice(0, 3))
                }

                if (res.data().documents) {
                    setDocumentsArr(res.data().documents)
                    setDocumentsArrSlice(res.data().documents.slice(0, 3))
                }               
            }
        });
        return () => {
            unSubImages()
        }
    }, [])

    return (
        <div className={`main-detail ${isRemove && "remove"}`}>
            {isShowGallery ? (
                <Gallery typeOfDallery={typeOfDallery} setIsShowGallery={setIsShowGallery} images={images} documentsArr={documentsArr}/>
                
            ) : (
                <UserDetail setTypeOfDallery={setTypeOfDallery} setIsShowGallery={setIsShowGallery} documentsArr={documentsArr} documentsArrSlice={documentsArrSlice} images={images} imagesSlice={imagesSlice}/>
            )}
            </div>
        )
    }
    
    
export default Detail