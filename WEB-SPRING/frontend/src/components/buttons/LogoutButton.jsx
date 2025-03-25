import {useNavigate} from "react-router-dom";
import {useContext} from "react";
import {UserContext} from "../../context/UserContext";

export default function LogoutButton() {
    const navigate = useNavigate();
    const {logout} = useContext(UserContext);

    const out = () => {
        logout();
        navigate('/');
        sessionStorage.setItem('points', null);
    };

    return (
        <button className="navigation-button" onClick={out}>Выйти</button>
    );
}