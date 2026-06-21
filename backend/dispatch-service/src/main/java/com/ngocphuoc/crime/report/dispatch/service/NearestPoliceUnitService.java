package com.ngocphuoc.crime.report.dispatch.service;

import com.ngocphuoc.crime.report.common.ErrorCode;
import com.ngocphuoc.crime.report.dispatch.dto.response.PoliceUnitDistanceResponse;
import com.ngocphuoc.crime.report.dispatch.entity.PoliceUnit;
import com.ngocphuoc.crime.report.dispatch.repository.PoliceUnitRepository;
import com.ngocphuoc.crime_report.shared.exception.AppException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.Comparator;
import java.util.List;

@Service
@RequiredArgsConstructor
public class NearestPoliceUnitService {
    private final PoliceUnitRepository policeUnitRepository;
    private final HaversineDistanceService haversineDistanceService;

    // Constant
    private static final double SEARCH_RADIUS_KM = 20.0;
    private static final double KM_PER_LAT_DEGREE = 111.0;

    @Transactional(readOnly = true)
    public List<PoliceUnitDistanceResponse> findNearestPoliceUnits(
            double incidentLatitude,
            double incidentLongitude,
            int limit
    ){
        // Haversine distance
        validateCoordinate(incidentLatitude, incidentLongitude);
        int safeLimit = normalizeLimit(limit);

        // 1 độ vĩ độ ~= 111.0km
        double deltaLat = SEARCH_RADIUS_KM / KM_PER_LAT_DEGREE;

        double cosLat = Math.cos(Math.toRadians(incidentLatitude));

        double deltaLon = Math.abs(cosLat) < 0.000001
                ? 180.0
                : deltaLat / cosLat;
        // bán kính 20km = 20/111 ~= 0.18
        double minLat = incidentLatitude - deltaLat;
        double maxLat = incidentLatitude + deltaLat;

        double minLon = incidentLongitude - deltaLon;
        double maxLon = incidentLongitude + deltaLon;

        BigDecimal dbMinLat = BigDecimal.valueOf(minLat);
        BigDecimal dbMaxLat = BigDecimal.valueOf(maxLat);
        BigDecimal dbMinLon = BigDecimal.valueOf(minLon);
        BigDecimal dbMaxLon = BigDecimal.valueOf(maxLon);

        // Tìm đơn vị trong bán kính 20km
        return policeUnitRepository.findUnitsWithinBox(dbMinLat, dbMaxLat, dbMinLon, dbMaxLon)
                .stream()
                .map(unit -> toDistanceResponse(unit, incidentLatitude, incidentLongitude))
                .sorted(Comparator.comparing(PoliceUnitDistanceResponse::distanceKm))
                .limit(safeLimit)
                .toList();
    }

    public PoliceUnitDistanceResponse findNearestPoliceUnit(
            double incidentLatitude,
            double incidentLongitude
    ){
        return findNearestPoliceUnits(incidentLatitude, incidentLongitude, 1)
                .stream().findFirst()
                .orElseThrow(() -> new AppException(ErrorCode.NO_POLICE_UNIT_FOUND_NEARBY));
    }

    private PoliceUnitDistanceResponse toDistanceResponse(
            PoliceUnit unit,
            double incidentLatitude,
            double incidentLongitude
    ) {
        double unitLatitude = toDouble(unit.getLatitude());
        double unitLongitude = toDouble(unit.getLongitude());

        double distanceKm = haversineDistanceService.calculateDistanceKm(
                incidentLatitude,
                incidentLongitude,
                unitLatitude,
                unitLongitude
        );

        double roundedKm = round(distanceKm);
        double roundedMeters = round(distanceKm * 1000);

        return new PoliceUnitDistanceResponse(
                unit.getId(),
                unit.getCode(),
                unit.getName(),
                unit.getUnitType(),
                unit.getAddress(),
                unit.getLatitude(),
                unit.getLongitude(),
                roundedKm,
                roundedMeters
        );
    }

    private int normalizeLimit(int limit) {
        if (limit <= 0){
             return 1;
        }
        return Math.min(limit, 20);
    }

    private void validateCoordinate(double incidentLatitude, double incidentLongitude) {
        if (incidentLatitude < -90 || incidentLatitude > 90){
            throw new AppException(ErrorCode.LATITUDE_NOT_SUITABLE);
        }

        if (incidentLongitude < -180 || incidentLongitude > 180) {
            throw new AppException(ErrorCode.LONGITUDE_NOT_SUITABLE);
        }
    }

    private double round(double value) {
        return Math.round(value * 100.0) / 100.0;
    }

    private double toDouble(BigDecimal value) {
        return value.doubleValue();
    }
}
