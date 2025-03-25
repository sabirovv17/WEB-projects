import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';

import IndexPage from "./pages/IndexPage";
import LoginForm from './components/forms/LoginForm';
import MainPage from './pages/MainPage';
import {UserProvider} from './context/UserContext';
import RegistrationForm from "./components/forms/RegistrationForm";


export default function MyApp() {
    return (
        <UserProvider>
            <Router>
                <div>
                    <Routes>
                        <Route path="/" element={<IndexPage/>}/>
                        <Route path="/login" element={<LoginForm/>}/>
                        <Route path="/register" element={<RegistrationForm/>}/>
                        <Route path="/main" element={<MainPage/>}/>
                    </Routes>
                </div>
            </Router>
        </UserProvider>
    );
}