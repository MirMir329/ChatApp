import { useChatStore } from "./lib/chatStore"
import ModalGallery from "./components/modalWindows/modalGallery/ModalGallery.jsx"
import ChatContainer from "./components/chatContainer/ChatContainer.jsx"
import ModalImageInfo from "./components/modalWindows/modalImageInfo/ModalImageInfo.jsx"
import ModalVoiceRecording from "./components/modalWindows/modalVoiceRecording/ModalVoiceRecording.jsx"
import ModalChangeImage from "./components/modalWindows/modalChangeImage/ModalChangeImage.jsx"
import ModalDeleteMessage from "./components/modalWindows/modalDeleteMessage/ModalDeleteMessage.jsx"
const App = () => {
  const { isShowModalGallery, isShowModalImageInfo, isShowModalRecording, isShowModalChangeImage, isOpenedDeleteWindow } = useChatStore()
  
  return (
    <div className="wrapper">
      <ChatContainer/>

      {isShowModalGallery && (
        <ModalGallery/>
      )}

      {isShowModalImageInfo && (
        <ModalImageInfo/>
      )}

      {isShowModalRecording && (
        <ModalVoiceRecording/>
      )}
      {isShowModalChangeImage && (
        <ModalChangeImage/>
      )}

      {isOpenedDeleteWindow && (
        <ModalDeleteMessage/>
      )}
    </div>
  )
}    
export default App