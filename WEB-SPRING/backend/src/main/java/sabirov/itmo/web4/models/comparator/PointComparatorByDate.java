package sabirov.itmo.web4.models.comparator;

import sabirov.itmo.web4.models.Point;

import java.util.Comparator;

public class PointComparatorByDate implements Comparator<Point> {
    @Override
    public int compare(Point o1, Point o2) {
        return o1.getServerTime().compareTo(o2.getServerTime());
    }
}
