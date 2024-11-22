import { doc, getDoc } from 'firebase/firestore';
import { create } from 'zustand'
import { db } from './firebase';
import { useUserStore } from './userStore';

export const useChatStore = create((set) => ({
  isShowModalImageInfo: false,
  imageInfo: {},

  isShowInfo: false,
  isShowModalGallery: false,
  modalGalleryImage: "",
  chatId: null,
  user: null,
  isCurrentUserBlocked: false,
  isReceiverBlocked: false,
  changeChat: (chatId, user) => {
    const currentUser = useUserStore.getState().currentUser

    // CHECK IF CURRENT USER IS BLOCKED

    if(user.blocked.includes(currentUser.id)) {
        console.log("isCurrentUserBlocked - true");
        return set({
            chatId,
            user: null,
            isCurrentUserBlocked: true,
            isReceiverBlocked: false,
        })
        
        
        // CHECK IF RECEIVER (получатель) IS BLOCKED
    } else if (currentUser.blocked.includes(user.id)) {
        console.log("isReceiverBlocked - true");
        return set({
            chatId,
            user: user,
            isCurrentUserBlocked: false,
            isReceiverBlocked: true,
        })

    } else {
        return set({
            chatId,
            user: user,
            isCurrentUserBlocked: false,
            isReceiverBlocked: false,
        })
    }
  },
  changeBlock: () => {
    set(state => ({...state, isReceiverBlocked: !state.isReceiverBlocked}))
  },
  changeShowInfo: () => {
    set(state => ({...state, isShowInfo: !state.isShowInfo}))
  },
  changeShowModalGallery: () => {
    set(state => ({...state, isShowModalGallery: !state.isShowModalGallery}))
  },
  changeShowModalImageInfo: () => {
    set(state => ({...state, isShowModalImageInfo: !state.isShowModalImageInfo}))
  },

  setModalGalleryImage: (url) => {
    set(state => ({...state, modalGalleryImage: url, isShowModalGallery: !state.isShowModalGallery}))
  },
  setModalImageInfo: (url) => {
    set(state => ({...state, imageInfo: url, isShowModalImageInfo: !state.isShowModalImageInfo}))
  },

  resetModalGalleryImage: () => {
    set(state => ({...state, imageInfo: ""}))
  },
  resetUser: () => {
    set(state => ({...state, user: null}))
  },
  resetChatId: () => {
    set(state => ({...state, chatId: null}))
  },
  resetIsShowInfo: () => {
    set(state => ({...state, isShowInfo: false}))
  },
  resetModalImageInfo: () => {
    set(state => ({...state, imageInfo: {}}))
  },


}))