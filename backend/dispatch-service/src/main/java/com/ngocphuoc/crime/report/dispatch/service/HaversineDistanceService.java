package com.ngocphuoc.crime.report.dispatch.service;

import org.springframework.stereotype.Service;

@Service
public class HaversineDistanceService {
//    bán kính trung bình của Trái Đất (KM)
    private final static double EARTH_RADIUS_KM = 6371.0088;

    public double calculateDistanceKm(
            double fromLatitude,
            double fromLongitude,
            double toLatitude,
            double toLongitude
    ){
        double fromLatRad = Math.toRadians(fromLatitude);
        double toLatRad = Math.toRadians(toLatitude);

        // Chênh lệch vĩ độ
        double deltaLatRad = Math.toRadians(toLatitude - fromLatitude);

        // Chênh lệch kinh độ
        double deltaLonRad = Math.toRadians(toLongitude - fromLongitude);

        double a = Math.sin(deltaLatRad / 2) * Math.sin(deltaLatRad / 2)
                + Math.cos(fromLatRad)
                * Math.cos(toLatRad)
                * Math.sin(deltaLonRad / 2)
                * Math.sin(deltaLonRad / 2);

        // Góc ở tâm giữa 2 điểm trên bề mặt trái đất
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return EARTH_RADIUS_KM * c;
    }
}
