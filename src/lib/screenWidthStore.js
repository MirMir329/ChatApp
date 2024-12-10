import { create } from "zustand";

export const useScreenWidthStore = create((set) => ({
    screenWidth: window.innerWidth,
    isMobile: false,
    isMobileLoginBlockLeft: true,
    isMobileLoginBlockRight: false,
    setScreenWidth: (width) => set({ screenWidth: width }),
    
    setIsMobileFalse: () => set({isMobile: false}),
    setIsMobileTrue: () => set({isMobile: true}),

    setIsMobileLoginBlockLeftFalse: () => set({isMobileLoginBlockLeft: false}),
    setIsMobileLoginBlockLeftTrue: () => set({isMobileLoginBlockLeft: true}),

    setIsMobileLoginBlockRightFalse: () => set({isMobileLoginBlockRight: false}),
    setIsMobileLoginBlockRightTrue: () => set({isMobileLoginBlockRight: true}),
}));
