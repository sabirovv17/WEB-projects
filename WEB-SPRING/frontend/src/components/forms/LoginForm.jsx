import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from "../../context/UserContext";

import GoIndexButton from "../buttons/navigations/NavigateToIndexButton";

function sendLogin(email, password) {
    const f = false;
    return fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, f }),
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        });
}

export default function LoginForm() {
    const { login } = useContext(UserContext);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate(); // Получаем функцию навигации

    const handleSubmit = (event) => {
        event.preventDefault(); // Предотвращаем перезагрузку страницы

        // Клиентская валидация:
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email.trim()) {
            document.getElementById("status").style.color = "red";
            document.getElementById("status").innerText = "Email не может быть пустым";
            return;
        }
        if (!emailRegex.test(email)) {
            document.getElementById("status").style.color = "red";
            document.getElementById("status").innerText = "Введите корректный email";
            return;
        }
        if (!password.trim()) {
            document.getElementById("status").style.color = "red";
            document.getElementById("status").innerText = "Пароль не может быть пустым";
            return;
        }

        sendLogin(email, password)
            .then(data => {
                console.log(data);
                if (data.login === true) { // Проверяем, успешен ли логин
                    login(data); // Обновляем состояние авторизации
                    navigate('/main');
                } else {
                    document.getElementById("status").style.color = "red";
                    document.getElementById("status").innerText = "Неверный логин или пароль";
                }
            })
            .catch(error => {
                document.getElementById("status").style.color = "red";
                document.getElementById("status").innerText = "Неверный логин или пароль";
            });
    };

    return (
        <div className="center-container">
            <GoIndexButton />
            <div><h1>Авторизация</h1></div>
            <input
                id="email"
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <br />
            <input
                id="password"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <br />
            <button onClick={handleSubmit} className="custom-button">Отправить</button>
            <br />
            <div>
                <p id="status"></p>
            </div>
        </div>
    );
}
