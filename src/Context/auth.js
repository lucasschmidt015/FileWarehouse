import { createContext, useState, useEffect } from "react";
import firebase from "../services/FirebaseConnection";
import { toast } from "react-toastify";
import { storage } from "../api/storage.ts";


export const AuthContext = createContext();

function AuthProvider({children}){
    const [user, setUser] = useState(null);
    const [loadingAuth, setLoadingAuth] = useState(false);
    const [loading, setLoading] = useState(true);

    function getStorage(){
        return storage;
    }

    function loadStorage(){
        const storageUser = localStorage.getItem("SystemUser");

        if (storageUser){
            setUser(JSON.parse(storageUser))
            setLoading(false);
        }
        
        setLoading(false);
    }

    useEffect(() => {
        loadStorage();
    }, [])


    async function SignIn(email, password){
        setLoadingAuth(true);
        await firebase.auth().signInWithEmailAndPassword(email, password)
        .then( async (value) => {
            let uid = value.user.uid;
            const userProfile = await firebase.firestore().collection('users').doc(uid).get();
            
            let data = {
                uid: uid,
                name: userProfile.data().name,
                email: value.user.email,
            }

            setUser(data);
            storageUser(data);
            setLoadingAuth(false);
            toast.success("Welcome back!");

        })
        .catch((error) => {
            console.log("Erro:" + error)
            toast.error("Oops, something went wrong!");
            setLoadingAuth(false);
        })
    }


    async function SignUp(email, password, name) {

        if (email !== '' && password !== '' && name !== ''){
            setLoadingAuth(true);
            await firebase.auth().createUserWithEmailAndPassword(email, password)
            .then( async (value) => {
                let uid = value.user.uid;
                
                await firebase.firestore().collection("users").doc(uid).set({
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
                    toast.success("Welcome to the platform!");
                })
            })
            .catch((error) => {
                console.log(error);
                toast.warn("Oops, something went wrong!");
                setLoadingAuth(false);
            })
        }else{
            toast.warn("Oops, something went wrong!");
            return;
        }        
    }

    async function SignOut(){
        
        await firebase.auth().signOut();
        localStorage.removeItem('SystemUser')
        setUser(null);
    }

    function storageUser(data){
        localStorage.setItem('SystemUser', JSON.stringify(data));
    }


    return(
        <AuthContext.Provider value={{
            signed: !!user,
            user,
            loading,
            SignIn,
            SignUp,
            setUser,
            SignOut,
            loadingAuth,
            getStorage,
            storageUser
            }}>
            {children}
        </AuthContext.Provider>
    );
}

export default AuthProvider;
