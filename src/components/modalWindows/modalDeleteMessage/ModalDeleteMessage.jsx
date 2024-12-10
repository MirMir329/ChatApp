import React, { useState } from "react";
import { useChatStore } from "../../../lib/chatStore.js";
import "./modalDeleteMessage.scss";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../../lib/firebase";

const ModalDeleteMessage = () => {
  const { changeIsOpenedDeleteWindow, chatId, messageId, resetMessageId} = useChatStore();

  const [loading, setLoading] = useState(false)

  const handleSend = async (e) => {
    e.preventDefault();
    setLoading(true)

    const deleteMessageRef = doc(db, "chats", chatId); // Укажите правильный путь к документу

    try {
        const deleteMessageRefSnap = await getDoc(deleteMessageRef);

        if (deleteMessageRefSnap.exists()) {
            const data = deleteMessageRefSnap.data();
            const messages = data.messages || [];
            console.log(messages);

            console.log(messageId);
            

            const updatedMessages = messages.filter(message => message.uniqueMessageId !== messageId);

            console.log(updatedMessages);
            
            await updateDoc(deleteMessageRef, {
                messages: updatedMessages
            });
        } else {
            console.log("Chat not found!");
        }

    } catch (err) {
      console.log(err);
    }
    finally {
      setLoading(false)
      changeIsOpenedDeleteWindow()
      resetMessageId();
    }
  };

  return (
    <div className="background-modal">
      <div className="modal-delete-message">
        <h2>Are you sure you want to delete this message?</h2>

        <div className="btns-container">
            <button onClick={handleSend} disabled={loading} className="confirmButton btn">
                {loading ? "Loading..." : "Confirm"}
            </button>

            <button onClick={changeIsOpenedDeleteWindow} disabled={loading} className="cancelButton btn">
                {loading ? "Loading..." : "Cancel"}
            </button>
        </div>

      </div>
    </div>
  );
};

export default ModalDeleteMessage;
