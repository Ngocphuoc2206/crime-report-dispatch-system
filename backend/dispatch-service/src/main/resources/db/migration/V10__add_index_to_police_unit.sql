CREATE INDEX idx_police_unit_active_location
    ON police_unit(is_active, latitude, longitude);