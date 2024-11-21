import { useChatStore } from "./lib/chatStore"
import ModalGallery from "./components/modalGallery/ModalGallery.jsx"
import ChatContainer from "./components/chatContainer/ChatContainer.jsx"
import ModalImageInfo from "./components/modalImageInfo/ModalImageInfo.jsx"

const App = () => {
  const { isShowModalGallery, isShowModalImageInfo } = useChatStore()

  return (
    <div className="wrapper">
      <ChatContainer/>

      {isShowModalGallery && (
        <ModalGallery/>
      )}

      {isShowModalImageInfo && (
        <ModalImageInfo/>
      )}

    </div>

    
  )
}

export default App