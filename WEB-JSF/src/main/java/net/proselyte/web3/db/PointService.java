package net.proselyte.web3.db;

import net.proselyte.web3.db.models.PointModel;

import java.util.List;

public class PointService {
    private PointDAO pointsDao = new PointDAO();

    public PointService() {
    }

    public void savePoint(PointModel point) {
        pointsDao.save(point);
    }

    public List<PointModel> findAllPoints() {
        return pointsDao.findAll();
    }
}
