import { createContext, useState, useEffect } from "react";
import { toast } from "react-toastify";
import { db, authenticate } from '../services/FirebaseConnection'
import { createUserWithEmailAndPassword } from "firebase/auth";
import { collection, addDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();


function AuthProvider({children}){

    const Navegar = useNavigate();

    const [user, setUser] = useState(null);
    const [loadingAuth, setLoadingAuth] = useState(false);
    const [loading, setLoading] = useState(true);

    async function SignUp(email, password, name) {

        if (email !== '' && password !== '' && name !== ''){
            setLoading(true);
            await createUserWithEmailAndPassword(authenticate, email, password)
            .then( async (value) => {
                let uid = value.user.uid;
                
                await addDoc(collection(db, "users"), {
                    name: name,
                })
                .then(() => {
                    let data = {
                        uid: uid,
                        name: name,
                        email: value.user.email,
                    };

                    setUser(data);
                    storageUser(data);
                    setLoadingAuth(false);
                    //Navegar('/deshboard');
                    toast.success("Bem vindo a plataforma!");
                })
            })
            .catch((error) => {
                console.log(error);
                toast.warn("Algo deu errado");
                setLoadingAuth(false);
            })
        }else{
            toast.warn("Ops, Algo deu errado");
            return;
        }
        
    }

    function storageUser(data){
        localStorage.setItem('SystemUser', JSON.stringify(data));
    }


    return(
        <AuthContext.Provider value={{
            signed: !!user,
            user,
            loading,
            SignUp,
            setUser,
            loadingAuth,
            storageUser
            }}>
            {children}
        </AuthContext.Provider>
    );
}

export default AuthProvider;