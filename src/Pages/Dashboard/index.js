import './Dashboard.css';

import { useContext } from 'react';
import { AuthContext } from '../../Context/auth';
import Header from '../../Components/Header';
import { FaFileUpload } from 'react-icons/fa'

export default function Dashboard(){

    function uploadFile(){
        const formData = new FormData();

        formData.append("file");
    }

    return(
        <div className='body-dashboard'>
            <Header/>        
            <div className='container-dashboard'>
                <button onClick={uploadFile}>
                    <FaFileUpload/>    
                    Upload
                </button> 
            </div>   
        </div>
    );
}