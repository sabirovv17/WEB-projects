import NavigateToLoginButton from "../components/buttons/navigations/NavigateToLoginButton";
import NavigateToRegisterButton from "../components/buttons/navigations/NavigateToRegisterButton";

export default function IndexPage() {
    return (
        <div className="center-container">
            <header id="welcomepage-header">
                <h1>Web-programming | Laboratory 4 | Var 9456</h1>
                <div id="credit">
                    <p>Amir Sabirov</p>
                </div>
            </header>
            <div className="button-container">
                <NavigateToLoginButton/><NavigateToRegisterButton/>
            </div>
        </div>)
}