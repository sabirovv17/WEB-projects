package net.proselyte.web3;

import net.proselyte.web3.db.PointService;
import net.proselyte.web3.db.models.PointModel;
import org.primefaces.PrimeFaces;

import javax.faces.bean.ApplicationScoped;
import javax.faces.bean.ManagedBean;
import java.io.Serializable;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;

@ManagedBean(name = "checkPointBean")
@ApplicationScoped
public class CheckPointBean implements Serializable {
    static DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
    private boolean isHit = false;
    private double r=1;
    private PointService pointService = new PointService();
    private ArrayList<PointModel> results = (ArrayList<PointModel>) pointService.findAllPoints();

    public ArrayList<PointModel> getResults() {
        return results;
    }

    public void setResults(ArrayList<PointModel> results) {
        this.results = results;
    }

    public boolean getIsHit() {
        return isHit;
    }

    public void setIsHit(boolean hit) {
        isHit = hit;
    }

    public void check(PointBean pointBean) {
        long startTime = System.nanoTime();
        isHit = pointHit(pointBean.getX(), pointBean.getY(), pointBean.getR());
        if (results.get(0).getR() != pointBean.getR()){
            r =  pointBean.getR();
            showPoints();
        }
        PrimeFaces.current().executeScript("draw(" + pointBean.getX() + "," + pointBean.getY() +
                "," + pointBean.getR() + "," + isHit + ")");
        PointModel pointModel = new PointModel(pointBean.getX(), pointBean.getY(),
                pointBean.getR(), isHit, String.valueOf(System.nanoTime() - startTime),
                formatter.format(LocalDateTime.now()));
        pointService.savePoint(pointModel);
        results.add(0, pointModel);
    }

    public void showPoints(){
        PrimeFaces.current().executeScript("clear()");
        for (PointModel pointModel: results){
            PrimeFaces.current().executeScript("draw(" + pointModel.getX() + "," + pointModel.getY()
                    + "," + r + "," + pointHit(pointModel.getX(), pointModel.getY(), r) + ")");
        }
    }

    public boolean pointHit(double x, double y, double r) {
        return isPointInQuarterCircle(x, y, r) ||
                isPointInTriangle(x, y, r) ||
                isPointInRectangle(x, y, r);
    }

    public boolean isPointInQuarterCircle(double x, double y, double r) {
        double radius = r / 2; // Радиус четверти круга
        double centerX = 0;
        double centerY = 0;

        // Проверка, находится ли точка в пределах четверти круга
        if (x <= centerX && y >= centerY) {
            double distanceSquared = Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2);
            return distanceSquared <= Math.pow(radius, 2);
        }
        return false;
    }

    public boolean isPointInTriangle(double x, double y, double r) {
        double[][] triangleVertices = {
                {r, 0},
                {0, 0},
                {0, -r / 2}
        };

        return isPointInPolygon(x, y, triangleVertices);
    }

    private boolean isPointInPolygon(double x, double y, double[][] polygon) {
        int n = polygon.length;
        boolean inside = false;

        for (int i = 0, j = n - 1; i < n; j = i++) {
            double xi = polygon[i][0], yi = polygon[i][1];
            double xj = polygon[j][0], yj = polygon[j][1];

            // Проверка пересечения с границей
            boolean intersect = ((yi > y) != (yj > y)) &&
                    (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
            if (intersect) {
                inside = !inside;
            }
        }
        return inside;
    }

    private boolean isPointInRectangle(double x, double y, double r) {
        return (x >= 0 && x <= r) && (y >= 0 && y <= r);
    }
}
