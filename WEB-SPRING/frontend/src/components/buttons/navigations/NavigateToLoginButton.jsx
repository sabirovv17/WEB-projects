import {useNavigate} from "react-router-dom";

export default function NavigateToLoginButton() {
    const navigate = useNavigate();

    const go = () => {
        navigate('/login');
    };

    return (
        <button className="navigation-button" onClick={go}>Вход</button>
    );
}