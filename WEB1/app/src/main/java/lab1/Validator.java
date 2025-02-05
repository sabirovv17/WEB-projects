package lab1;

import java.math.BigDecimal;

public class Validator {

    public static boolean validateArgs(BigDecimal x, BigDecimal y, int r) {
        return validateX(x) && validateY(y) && validateR(r);
    }
    private static boolean validateX(BigDecimal x) {
        return x.compareTo(new BigDecimal("-2.0")) >= 0 && x.compareTo(new BigDecimal("2.0")) <= 0;
    }
    private static boolean validateY(BigDecimal y) {
        return y.compareTo(new BigDecimal("-3.0")) >= 0 && y.compareTo(new BigDecimal("5.0")) <= 0;
    }
    private static boolean validateR(int r) {
        return r >= 1 && r <= 5;
    }
}