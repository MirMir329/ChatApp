import React from 'react'
import "./gallery.scss"
import { useChatStore } from "../../../../lib/chatStore.js"

const Gallery = ({images, setIsShowGallery}) => {

    const { setModalGalleryImage } = useChatStore()

    return (
        <div className='gallery'>
            <div className="user-title">
                <img onClick={() => setIsShowGallery(false)}  src="./cross.png" alt="#"/>
                <span>Contact details</span>
            </div>
            <div className="photos">
                {images.map((photo) => (
                    <img key={photo} onClick={() => setModalGalleryImage(photo)} className='photo' src={photo} alt="#" />
                ))}
            </div>
        </div>
    )
}

export default Gallery