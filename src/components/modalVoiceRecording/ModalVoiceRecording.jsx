// import React, { useEffect, useState } from "react";
// import { useChatStore } from "../../lib/chatStore.js";
// import "./modalVoiceRecording.scss";
// import { arrayUnion, doc, getDoc, updateDoc } from "firebase/firestore"
// import { db } from "../../lib/firebase";
// import upload from "../../lib/upload";
// import { useUserStore } from "../../lib/userStore";
// import uploadAudio from "../../lib/uploadAudio.js";

// const ModalVoiceRecording = () => {
//   //   const { currentUser } = useUserStore()
//     const { changeShowModalImageInfo, resetModalGalleryImage, imageInfo, chatId, resetModalImageInfo, user, changeShowModalRecording } = useChatStore()

//   const [isRecording, setIsRecording] = useState(true);
//   const [audio, setAudio] = useState({
//     file: "",
//     url: "",
//   });
//   const [mediaRecorder, setMediaRecorder] = useState(null);
//   const [audioChunks, setAudioChunks] = useState([]);

//   useEffect(() => {
//     console.log("dsfsdfsdfsdr");
    
//     const getAudioStream = async () => {
//       try {
//         const stream = await navigator.mediaDevices.getUserMedia({
//           audio: true,
//         });
//         const recorder = new MediaRecorder(stream);
//         setMediaRecorder(recorder);

//         recorder.ondataavailable = (event) => {
//           setAudioChunks((prevChunks) => [...prevChunks, event.data]);
//         };

//         recorder.onstop = async (isCanceled) => {
//           if (!isCanceled) {
//             const audioBlob = new Blob(audioChunks, { type: "audio/wav" });
//             setAudio({
//                 file: audioBlob,
//                 url: URL.createObjectURL(audioBlob)
//             })
//             console.log("был создан url");
//             uplodAudioMessage()
//           } else {
//             console.log("Запись была просто отменена");
//           }
//         };
//       } catch (err) {
//         console.error("Ошибка доступа к микрофону:", err);
//       }
//     };

//     getAudioStream();
//   }, [audioChunks]);

//   const startRecording = () => {
//     if (mediaRecorder) {
//       setAudioChunks([]);
//       mediaRecorder.start();
//       setIsRecording(true);
//     }
//     else {
//         console.log("startRecording - else");
//     }
//   };

//   const uplodAudioMessage = async () => {
//     try {
//         if (audio) {
//           audioUrl = await uploadAudio(audio);
//           const chatsImgDocRef = doc(db, "chats", chatId);

//           console.log(audioUrl);

//           try {
//             const chatsImgDocSnap = await getDoc(chatsImgDocRef);
//             console.log(chatsImgDocSnap);

//             if (chatsImgDocSnap.exists()) {
//               const data = chatsImgDocSnap.data();
//               console.log(data);

//               await updateDoc(chatsImgDocRef, {
//                 audios: arrayUnion(audioUrl),
//               });
//             } else {
//               console.log("No such document!");
//             }
//           } catch (error) {
//             console.error("Error updating document: ", error);
//           }
//         }
//       } catch (err) {
//         console.log(err);
//       }
//   }

//   const sendRecording = () => {
//     if (mediaRecorder) {
//       mediaRecorder.stop(false);
//       setIsRecording(false);
//     }
//   };

//   const stopRecording = () => {
//     if (mediaRecorder) {
//       mediaRecorder.stop(true);
//       setIsRecording(false);
//     } else {
//         console.log("stopRecording - else");
//     }
//   };

//   return (
//     <div className="background-modal">
//       <div className="modal-image-info">
//         {/* <div className='image-container'>
//             <img className='image' src={imageInfo.url} alt="#" />
//           </div> */}
//         <div className={`recording ${isRecording ? "red" : "blue"}`}>
//           <img src="/mic.png" alt="#" />
//         </div>
//         <button
//           className="btn"
//           onClick={isRecording ? sendRecording : startRecording}
//         >
//           {isRecording ? "Остановить запись" : "Начать запись заново"}
//         </button>
//         <button onClick={stopRecording}>Delete</button>
//         <button onClick={sendRecording}>Send</button>
//         {/* <form className='form'>
//             <input type="text" onChange={(e) => setText(e.target.value)} placeholder='Введите текст, если нужно'/>
//             <button onClick={(e) => handleSend(e)} className='sendButton'>Send</button>
//           </form> */}
//         <img onClick={changeShowModalRecording} className="cross" src="./cross.png" alt="#" />
//       </div>
//     </div>
//   );
// };

// export default ModalVoiceRecording;

////////////////////////////////////////

// import React, { useEffect, useState } from "react";
// import { useChatStore } from "../../lib/chatStore.js";
// import { doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";
// import { db } from "../../lib/firebase";
// import uploadAudio from "../../lib/uploadAudio.js";
// import "./modalVoiceRecording.scss";

// const ModalVoiceRecording = () => {
//   const { changeShowModalRecording, chatId } = useChatStore();
//   const [isRecording, setIsRecording] = useState(false);
//   const [audio, setAudio] = useState({ file: "", url: "" });
//   const [mediaRecorder, setMediaRecorder] = useState(null);
//   const [audioChunks, setAudioChunks] = useState([]);
//   const [stream, setStream] = useState(null);

//   useEffect(() => {
//     const getAudioStream = async () => {
//       try {
//         const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
//         setStream(audioStream);
//         const recorder = new MediaRecorder(audioStream);
//         setMediaRecorder(recorder);

