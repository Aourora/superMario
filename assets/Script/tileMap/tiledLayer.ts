import TiledMap from "./tiledMap";
import tiledMapData from "./tiledMapData";

const { ccclass, property } = cc._decorator;

@ccclass
export default class tileLayer extends cc.Component {
  @property({
    readonly: true,
    displayName: "金币层",
  })
  public layerCoinName: string = tiledMapData.TILED_LAYER_COIN;
  @property({
    readonly: true,
    displayName: "陷进层",
  })
  public layerTrapName: string = tiledMapData.TILED_LAYER_TRAP;
  @property({
    readonly: true,
    displayName: "块层",
  })
  public layerBlockName: string = tiledMapData.TILED_LAYER_BLOCK;
  @property({
    readonly: true,
    displayName: "管道层",
  })
  public layerPipeNameName: string = tiledMapData.TILED_LAYER_PIPE;
  @property({
    readonly: true,
    displayName: "终点旗杆层",
  })
  public layerFlagpopleName: string = tiledMapData.TILED_LAYER_FLAGPOLE;
  @property({
    readonly: true,
    displayName: "陆地层",
  })
  public layerLandName: string = tiledMapData.TILED_LAYER_LAND;
  @property({
    readonly: true,
    displayName: "山层",
  })
  public layerMountainName: string = tiledMapData.TILED_LAYER_MOUNTAIN;
  @property({
    readonly: true,
    displayName: "云层",
  })
  public layerColudName: string = tiledMapData.TILED_LAYER_CLOUD;

  public _coinLayer: cc.TiledLayer = null; //金币层
  public _trapLayer: cc.TiledLayer = null; //陷进
  public _landLayer: cc.TiledLayer = null; //陆地层
  public _blockLayer: cc.TiledLayer = null; //陆地上块层
  public _pipeLayer: cc.TiledLayer = null; //管道层
  public _flagpoleLayer: cc.TiledLayer = null; //旗子层
  public _tiledMap: cc.TiledMap = null;

  onLoad() {
    this.initLayer();
  }
  initLayer(): void {
    const tiledMap = this.node.getComponent(cc.TiledMap);
    this._tiledMap = tiledMap;
    this._trapLayer = tiledMap.getLayer(this.layerTrapName);
    this._coinLayer = tiledMap.getLayer(this.layerCoinName);
    this._landLayer = tiledMap.getLayer(this.layerLandName);
    this._blockLayer = tiledMap.getLayer(this.layerBlockName);
    this._pipeLayer = tiledMap.getLayer(this.layerPipeNameName);
    this._flagpoleLayer = tiledMap.getLayer(this.layerFlagpopleName);
    this._pipeLayer.node.zIndex = 1;
    this._blockLayer.node.zIndex = 1;
  }
  start() {}

  public isCollision(tiled: cc.Vec2, layerName: string): boolean {
    if (tiled.y < 0 || tiled.y > 13) return false;
    if (tiled.x < 0 || tiled.x > 227) return true;
    const tiledLayer = this._tiledMap.getLayer(layerName);
    return tiledLayer?.getTileGIDAt(tiled) !== 0;
  }

  public removeTiledTile(tiled: cc.Vec2, layerName: string) {
    const tiledLayer = this._tiledMap.getLayer(layerName);
    tiledLayer?.setTileGIDAt(0, tiled.x, tiled.y);
  }

  // update (dt) {}
}
