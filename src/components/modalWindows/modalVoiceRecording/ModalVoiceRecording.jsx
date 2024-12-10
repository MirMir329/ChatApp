import React, { useRef, useState } from "react";
import { useChatStore } from "../../../lib/chatStore.js";
import { doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { db } from "../../../lib/firebase.js";
import uploadAudio from "../../../lib/uploadAudio.js";
import "./modalVoiceRecording.scss";
import { useUserStore } from "../../../lib/userStore.js";
import { v4 as uuidv4 } from 'uuid';

const ModalVoiceRecording = () => {
  const { changeShowModalRecording, chatId, user } = useChatStore();
  const { currentUser } = useUserStore();

  const [isRecording, setIsRecording] = useState(false);
  const [audio, setAudio] = useState({ file: "", url: "" });
  const mediaRecorderRef = useRef(null); // Ссылка на MediaRecorder
  const audioChunksRef = useRef([]);
  const [loading, setLoading] = useState(false)

  const startRecording = async (e) => {
    e.preventDefault();
    try {
      const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      // setStream(audioStream);
      const mediaRecorder = new MediaRecorder(audioStream);
      // setMediaRecorder(recorder);

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        setAudio({ file: audioBlob, url: URL.createObjectURL(audioBlob) });

        audioChunksRef.current = [];

        // Stop the audio stream after recording
        // audioStream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.start();
      setIsRecording(true); // Обновляем статус записи

    } catch (err) {
      console.error("Ошибка доступа к микрофону:", err);
    }
  };

  const stopRecording = (e) => {
    e.preventDefault();
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop(); // Останавливаем запись
      setIsRecording(false); // Обновляем статус записи
    }
  };

  // const downloadAudio = (e) => {
  //   e.preventDefault();
  //   const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
  //   const url = URL.createObjectURL(audioBlob);
  //   const a = document.createElement('a');
  //   a.href = url;
  //   a.download = 'recording.wav';
  //   a.click();
  // };

  const sendAudioMessage = async (e) => {
    e.preventDefault();
    setLoading(true)

    const uniqueMessageId = uuidv4();

    try {
      const audioUrl = await uploadAudio( audio.file );

      await updateDoc(doc(db, "chats", chatId), {
        messages: arrayUnion({
          senderId: currentUser.id,
          createdAt: new Date(),
          uniqueMessageId: uniqueMessageId,
          audio: audioUrl
        }),
      });

      const userIDs = [currentUser.id, user.id];

      userIDs.forEach(async (id) => {
        const userChatsRef = doc(db, "userchats", id);
        const userChatsSnapsShot = await getDoc(userChatsRef);

        if (userChatsSnapsShot.exists()) {
          const userChatsData = userChatsSnapsShot.data();

          const chatIndex = userChatsData.chats.findIndex(
            (c) => c.chatId === chatId
          );

          userChatsData.chats[chatIndex].lastMessage = "Audio message";
          userChatsData.chats[chatIndex].isSeen =
            id === currentUser.id ? true : false;
          userChatsData.chats[chatIndex].updatedAt = Date.now();

          await updateDoc(userChatsRef, {
            chats: userChatsData.chats,
          });
        }
      });
      changeShowModalRecording()

    } catch (err) {
      console.error("Ошибка загрузки аудио:", err);
    } finally {
      setLoading(false)
    }
  };

  return (
    <div className="background-modal">
      <form onSubmit={(e) => sendAudioMessage(e)} className="modal-record">
        <div className={`recording ${isRecording ? "red" : "blue"}`}>
          <img src="/mic.png" alt="Microphone" />
        </div>
        {isRecording ? (
          <button disabled={loading} className="btn" onClick={(e) => stopRecording(e)}>{loading ? "Loading" : "Stop recording"}</button>
        ) : (
          <button disabled={loading} className="btn" onClick={(e) => startRecording(e)}>{loading ? "Loading" : "Start recording"}</button>
        )}
        {audio.url && (
          <div className="check-audio">
            <audio controls src={audio.url} />
            {/* <button disabled={loading} className="btn" onClick={(e) => downloadAudio(e)}>{loading ? "Loading" : "Скачать запись"}</button> */}
          </div>
        )}
        <button type="submit" disabled={loading || isRecording} className="btn"> {loading ? "Loading" : isRecording ? "Recording" : "Send"}</button>
        <img onClick={changeShowModalRecording} className="cross" src="./cross.png" alt="Close" />
      </form>
    </div>
  );
};

export default ModalVoiceRecording;


