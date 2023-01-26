import 'react-toastify/dist/ReactToastify.css';
import AllRoutes from "./Routes";
import { BrowserRouter } from "react-router-dom"; 
import AuthProvider from "./Context/auth";
import { ToastContainer } from 'react-toastify';

function App() {

  return (
    <AuthProvider>
      <BrowserRouter>
        <ToastContainer autoClose={3000}/>
        <AllRoutes/>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
