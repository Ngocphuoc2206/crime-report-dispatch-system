export type MapPoint = {
  x: number;
  y: number;
};

export type MapCoordinate = {
  latitude: number;
  longitude: number;
};

export type MapTile = {
  key: string;
  x: number;
  y: number;
  left: number;
  top: number;
};

export const tileSize = 256;
export const minDispatcherZoom = 10;
export const maxDispatcherZoom = 16;
export const hcmCenter: MapCoordinate = {
  latitude: 10.7769,
  longitude: 106.7009,
};

export function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export function getWorldSize(zoom: number) {
  return tileSize * 2 ** zoom;
}

export function coordinateToWorld(
  latitude: number,
  longitude: number,
  zoom: number,
): MapPoint {
  const worldSize = getWorldSize(zoom);
  const latRad = (clamp(latitude, -85.05112878, 85.05112878) * Math.PI) / 180;
  const sinLat = Math.sin(latRad);

  return {
    x: ((longitude + 180) / 360) * worldSize,
    y:
      (0.5 - Math.log((1 + sinLat) / (1 - sinLat)) / (4 * Math.PI)) *
      worldSize,
  };
}

export function worldToCoordinate(point: MapPoint, zoom: number): MapCoordinate {
  const worldSize = getWorldSize(zoom);
  const longitude = (point.x / worldSize) * 360 - 180;
  const mercatorY = 0.5 - point.y / worldSize;
  const latitude =
    90 - (360 * Math.atan(Math.exp(-mercatorY * 2 * Math.PI))) / Math.PI;

  return { latitude, longitude };
}

export function wrapTileX(tileX: number, zoom: number) {
  const tileCount = 2 ** zoom;
  return ((tileX % tileCount) + tileCount) % tileCount;
}

export function buildVisibleTiles({
  topLeft,
  viewport,
  zoom,
}: {
  topLeft: MapPoint;
  viewport: { width: number; height: number };
  zoom: number;
}): MapTile[] {
  if (viewport.width === 0 || viewport.height === 0) return [];

  const startX = Math.floor(topLeft.x / tileSize) - 1;
  const endX = Math.floor((topLeft.x + viewport.width) / tileSize) + 1;
  const startY = Math.floor(topLeft.y / tileSize) - 1;
  const endY = Math.floor((topLeft.y + viewport.height) / tileSize) + 1;
  const tileCount = 2 ** zoom;
  const tiles: MapTile[] = [];

  for (let x = startX; x <= endX; x += 1) {
    for (let y = startY; y <= endY; y += 1) {
      if (y < 0 || y >= tileCount) continue;

      tiles.push({
        key: `${zoom}-${x}-${y}`,
        x: wrapTileX(x, zoom),
        y,
        left: x * tileSize - topLeft.x,
        top: y * tileSize - topLeft.y,
      });
    }
  }

  return tiles;
}
