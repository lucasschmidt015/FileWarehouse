import './SignIn.css'
import { Link } from 'react-router-dom';
import { useState } from 'react';

export default function SignIn(){

    const [email, setEmail ] = useState('');
    const [senha, setSenha] = useState('');


    function handleSubmit(e){
        e.preventDefault();
        alert("Is working");
    }

    return(
        <dib className="container-login">
            <div className='input-area'>
                <form onSubmit={handleSubmit}>
                    <h1>Entrar</h1>
                    <input type="text" onChange={(e) => setEmail(e.target.value)} value={email} placeholder='email@email.com'/>
                    <input type="password" onChange={(e) => setSenha(e.target.value)} value={senha} placeholder='****'/>
                    <button type='submit'>Acessar</button>
                </form>

                <Link to="/signup" >Criar uma conta</Link>
            </div>
        </dib>
    );
}