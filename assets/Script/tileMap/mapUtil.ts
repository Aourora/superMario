import TiledMap from "./tiledMap";

export function mapPixelConvertWorld(
  tiledMap: cc.TiledMap,
  pixel: cc.Vec2
): cc.Vec2 {
  //获得块的左下角为锚点的坐标
  const mapTileSize = tiledMap.getMapSize();
  const tileSize = tiledMap.getTileSize();
  const mapPixelSize = cc.v2(
    mapTileSize.width * tileSize.width,
    mapTileSize.height * tileSize.height
  );
  let halfW = mapPixelSize.x / 2,
    halfH = mapPixelSize.y / 2;
  //坐标移到地图中间为 (0,0) 与 cocos 统一
  let x = pixel.x - halfW + tileSize.width / 2,
    y = pixel.y - halfH + tileSize.height / 2;
  return cc.v2(x, y);
}

export function isCollision(
  tiledMap: TiledMap,
  playerPosition: cc.Vec2,
  layerName: string,
  offset: cc.Vec2
) {
  const tiledObject = tiledMap.getTiledObject();
  const tiledLayer = tiledMap.getTiledLayer();
  //是否与Land/block碰撞
  const tiled = tiledObject.getTiledByPos(playerPosition.add(offset));
  if (tiledLayer.isCollision(tiled, layerName)) {
    return true;
  }
  return false;
}
