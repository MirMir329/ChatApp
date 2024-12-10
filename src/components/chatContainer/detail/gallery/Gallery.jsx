import React from 'react'
import "./gallery.scss"
import { useChatStore } from "../../../../lib/chatStore.js"

const Gallery = ({images, setIsShowGallery, typeOfDallery, documentsArr}) => {
    const { setModalGalleryImage } = useChatStore()

    return (
        <div className='gallery'>
            <div className="user-title">
                <img onClick={() => setIsShowGallery(false)}  src="./cross.png" alt="#"/>
                <span>Contact details</span>
            </div>
            {typeOfDallery === "photos" ? (
                <div className="photos">
                    {images.map((photo) => (
                        <img key={photo} onClick={() => setModalGalleryImage(photo)} className='photo' src={photo} alt="photo gallery" />
                    ))}
                </div>
            ) : (
                <div className="files">
                    {documentsArr?.map((doc) => (
                    <div className="doc" key={doc.url}>
                        <a
                        href={doc.url}
                        target="_blank"
                        download={doc.name}
                        rel="noopener noreferrer"
                        >
                        <img className="icon" src="/google-docs (1).png" alt="icon png" />
                        <div>
                            <p>{doc.name}</p>
                            <p>
                            {doc.size < 1024
                                ? `${doc.size} bytes`
                                : doc.size < 1048576
                                ? `${(doc.size / 1024).toFixed(2)} KB`
                                : `${(doc.size / 1048576).toFixed(2)} MB`
                            }
                            </p>
                        </div>
                        <img src="/download.png" alt="download" />
                        </a>
                    </div>
                    ))}
                </div>
            )}
            <div className="photos">
                {images.map((photo) => (
                    <img key={photo} onClick={() => setModalGalleryImage(photo)} className='photo' src={photo} alt="#" />
                ))}
            </div>
        </div>
    )
}

export default Gallery