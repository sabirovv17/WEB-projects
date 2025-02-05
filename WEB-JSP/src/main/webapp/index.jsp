<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<!DOCTYPE html>
<!DOCTYPE html>
<html lang="en_US"> 
    <head> 
        <meta charset="UTF-8">
        <meta name="author" content="Sabirov Amir">
        <meta name="description" content="Web-programming, lab1">
        <meta name="keywords" content="ITMO, Web-programming, VT">
        <link rel="stylesheet" href="resources/styles/main.css">
        <title>Laboratory work no. 2 | Web-programming</title>
    </head>
    <body>
        <header>
            <h1>Web-programming | Laboratory no. 2 | Var no. 9182</h1>
            <h2>Amir Sabirov | P3220</h2>
        </header>
        <div class="container">
            <div id="graph-container">
                <h2 class="title-plate">Graph</h2>
                <svg id="graph-svg" width="400" height="400" viewBox="-200 -200 400 400" xmlns="http://www.w3.org/2000/svg">
                    <!-- Оси -->
                    <line x1="-200" y1="0" x2="200" y2="0" stroke="black"></line> <!-- Ось X -->
                    <line x1="0" y1="200" x2="0" y2="-200" stroke="black"></line> <!-- Ось Y -->

                    <!-- Черточки на осях -->
                    <line x1="-150" y1="-5" x2="-150" y2="5" stroke="black"></line>
                    <text x="-160" y="20" font-size="20">-R</text>

                    <line x1="-75" y1="-5" x2="-75" y2="5" stroke="black"></line>
                    <text x="-85" y="20" font-size="20">-R/2</text>

                    <line x1="150" y1="-5" x2="150" y2="5" stroke="black"></line>
                    <text x="140" y="20" font-size="20">R</text>

                    <line x1="75" y1="-5" x2="75" y2="5" stroke="black"></line>
                    <text x="65" y="20" font-size="20">R/2</text>

                    <line x1="-5" y1="150" x2="5" y2="150" stroke="black"></line>
                    <text x="10" y="155" font-size="20">R</text>

                    <line x1="-5" y1="75" x2="5" y2="75" stroke="black"></line>
                    <text x="10" y="80" font-size="20">R/2</text>

                    <line x1="-5" y1="-150" x2="5" y2="-150" stroke="black"></line>
                    <text x="10" y="-140" font-size="20">-R</text>

                    <line x1="-5" y1="-75" x2="5" y2="-75" stroke="black"></line>
                    <text x="10" y="-65" font-size="20">-R/2</text>

                    <!-- Треугольник -->
                    <polygon points="0,0 0, -150 150, 0" fill-opacity="0.4" stroke="black" fill="purple"></polygon> 
                    <!-- Четверть окружности -->
                    <path d="M 0 0 H -75 A 75 75 0 0 0 0 75 V 0" fill-opacity="0.4" stroke="black" fill="purple"></path>
                    <!-- Прямоугольник -->
                    <rect x="-150" y="-75" width="150" height="75" fill-opacity="0.4" stroke="black" fill="purple"></rect> 
                    <!-- Стрелки -->
                    <polygon points="200,0 190,5 190,-5" fill="black"></polygon> <!-- Стрелка на X -->
                    <polygon points="0,-200 -5,-190 5,-190" fill="black"></polygon> <!-- Стрелка на Y -->
                    <!-- Подписи осей -->
                    <text x="180" y="20" font-size="20">R</text>
                    <text x="-40" y="-180" font-size="20">R</text>
                </svg>
            </div>
            <div id="form-container">
                <h2 class="title-plate">Input data</h2>
                <form method="get" id="input-form">
                    <label for="x">X:</label>
                    <div id="x-radio-buttons">
                        <label><input type="radio" name="x" value="-2"> -2</label>
                        <label><input type="radio" name="x" value="-1.5"> -1.5</label>
                        <label><input type="radio" name="x" value="-1"> -1</label>
                        <label><input type="radio" name="x" value="-0.5"> -0.5</label>
                        <label><input type="radio" name="x" value="0"> 0</label>
                        <label><input type="radio" name="x" value="0.5"> 0.5</label>
                        <label><input type="radio" name="x" value="1"> 1</label>
                        <label><input type="radio" name="x" value="1.5"> 1.5</label>
                        <label><input type="radio" name="x" value="2"> 2</label>
                    </div>
                    <label for="y">Y:</label>
                    <input type="text" id="y" name="y" placeholder="[-5;5]">
                    <label for="r">R:</label>
                    <select id="r" name="r">
                        <option value="1">1</option>
                        <option value="1.5">1.5</option>
                        <option value="2">2</option>
                        <option value="2.5">2.5</option>
                        <option value="3">3</option>
                    </select>
                    <button type="submit" id="submit">Submit</button>
                    <div id="error-message"></div>
                </form>
            </div>
        </div>        
        <div>
            <h2 class="title-plate">Results</h2>
            <jsp:include page="result.jsp"/>
        </div>
        <div id="pagination-controls">
            <button id="prev-page" disabled>Previous</button>
            <span id="current-page">Page 1</span>
            <button id="next-page">Next</button>
        </div>
         <form id="hidden-form" style="display: none;">
            <input type="hidden" id="hidden-x">
            <input type="hidden" id="hidden-y">
            <input type="hidden" id="hidden-r">
            <button type="submit" id="hidden-submit"></button>
        </form>
        <script src="resources/scripts/index.js"></script>
    </body>
</html>
