import './Dashboard.css';

import { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../../Context/auth';
import Header from '../../Components/Header';
import { FaFileUpload } from 'react-icons/fa'
import firebase from "../../services/FirebaseConnection"
import { toast } from 'react-toastify';

export default function Dashboard(){

    const { user, getStorage } = useContext(AuthContext);
    
    const [loadingFile, setLoadingFile] = useState(false);
    const [files, setFiles] = useState([]);

    // Call input from file
    function callLoadingFile(){
        const fileInput = document.getElementById("fileInput");
        fileInput.click();
    }

    // Upload the file to the server and store the metadata in firebase
    async function uploadFile(event){
        setLoadingFile(true);
        const file = event.target.files[0];
        
        if (file){
            console.log("Aqui antes")
            const serverId = await sendFile(file);
            console.log("Depois de carregar a API: ", serverId);

            if (serverId){
                let data = {
                    userId: user.uid,
                    serverId: serverId,
                    fileName: file.name,
                    uploadDate: new Date(),
                };
    
                console.log(data);

                await firebase.firestore().collection('files').add(data)
                .then(() => {
                    toast.success("File uploaded successfully")
                    document.getElementById("fileInput").value = "";
                })
                .catch((error) => {
                    toast.error("Something went wrong, unable to upload");
                    document.getElementById("fileInput").value = "";
                })                
            }
            else{
                toast.error("Something went wrong, unable to upload");
                document.getElementById("fileInput").value = "";
            }
        }

        setLoadingFile(false);
    }

    // Calls the API to send the file to the server
    async function sendFile(file) {        
        const storage = await getStorage();
        
        console.log(storage);
        
        return await storage.uploadFile(file);    
    }

    return(
        <div className='body-dashboard'>
            <Header/>        
            <div className='container-dashboard'>
                <button onClick={callLoadingFile}>
                    <FaFileUpload/>    
                    {loadingFile ? "loading..." : "Upload"}
                </button> 
                <input type="file" style={{display: "none"}} id="fileInput" onChange={(e) => uploadFile(e)} />
                <div className='table-area'>
                    {files.length === 0 ?(
                        <span>No files found...</span>
                    ):(
                        <span>Encontrouuuu</span>
                    )}
                </div>
            </div>   
        </div>
    );
}