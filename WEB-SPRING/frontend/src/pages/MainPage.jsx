import {UserContext} from '../context/UserContext';
import {useContext, useEffect, useState} from "react";
import LogoutButton from "../components/buttons/LogoutButton";
import { useRef } from 'react';

function Page() {
    const {currentUser} = useContext(UserContext);
    const email = currentUser?.email;
    const password = currentUser?.password;
    const [clicked, setClicked] = useState(false);
    const [r, setR] = useState(1);

    const hasLoadedPointsRef = useRef(false); // Используем useRef для отслеживания состояния

    useEffect(() => {
        if (hasLoadedPointsRef.current) return; // Если уже загружены точки, выходим
        console.log(hasLoadedPointsRef.current);
        const isLogin = true;

        fetch('/get-points', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password, isLogin }),
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('ERROR response.');
                }
                return response.json();
            })
            .then(json => {
                json.forEach((point) => {
                    point.x = parseFloat(point.x).toFixed(2);
                    point.y = parseFloat(point.y).toFixed(2);
                });
                sessionStorage.setItem("points", JSON.stringify(json));
            })
            .finally(() => {
                hasLoadedPointsRef.current = true; // Устанавливаем флаг в ref после загрузки
            });
    }, [email, password]);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    function checkPoint(x, y, r) {
        fetch('/check-point', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({x, y, r, email}),
        }).then(response => {
            return response.json();
        }).then(json => {
            let points = sessionStorage.getItem("points")
            points = JSON.parse(points);
            points.push(json);
            sessionStorage.setItem("points", JSON.stringify(points));
            points.forEach((point) => {
                point.x = parseFloat(point.x).toFixed(2);
                point.y = parseFloat(point.y).toFixed(2);
            })

            draw(json.x, json.y, json.r, json.hit)
            insertToTable(json.x, json.y, json.r, json.hit, json.executionTime, json.serverTime);
        });
    }

    useEffect(() => {
        const svgElement = document.getElementById('graph-svg');
        const circles = Array.from(svgElement.getElementsByTagName('circle'));
        circles.forEach(circle => {
            svgElement.removeChild(circle);
        });

        const pointsString = sessionStorage.getItem("points");
        if (pointsString) {
            try {
                const points = JSON.parse(pointsString);
                points.forEach((point) => {
                    // Преобразование типов для надежного сравнения
                    const pointR = parseFloat(point.r);
                    if (pointR === parseFloat(r)) {
                        draw(point.x, point.y, point.r, point.hit);
                    }
                });
            } catch (error) {
                console.error("Ошибка парсинга JSON из sessionStorage:", error);
                sessionStorage.removeItem("points"); // Очищаем sessionStorage в случае ошибки
            }
        } else {
            console.log("Точки не найдены в sessionStorage");
        }
    }, [r])

    function buttonClick() {
        setClicked(true);
    }

    useEffect(() => {
        if (clicked) {
            const x = document.getElementById("xSelect").value
            const y = parseFloat(document.getElementById("yInput").value).toFixed(2);
            const r = document.getElementById("rSelect").value
            checkPoint(x, y, r);
            setClicked(false);
        }
    }, [checkPoint, clicked]);


    function insertToTable(x, y, r, hit, executionTime, serverTime) {
        const table = document.getElementById("resultsTable");
        const newRow = table.insertRow(1);

        const xCell = newRow.insertCell(0);
        const yCell = newRow.insertCell(1);
        const rCell = newRow.insertCell(2);
        const answerCell = newRow.insertCell(3);
        const executionTimeCell = newRow.insertCell(4);
        const serverTimeCell = newRow.insertCell(5);

        xCell.innerText = x;
        yCell.innerText = y;
        rCell.innerText = r;

        serverTimeCell.innerText = serverTime;
        executionTimeCell.innerText = executionTime;
        if (hit){
            answerCell.innerText = "Да";
        } else {
            answerCell.innerText = "Нет";
        }
    }


    function draw(x, y, r, answer) {
        const svgElement = document.getElementById('graph-svg');

        const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        circle.setAttribute("cx", (parseFloat(x) / parseFloat(r) * 100 + 150).toFixed(2));
        circle.setAttribute("cy", (parseFloat(y) / parseFloat(r) * 100 * -1 + 150).toFixed(2));
        circle.setAttribute("r", "5");

        if (answer) {
            circle.setAttribute("fill", "green")
        } else {
            circle.setAttribute("fill", "red")
        }

        svgElement.appendChild(circle);
    }

    useEffect(() => {
        const svgElement = document.getElementById('graph-svg');
        const click = (event) => {
            const rect = svgElement.getBoundingClientRect();
            const xGraph = event.clientX - rect.left;
            const yGraph = event.clientY - rect.top;
            const x = ((xGraph - 150) / 100).toFixed(2);
            const y = ((yGraph - 150) / 100 * -1).toFixed(2);

            const xr = x * r;
            const yr = y * r;
            console.log(xr, yr, r);
            checkPoint(xr, yr, r);
        };

        svgElement.addEventListener('click', click);
        return () => {
            svgElement.removeEventListener('click', click);
        };
    }, [checkPoint, email]);

    function changeR() {
        setR(document.getElementById("rSelect").value);
        console.log("НОВОЕ ЗНАЧЕНИЕ R", document.getElementById("rSelect").value)
    }

    function updateY() {
        let fixedValue = parseFloat(document.getElementById("yInput").value).toFixed(2);
        console.log("updateY " + fixedValue);
        document.getElementById("yValue").innerText = fixedValue;
    }

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // Расчет индексов для отображения текущей страницы
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const storedPoints = sessionStorage.getItem("points");
    // const currentItems = storedPoints ? JSON.parse(storedPoints).slice(indexOfFirstItem, indexOfLastItem) : [];

    let currentItems;
    let points = [];
    let totalPages = 1;
    if (storedPoints && JSON.parse(storedPoints) ){
        currentItems = storedPoints ? JSON.parse(storedPoints).slice(indexOfFirstItem, indexOfLastItem) : [];
        points = storedPoints ? JSON.parse(storedPoints) : [];
        totalPages = points.length ? Math.ceil(points.length / itemsPerPage) : 1;
    } else {
        currentItems = [];
    }

    const nextPage = () => {
        if (sessionStorage.getItem("points") && currentPage < Math.ceil(JSON.parse(sessionStorage.getItem("points")).length / itemsPerPage)) {
            console.log(JSON.parse(sessionStorage.getItem("points")))
            setCurrentPage(currentPage + 1);
        }
    };

    // const points = storedPoints ? JSON.parse(storedPoints) : [];
    // const totalPages = points.length ? Math.ceil(points.length / itemsPerPage) : 1;

    const prevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    return (
        <div>
            <div className="main-container">
                <div>
                    <section className="block plot-section">
                        <div className="graph">
                            <svg height="300" width="300" xmlns="http://www.w3.org/2000/svg" id="graph-svg">

                                <line stroke="gray" x1="0" x2="300" y1="150" y2="150"></line>
                                <line stroke="gray" x1="150" x2="150" y1="0" y2="300"></line>
                                <polygon fill="white" points="150,0 144,15 156,15" stroke="white"></polygon>
                                <polygon fill="white" points="300,150 285,156 285,144" stroke="white"></polygon>


                                <line stroke="gray" x1="200" x2="200" y1="155" y2="145"></line>
                                <line stroke="gray" x1="250" x2="250" y1="155" y2="145"></line>

                                <line stroke="gray" x1="50" x2="50" y1="155" y2="145"></line>
                                <line stroke="gray" x1="100" x2="100" y1="155" y2="145"></line>

                                <line stroke="gray" x1="145" x2="155" y1="100" y2="100"></line>
                                <line stroke="gray" x1="145" x2="155" y1="50" y2="50"></line>

                                <line stroke="gray" x1="145" x2="155" y1="200" y2="200"></line>
                                <line stroke="gray" x1="145" x2="155" y1="250" y2="250"></line>


                                <text fill="white" x="195" y="140">R/2</text>
                                <text fill="white" x="248" y="140">R</text>

                                <text fill="white" x="40" y="140">-R</text>
                                <text fill="white" x="90" y="140">-R/2</text>

                                <text fill="white" x="160" y="105">R/2</text>
                                <text fill="white" x="160" y="55">R</text>

                                <text fill="white" x="160" y="205">-R/2</text>
                                <text fill="white" x="160" y="255">-R</text>

                                <text fill="white" x="160" y="10">Y</text>
                                <text fill="white" x="290" y="140">X</text>


                                <rect x="50" y="150" width="100" height="100" fill="#00ffcc" fill-opacity="0.2"
                                      stroke="#00ffcc"></rect>


                                <polygon fill="#00ffcc" fill-opacity="0.2" points="250,150 150,150 150,50"
                                         stroke="#00ffcc"></polygon>


                                <path d="M 100 150 A 100, 100, 0, 0, 1, 150 100 L 150 150 Z" fill-opacity="0.2"
                                      fill="#00ffcc"
                                      stroke="#00ffcc"></path>

                            </svg>
                        </div>
                    </section>
                </div>
                <div style={{flex: '1'}}>
                    <h4 className="input">Выберете X</h4>
                    <div id="r-values" style={{padding: "10px", maxWidth: "200px"}}>
                        <label className="listbox-label"
                               style={{color: "#00ffcc", fontSize: "18px", fontFamily: "Roboto"}}>
                        </label>
                        <select id="xSelect" name="boxX" className="selectStyle">
                            <option value="-3">-3</option>
                            <option value="-2">-2</option>
                            <option value="-1">-1</option>
                            <option value="0">0</option>
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5">5</option>
                        </select>
                    </div>

                    <h4 className="input">Выберите Y</h4>
                    <input type="range" step="any" min="-3" max="5" id="yInput" className="slider" onChange={updateY}/>
                    <p id="yValue">5</p>


                    <h4 className="input">Выберете R</h4>
                    <div id="r-values" style={{padding: "10px", maxWidth: "200px"}}>
                        <label className="listbox-label"
                               style={{color: "#00ffcc", fontSize: "18px", fontFamily: "Roboto"}}>
                        </label>
                        <select id="rSelect" name="boxR" onChange={changeR} className="selectStyle">
                            <option value="-2">-2</option>
                            <option value="-1">-1</option>
                            <option value="0">0</option>
                            <option value="1" selected>1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5">5</option>
                        </select>
                    </div>


                    <br/>

                    <div className="button-container">
                        <button id="checkButton" onClick={buttonClick}>Проверить</button>
                    </div>
                    <br/>
                </div>
            </div>

            <div className="pagination">
                <button className="custom-button" onClick={prevPage} disabled={currentPage === 1}>
                    Prev
                </button>
                <span>{`Page ${currentPage} of ${totalPages}`}</span>
                <button className="custom-button" onClick={nextPage}
                        disabled={currentPage === totalPages}>
                    Next
                </button>
            </div>
            <div className="table-container">
                <table id="resultsTable" className="data-table">
                    <thead>
                    <tr>
                        <th>X</th>
                        <th>Y</th>
                        <th>R</th>
                        <th>Результат</th>
                        <th>Время выполнения</th>
                        <th>Время на сервере</th>
                    </tr>
                    </thead>
                    <tbody>
                    {currentItems.map((item, index) => (
                        <tr key={index}>
                            <td>{item.x}</td>
                            <td>{item.y}</td>
                            <td>{item.r}</td>
                            <td>{item.hit ? 'Да' : 'Нет'}</td>
                            <td>{item.executionTime}</td>
                            <td>{item.serverTime}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

        </div>
    )
}

export default function MainPage() {
    const {currentUser} = useContext(UserContext);
    return (
        <div>
            {(currentUser != null && currentUser.login) ? (
                <>
                    <div
                        style={{display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%"}}>
                        <LogoutButton/>
                        <p style={{textAlign: "right"}}>{currentUser.email}</p>
                    </div>
                    <Page/>
                </>
            ) : (
                <div className="center-container">
                    <p>Пожалуйста, войдите в систему.</p></div>
            )}
        </div>
    )
}

