import React from 'react'
import { useChatStore } from "../../../lib/chatStore.js"
import "./modalGallery.scss"

const ModalGallery = () => {
    const { changeShowModalGallery, modalGalleryImage } = useChatStore()

  return (
    <div className='background'>
        <img onClick={changeShowModalGallery} className='cross' src="./cross.png" alt="#" />
        <div className='modal-gallery'>
            <img src={modalGalleryImage} alt="#" />
        </div>
    </div>
  )
}

export default ModalGallery
