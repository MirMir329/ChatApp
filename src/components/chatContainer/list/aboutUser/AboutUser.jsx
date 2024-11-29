import React from 'react'
import "./aboutUser.scss"
// import { useChatStore } from "../../../../lib/chatStore.js"

const AboutUser = ({ setIsShowUserDetails }) => {

    // const { setModalGalleryImage } = useChatStore()

    return (
        <div className='about-user-block'>
            <div className="user-title">
                <img onClick={() => setIsShowUserDetails(false)}  src="./cross.png" alt="#"/>
                {/* <span>Contact details</span> */}
            </div>
            <div className="user-about">
                <div className="image-container">
                    <div className="img-background">
                        <div className = "a"></div>
                        <img src="/avatar.png" alt="#"/>
                    </div>
                    
                </div>
                

                <div className="line">
                    <h3>Name</h3>
                    <p>...</p>
                </div>

                <div className="line">
                    <h3>Description</h3>
                    <p>...</p>
                </div>
            </div>
        </div>
    )
}

export default AboutUser