// import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
// import { storage } from "./firebase";

// const uploadAudio = async (file) => {
//     const date = new Date()
//     console.log(file);
    
//     const storageRef = ref(storage, `audio/${date + file.name}`);

//     const uploadTask = uploadBytesResumable(storageRef, file);


//     return new Promise((resolve, reject) => {
//         uploadTask.on(
//             'state_changed', 
//             (snapshot) => {
//                 const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
//                 // console.log('Upload is ' + progress + '% done');
//                 // switch (snapshot.state) {
//                 // case 'paused':
//                 //     console.log('Upload is paused');
//                 //     break;
//                 // case 'running':
//                 //     console.log('Upload is running');
//                 //     break;
//                 // }
//             }, 
//             (error) => {
//                 reject("Something went wrong!" + error.code)
//             }, 
//             () => {
//                 getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
//                     resolve(downloadURL)
//                 });
//             }
//         );        
//     })
    
// }

// export default uploadAudio


////////////////////////

import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { storage } from "./firebase";

const uploadAudio = async (file) => {
    const timestamp = Date.now(); // используем уникальную метку времени
    const storageRef = ref(storage, `audio/${timestamp}-${file.name}`);

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


