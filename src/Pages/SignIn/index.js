import './SignIn.css'

export default function SignIn(){

    function handleSubmit(e){
        e.preventDefault();
        alert("Is working");
    }

    return(
        <dib className="container-login">
            <div className='input-area'>
                <form onSubmit={handleSubmit}>
                    <h1>Entrar</h1>
                    <input type="text" placeholder='email@email.com'/>
                    <input type="password" placeholder='****'/>
                    <button type='submit'>Acessar</button>
                </form>

                <a>Criar uma conta</a>
            </div>
        </dib>
    );
}