import './Dashboard.css';

import { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../../Context/auth';
import Header from '../../Components/Header';
import { FaFileUpload, FaTrash } from 'react-icons/fa'
import firebase from "../../services/FirebaseConnection"
import { toast } from 'react-toastify';
import { AiOutlineDownload } from 'react-icons/ai'

import { format } from 'date-fns';

export default function Dashboard(){

    const { user, getStorage } = useContext(AuthContext);
    
    const [loadingFile, setLoadingFile] = useState(false);
    const [files, setFiles] = useState([{userId: "GASFA-FASDW", serverId: "sfsdf", fileName: "photoExample", uploadDate: new Date()}, {userId: "GASFA-FASDW", serverId: "fasfafs", fileName: "FileExample2", uploadDate: new Date()}]);

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

    function deleteFile(idServer){
        alert(idServer)
    }

    function downloadFile(idServer){
        alert(idServer);
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
                        <>
                            <table>
                                <thead>
                                    <tr>
                                        <th scope='Col'>Name</th>
                                        <th scope='Col'>Updated</th>
                                        <th scope='Col'>#</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {files.map((item, index) => {
                                        return(
                                            <tr key={index}>
                                                <td data-Label="Name">{item.fileName}</td>
                                                <td data-Label="Date">{format(item.uploadDate, 'dd/MM/yyyy')}</td>
                                                <td>
                                                    <span id="trash" onClick={() => deleteFile(item.serverId)} className='action'><FaTrash/></span>
                                                    <span id='download' onClick={() => downloadFile(item.serverId)} className='action'><AiOutlineDownload/></span>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </>
                    )}
                </div>
            </div>   
        </div>
    );
}