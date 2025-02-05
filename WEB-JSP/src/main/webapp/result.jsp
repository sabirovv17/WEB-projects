<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ page import="java.util.ArrayList" %>
<%@ page import="com.example.utils.Point" %>
<%@ page import="com.example.AreaCheckServlet" %>

<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="author" content="Amir Sabirov">
        <meta name="description" content="Web-programming, lab2">
        <meta name="keywords" content="ITMO, Web-programming, VT">
        <title>Лабораторная Работа №2 | Веб - Программирование </title>
        <link rel="stylesheet" href="resources/styles/main.css" type="text/css">
    </head>
    <body>
        <table id="result-table">
            <thead>
                <tr>
                    <th>X</th>
                    <th>Y</th>
                    <th>R</th>
                    <th>Execution Time</th>
                    <th>Hit result</th>
                </tr>
            </thead>
            <tbody id="result-body">
                <%
                    ArrayList<Point> points = (ArrayList<Point>) getServletContext().getAttribute("points");
                    if (points != null && !points.isEmpty()) {
                        for (int i = points.size() - 1; i >= 0; i--) {
                            Point point = points.get(i);
                %>
                            <tr>
                                <td><%= point.getX() %></td>
                                <td><%= point.getY() %></td>
                                <td><%= point.getR() %></td>
                                <td><%= point.getExecutionTime() %></td>
                                <td><%= point.getIsHit() ? "hit" : "miss" %></td>
                            </tr>
                <%
                        }
                    } else {
                %>

                <%
                    }
                %>
            </tbody>
        </table>
    </body>
</html>
