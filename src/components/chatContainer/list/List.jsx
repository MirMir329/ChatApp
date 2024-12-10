import "./list.scss"
import UserInfo from "./userInfo/UserInfo"
import ChatList from "./chatList/ChatList"
import { useChatStore } from "../../../lib/chatStore.js"
import AboutUser from "./aboutUser/AboutUser.jsx"
import { useEffect, useState } from "react"
import { useScreenWidthStore } from "../../../lib/screenWidthStore.js"

const List = () => {

    const { isRemove } = useChatStore();

    const [isShowUserDetails, setIsShowUserDetails] = useState(false)

    const { setScreenWidth, isMobile, screenWidth } = useScreenWidthStore(); // Извлекаем из стора

    const handleResize = () => {
        setScreenWidth(window.innerWidth); // Обновляем состояние в zustand
        
    };

    useEffect(() => {
        // Подписка на событие resize
        window.addEventListener('resize', handleResize);

        // Функция очистки, которая будет вызвана при размонтировании компонента
        return () => {
        window.removeEventListener('resize', handleResize); // Убираем слушатель
        };
    }, []); // Пустой массив зависимостей означает, что эффект выполнится один раз при монтировании

    return (
        <div className={`list ${!isRemove && isMobile && screenWidth < 800 && "remove"}`}>
            
            {isShowUserDetails ? (
                <AboutUser setIsShowUserDetails={setIsShowUserDetails}/>
            ) : (
                <>
                    <UserInfo setIsShowUserDetails={setIsShowUserDetails}/>
                    <ChatList/>
                </>
            )}
        </div>
    )
}


export default List