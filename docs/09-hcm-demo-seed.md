# HCMC demo dispatch seed

File seed: `docs/demo-hcm-dispatch-seed.sql`

Run before demo:

```powershell
Get-Content docs\demo-hcm-dispatch-seed.sql | docker exec -i crime-report-mariadb mariadb -ucrime_user -pcrime_password
```

It creates data matching the Admin UI forms:

- Admin Units fields: `code`, `name`, `areaId`, `address`, `latitude`, `longitude`, `unitType`, `active`.
- Admin Officers fields: `userId`, `unitId`, `badgeNumber`, `rankName`.
- Duty data: one active shift `SHIFT_HCM_DEMO_ACTIVE`, with all seeded officers set to `AVAILABLE`.

Demo officer accounts all use password:

```text
officer123
```

Useful accounts:

| Username | Unit |
|---|---|
| officer_hcm_q1 | Cong an Quan 1 |
| officer_hcm_q3 | Cong an Quan 3 |
| officer_hcm_binh_thanh | Cong an Quan Binh Thanh |
| officer_hcm_tan_binh | Cong an Quan Tan Binh |
| officer_hcm_113 | Trung tam 113 TP. Ho Chi Minh |

For the public report demo, use a coordinate near the unit you want smart dispatch to select:

| Demo area | Latitude | Longitude |
|---|---:|---:|
| Quan 1 / Ben Thanh | 10.7769000 | 106.7009000 |
| Thanh pho Thu Duc | 10.8490000 | 106.7698000 |
| Quan 7 | 10.7380000 | 106.7219000 |
| Tan Binh | 10.8017000 | 106.6520000 |
| Cu Chi | 10.9736000 | 106.4931000 |

Note: this is a demo dataset for the current project schema. It covers the legacy district-level HCMC dispatch map used by the app, not an official administrative master-data package.
