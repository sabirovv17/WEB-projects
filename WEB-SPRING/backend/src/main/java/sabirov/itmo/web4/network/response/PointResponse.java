package sabirov.itmo.web4.network.response;

public class PointResponse {
    private double x;
    private double y;
    private double r;
    private String email;

    public PointResponse(double x, double y, double r, String email) {
        this.x = x;
        this.y = y;
        this.r = r;
        this.email = email;
    }

    public double getX() {
        return x;
    }

    public void setX(double x) {
        this.x = x;
    }

    public double getY() {
        return y;
    }

    public void setY(double y) {
        this.y = y;
    }

    public double getR() {
        return r;
    }

    public void setR(double r) {
        this.r = r;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
}