//         recorder.ondataavailable = (event) => {
//           setAudioChunks((prevChunks) => [...prevChunks, event.data]);
//         };

//         recorder.onstop = async () => {
//           const audioBlob = new Blob(audioChunks, { type: "audio/wav" });
//           setAudio({ file: audioBlob, url: URL.createObjectURL(audioBlob) });
//           uploadAudioMessage(audioBlob);
//           // Stop the audio stream after recording
//           audioStream.getTracks().forEach(track => track.stop());
//         };
//       } catch (err) {
//         console.error("Ошибка доступа к микрофону:", err);
//       }
//     };

//     getAudioStream();

//     return () => {
//       // Cleanup audio stream when component unmounts
//       if (stream) {
//         stream.getTracks().forEach(track => track.stop());
//       }
//     };
//   }, [audioChunks]);

//   const startRecording = () => {
//     if (mediaRecorder) {
//       setAudioChunks([]); // Clear any previous audio data
//       mediaRecorder.start();
//       setIsRecording(true);
//     }
//   };

//   const stopRecording = () => {
//     if (mediaRecorder) {
//       mediaRecorder.stop();
//       setIsRecording(false);
//     }
//   };

//   const uploadAudioMessage = async (audioBlob) => {
//     try {
//       const audioUrl = await uploadAudio({ file: audioBlob });
//       const chatsImgDocRef = doc(db, "chats", chatId);
//       const chatsImgDocSnap = await getDoc(chatsImgDocRef);

//       if (chatsImgDocSnap.exists()) {
//         await updateDoc(chatsImgDocRef, {
//           audios: arrayUnion(audioUrl),
//         });
//       } else {
//         console.log("No such document!");
//       }
//     } catch (err) {
//       console.error("Ошибка загрузки аудио:", err);
//     }
//   };

//   return (
//     <div className="background-modal">
//       <div className="modal-image-info">
//         <div className={`recording ${isRecording ? "red" : "blue"}`}>
//           <img src="/mic.png" alt="Microphone" />
//         </div>
//         <button className="btn" onClick={isRecording ? stopRecording : startRecording}>
//           {isRecording ? "Остановить запись" : "Начать запись заново"}
//         </button>
//         <button onClick={stopRecording}>Delete</button>
//         <button onClick={stopRecording}>Send</button>
//         <img onClick={changeShowModalRecording} className="cross" src="./cross.png" alt="Close" />
//       </div>
//     </div>
//   );
// };

// export default ModalVoiceRecording;

///////////////////////////////////////

import React, { useEffect, useState } from "react";
import { useChatStore } from "../../lib/chatStore.js";
import { doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { db } from "../../lib/firebase";
import uploadAudio from "../../lib/uploadAudio.js";
import "./modalVoiceRecording.scss";

const ModalVoiceRecording = () => {
  const { changeShowModalRecording, chatId } = useChatStore();
  const [isRecording, setIsRecording] = useState(false);
  const [audio, setAudio] = useState({ file: "", url: "" });
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [audioChunks, setAudioChunks] = useState([]);
  const [stream, setStream] = useState(null);

  useEffect(() => {
    const getAudioStream = async () => {
      try {
        const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        setStream(audioStream);
        const recorder = new MediaRecorder(audioStream);
        setMediaRecorder(recorder);

        recorder.ondataavailable = (event) => {
          setAudioChunks((prevChunks) => [...prevChunks, event.data]);
        };

        recorder.onstop = async () => {
          const audioBlob = new Blob(audioChunks, { type: "audio/wav" });
          setAudio({ file: audioBlob, url: URL.createObjectURL(audioBlob) });
          uploadAudioMessage(audioBlob);
          // Stop the audio stream after recording
          audioStream.getTracks().forEach(track => track.stop());
        };
      } catch (err) {
        console.error("Ошибка доступа к микрофону:", err);
      }
    };

    getAudioStream();

    return () => {
      // Cleanup audio stream when component unmounts
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [audioChunks]);

  const startRecording = () => {
    if (mediaRecorder) {
      setAudioChunks([]); // Clear any previous audio data
      mediaRecorder.start();
      setIsRecording(true);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      setIsRecording(false);
    }
  };

  const deleteRecording = () => {
    setAudio({ file: "", url: "" });
    setAudioChunks([]);
  };

  const sendRecording = () => {
    if (audio.file) {
      uploadAudioMessage(audio.file);
    }
  };

  const uploadAudioMessage = async (audioBlob) => {
    try {
      const audioUrl = await uploadAudio({ file: audioBlob });
      const chatsImgDocRef = doc(db, "chats", chatId);
      const chatsImgDocSnap = await getDoc(chatsImgDocRef);

      if (chatsImgDocSnap.exists()) {
        await updateDoc(chatsImgDocRef, {
          audios: arrayUnion(audioUrl),
        });
      } else {
        console.log("No such document!");
      }
    } catch (err) {
      console.error("Ошибка загрузки аудио:", err);
    }
  };

  return (
    <div className="background-modal">
      <div className="modal-image-info">
        <div className={`recording ${isRecording ? "red" : "blue"}`}>
          <img src="/mic.png" alt="Microphone" />
        </div>
        <button className="btn" onClick={isRecording ? stopRecording : startRecording}>
          {isRecording ? "Остановить запись" : "Начать запись заново"}
        </button>
        <button onClick={deleteRecording}>Delete</button>
        <button onClick={sendRecording}>Send</button>
        <img onClick={changeShowModalRecording} className="cross" src="./cross.png" alt="Close" />
      </div>
    </div>
  );
};

export default ModalVoiceRecording;


