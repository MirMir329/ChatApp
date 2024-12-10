// import { doc, getDoc } from "firebase/firestore";
import { create } from "zustand";
// import { db } from "./firebase";
import { useUserStore } from "./userStore";

export const useChatStore = create((set) => ({
  isShowModalImageInfo: false,
  imageInfo: {},
  isRemove: false,
  //
  isOpenedDeleteWindow: false,
  messageId: "",
    //
    isShowInfo: false,
    //
    isShowModalGallery: false,
    modalGalleryImage: "",
    //
    isShowModalRecording: false,
    // modalRecordingMessage: "",
    //
    isShowModalChangeImage: false,
    modalChangeImage: {},
      //
  chatId: null,
  user: null,
  isCurrentUserBlocked: false,
  isReceiverBlocked: false,
  
  changeChat: (chatId, user) => {
    const currentUser = useUserStore.getState().currentUser;

    // CHECK IF CURRENT USER IS BLOCKED

    if (user.blocked.includes(currentUser.id)) {
      console.log("isCurrentUserBlocked - true");
      return set({
        chatId,
        user: null,
        isCurrentUserBlocked: true,
        isReceiverBlocked: false,
        //
        isRemove: false
      });

      // CHECK IF RECEIVER (получатель) IS BLOCKED
    } else if (currentUser.blocked.includes(user.id)) {
      console.log("isReceiverBlocked - true");
      return set({
        chatId,
        user: user,
        isCurrentUserBlocked: false,
        isReceiverBlocked: true,
        //
        isRemove: false
      });
    } else {
      return set({
        chatId,
        user: user,
        isCurrentUserBlocked: false,
        isReceiverBlocked: false,
        //
        isRemove: false
      });
    }
  },

  changeBlock: () => {
    set((state) => ({ ...state, isReceiverBlocked: !state.isReceiverBlocked }));
  },
  changeShowInfo: () => {
    set((state) => ({ ...state, isShowInfo: !state.isShowInfo }));
  },
  changeShowModalGallery: () => {
    set((state) => ({
      ...state,
      isShowModalGallery: !state.isShowModalGallery,
    }));
  },
  changeShowModalImageInfo: () => {
    set((state) => ({
      ...state,
      isShowModalImageInfo: !state.isShowModalImageInfo,
    }));
  },
  changeShowModalRecording: () => {
    set((state) => ({
      ...state,
      isShowModalRecording: !state.isShowModalRecording,
    }));
  },
  // не работает !state.isShowModalChangeImage
  changeShowModalChangeImage: (value) => {
    set((state) => ({...state, isShowModalChangeImage: value,})); 
  },
  changeIsOpenedDeleteWindow: () => {
    set((state) => ({...state, isOpenedDeleteWindow: !state.isOpenedDeleteWindow}))
  },

  //
  setModalGalleryImage: (url) => {
    set((state) => ({
      ...state,
      modalGalleryImage: url,
      isShowModalGallery: !state.isShowModalGallery,
    }));
  },
  setModalImageInfo: (url) => {
    set((state) => ({
      ...state,
      imageInfo: url,
      isShowModalImageInfo: !state.isShowModalImageInfo,
    }));
  },
  setModalChangeImage: (url) => {
    set((state) => ({
      ...state,
      modalChangeImage: url,
      isShowModalChangeImage: !state.isShowModalChangeImage,
    }));
  },
  setMessageId: (id) => {
    set((state) => ({
      ...state, messageId: id
    }))
  },
  // setModalRecordingMessage: (url) => {
  //   set(state => ({...state, modalRecordingMessage: url, isShowModalRecording: !state.isShowModalRecording}))
  // },

  //
    // посмотреть разницу
  // resetModalGalleryImage: () => {
  //   set((state) => ({ ...state, imageInfo: "" }));
  // },
  resetUser: () => {
    set((state) => ({ ...state, user: null }));
  },
  resetChatId: () => {
    set((state) => ({ ...state, chatId: null }));
  },
  resetIsShowInfo: () => {
    set((state) => ({ ...state, isShowInfo: false }));
  },
  resetShowInfo: () => {
    set((state) => ({ ...state, isShowInfo: false }));
  },
  resetModalImageInfo: () => {
    set((state) => ({ ...state, imageInfo: {} }));
  },
  resetModalChangeImage: () => {
    set((state) => ({ ...state, modalChangeImage: {} }));
  },
  resetMessageId: () => {
    set((state) => ({
      ...state, messageId: ""
    }))
  },


  removeChat: () => {
    set((state) => ({ ...state, isRemove: true}))
  }
  
}));