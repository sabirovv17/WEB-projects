package com.example;

import java.io.IOException;
import java.io.PrintWriter;
import java.math.BigDecimal;
import java.util.ArrayList;

import com.example.utils.Checker;
import com.example.utils.Point;
import com.example.utils.Validator;
import com.google.gson.Gson;

import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@WebServlet("/check")
public class AreaCheckServlet extends HttpServlet {
    private final String CONTEXT_ATTRIBUTE = "points";
    
    @Override
    public void init() {
        getServletContext().setAttribute(CONTEXT_ATTRIBUTE, new ArrayList<Point>());
    }
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) {
        try {
            BigDecimal x = new BigDecimal(request.getParameter("x"));
            BigDecimal y = new BigDecimal(request.getParameter("y"));
            BigDecimal r = new BigDecimal(request.getParameter("r"));

            ArrayList<Point> points = (ArrayList<Point>) getServletContext().getAttribute(CONTEXT_ATTRIBUTE);
            if (Validator.validateArgs(x, y, r)) {
                float flX = Float.parseFloat(request.getParameter("x"));
                float flY = Float.parseFloat(request.getParameter("y"));
                float flR = Float.parseFloat(request.getParameter("r"));

                if (points.size() != 0) {
                    if (flR != points.get(0).getR()) {
                        updateAllPoints(flR);
                    } else {
                        addNewPoint(flX, flY, flR);
                    }
                } else {
                    addNewPoint(flX, flY, flR);
                }
                sendResponse(response);
            } else {
                sendErrorResponse(response, "invalid params");
            }
        } catch (IOException | NumberFormatException exception) {
        }
    }

    private void addNewPoint(float x, float y, float r) {
        ArrayList<Point> points = (ArrayList<Point>) this.getServletContext().getAttribute(CONTEXT_ATTRIBUTE);
        long startTime = System.nanoTime();
        boolean isHit = Checker.isHit(x, y, r); 
        long endTime = System.nanoTime();
        Point point = new Point(x, y, r, isHit, endTime - startTime);
        points.add(point);
    }
    private void updateAllPoints(float r) {
        ArrayList<Point> points = (ArrayList<Point>) this.getServletContext().getAttribute(CONTEXT_ATTRIBUTE);
        for (Point point : points) {
            point.setR(r);
            point.setIsHit(Checker.isHit(point.getX(), point.getY(), point.getR()));
        }
    }
        private void sendResponse(HttpServletResponse response) throws IOException {
        ArrayList<Point> points = (ArrayList<Point>) this.getServletContext().getAttribute(CONTEXT_ATTRIBUTE);
        buildResponse(response);
        Gson gson = new Gson();
        String jsonResponse = gson.toJson(points);
        PrintWriter writer = response.getWriter();
        writer.println(jsonResponse);
        writer.flush(); 
    }

    private void buildResponse(HttpServletResponse response) {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
    }
    private void sendErrorResponse(HttpServletResponse response, String message) throws IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.setStatus(HttpServletResponse.SC_BAD_REQUEST); // 400 Bad Request
        PrintWriter writer = response.getWriter();
        writer.println("{\"error\": \"" + message + "\"}");
        writer.flush();
    }
}
