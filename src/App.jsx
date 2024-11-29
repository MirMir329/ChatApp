import { useChatStore } from "./lib/chatStore"
import ModalGallery from "./components/modalGallery/ModalGallery.jsx"
import ChatContainer from "./components/chatContainer/ChatContainer.jsx"
import ModalImageInfo from "./components/modalImageInfo/ModalImageInfo.jsx"
import ModalVoiceRecording from "./components/modalVoiceRecording/ModalVoiceRecording.jsx"

const App = () => {
  const { isShowModalGallery, isShowModalImageInfo, isShowModalRecording } = useChatStore()

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

    </div>

    
  )
}

export default App