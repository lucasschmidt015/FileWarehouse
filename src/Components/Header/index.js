import './Header.css';
import { useContext } from 'react';
import { AuthContext } from '../../Context/auth';

import { AiOutlinePoweroff }  from"react-icons/ai";

export default function Header(){

    const { SignOut } = useContext(AuthContext);

    return(
        <div className='header-container'>
            <h1>File Warehouse</h1>
            <button onClick={SignOut}><AiOutlinePoweroff/></button>
        </div>
    );
}


