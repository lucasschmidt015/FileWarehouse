import './Header.css';
import { useContext } from 'react';
import { AuthContext } from '../../Context/auth';

export default function Header(){

    const { SignOut } = useContext(AuthContext);

    return(
        <div className='header-container'>
            <button onClick={SignOut}>Sign Out</button>
        </div>
    );
}


