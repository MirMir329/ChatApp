import { doc, getDoc } from 'firebase/firestore';
import { create } from 'zustand'
import { db } from './firebase';

export const useUserStore = create((set) => ({
  currentUser: null,
  isLoading: true,
  fetchUserInfo: async (uid) => {
    if(!uid) {
      console.log("Сработал первый if(!uid) fetchUserInfo");
      return set({currentUser: null, isLoading: false});
    } 

    try {
        // console.log(uid);
        
        const docRef = doc(db, "users", uid);
        const docSnap = await getDoc(docRef);
        // console.log(docSnap);
        // console.log(docSnap.exists());

        if (docSnap.exists()) {
          // console.log("Сработал второй if(docSnap.exists()) fetchUserInfo");
          set({ currentUser: docSnap.data(), isLoading: false })
        } else {
          // console.log("Сработал второй if, но else fetchUserInfo");
          set({ currentUser: null, isLoading: false })
        }
        
      } catch (error) {
          console.log(error);
          return set({currentUser: null, isLoading: false});
      }
    },
    setCurrentUser: (data) => {
      set(state => ({...state, currentUser: data}))
    },
    resetCurrentUser: () => {
      set(state => ({...state, currentUser: null}))
    }
  }))