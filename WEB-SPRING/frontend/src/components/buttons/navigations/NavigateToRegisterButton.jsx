import {useNavigate} from "react-router-dom";

export default function NavigateToRegisterButton() {
    const navigate = useNavigate();

    const go = () => {
        navigate('/register');
    };

    return (
        <button className="navigation-button" onClick={go}>Регистрация</button>
    );
}