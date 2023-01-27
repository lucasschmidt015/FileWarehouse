import './Dashboard.css';

import { useContext } from 'react';
import { AuthContext } from '../../Context/auth';

export default function Dashboard(){

    const { SignOut } = useContext(AuthContext);

    return(
        <div className='background-screen'>
            <button onClick={SignOut}>Sair</button>
        </div>
    );
}