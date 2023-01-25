import "./SignUp.css"
import { useState } from "react";
import { Link } from "react-router-dom";

export default function SignUp(){
    
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');

    function handleSubmit(e){
    
    }

    return(
        <dib className="container-login">
            <div className='input-area'>
                <form onSubmit={handleSubmit}>
                    <h1>Cadastrar uma conta</h1>
                    <input type="text" onChange={(e) => setNome(e.target.value)} value={nome} placeholder='Seu nome'/>
                    <input type="text" onChange={(e) => setEmail(e.target.value)} value={email} placeholder='email@email.com'/>
                    <input type="password" onChange={(e) => setSenha(e.target.value)} value={senha} placeholder='****'/>
                    <button type='submit'>Cadastrar</button>
                </form>
                <Link to="/" >Já possui uma conta? entre</Link>                
            </div>
        </dib>
    );
}