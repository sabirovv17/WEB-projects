import {useNavigate} from "react-router-dom";

export default function GoLoginButton() {
    const navigate = useNavigate();

    const go = () => {
        navigate('/');
    };

    return (
        <button className="navigation-button" onClick={go}>Назад</button>
    );
}