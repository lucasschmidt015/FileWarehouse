import "./SignUp.css"
import { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../Context/auth";

export default function SignUp(){

    const { SignUp } = useContext(AuthContext);
    
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');

    function handleSubmit(e){
        e.preventDefault();

        SignUp(email, senha, nome);
    }

    return(
        <dib className="container-login">
            <div className='input-area'>
                <form onSubmit={handleSubmit}>
                    <h1>Create an account</h1>
                    <input type="text" onChange={(e) => setNome(e.target.value)} value={nome} placeholder='Your name'/>
                    <input type="text" onChange={(e) => setEmail(e.target.value)} value={email} placeholder='email@email.com'/>
                    <input type="password" onChange={(e) => setSenha(e.target.value)} value={senha} placeholder='****'/>  
                    <button type='submit'>Register</button>
                </form>
                <Link to="/" >Already have an account? login</Link>                
            </div>
        </dib>
    );
}


