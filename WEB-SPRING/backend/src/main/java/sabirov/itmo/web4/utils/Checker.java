package sabirov.itmo.web4.utils;

public class Checker {
    public static boolean isHit(double x, double y, double r) {
        return inSquare(x, y, r) || inTriangle(x, y, r) || inCircle(x, y, r);
    }

    private static boolean inSquare(double x, double y, double r) {
        return x <= 0 && y <= 0 && -x <= r && -y <= r;
    }

    private static boolean inTriangle(double x, double y, double r) {
        return x >= 0 && y >= 0 && x <= r && y <= r && y <= r - x;
    }

    private static boolean inCircle(double x, double y, double r) {
        double centerX = 0;
        double centerY = 0;
        r = r/2;
        if (x <= centerX && y >= centerY && -x <= (centerX + r) && y <= (centerY + r)) {
            double distanceSquared = Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2);
            if (distanceSquared <= Math.pow(r, 2)) {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }
}
