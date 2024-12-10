
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { storage } from "./firebase";

const uploadAudio = async (file) => {
    console.log(file);
    const timestamp = Date.now(); // используем уникальную метку времени
    const storageRef = ref(storage, `audio/${timestamp}-${file.size}`);
    
    const uploadTask = uploadBytesResumable(storageRef, file);

    return new Promise((resolve, reject) => {
        uploadTask.on(
            'state_changed', 
            (snapshot) => {
                // Вы можете добавить отображение прогресса загрузки, если нужно
            }, 
            (error) => {
                console.error("Ошибка загрузки:", error);
                reject("Что-то пошло не так при загрузке файла");
            }, 
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    resolve(downloadURL);  // Возвращаем URL для использования
                }).catch((error) => {
                    reject("Ошибка получения URL файла");
                });
            }
        );        
    });
}

export default uploadAudio;
