package com.example.utils;

public class Checker {
    public static boolean isHit(float x, float y, float r) {
        return inSquare(x, y, r) || inTriangle(x, y, r) || inCircle(x, y, r);
    }

    private static boolean inSquare(float x, float y, float r) {
        return x <= 0 && y >= 0 && -x <= r && y <= r / 2f; 
    }
    private static boolean inTriangle(float x, float y, float r) {
        return x >= 0 && y >= 0 && x <= r && y <= r && x + y <= r;
    }
    private static boolean inCircle(float x, float y, float r) {
        return x <= 0 && y <= 0 && x <= r / 2f && -y <= r / 2f && Math.pow(x, 2) + Math.pow(y, 2) <= Math.pow(r / 2f, 2);
    }
}
