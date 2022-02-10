/**
 * map 初始化
 */
import tiledMapData from "./tiledMapData";
import tileLayer from "./tiledLayer";
import tiledObject from "./tiledObject";

import EventScokoban from "../Common/event/eventTarget";
const { ccclass, property } = cc._decorator;

@ccclass
export default class TiledMap extends cc.Component {
  private _tiledMap: cc.TiledMap;
  private _tiledLayer: tileLayer;
  private _tiledObject: tiledObject;
  onLoad() {
    this.test();
  }

  public config(
    tortoisePrefab: cc.Prefab,
    mushroomPrefab: cc.Prefab,
    flowerPrefab: cc.Prefab,
    heroPrefab: cc.Prefab,
    MushroomReward: cc.Prefab,
    MushroomAddlife: cc.Prefab
  ): void {
    this._tiledObject = this.node.getComponent(tiledObject);
    this._tiledLayer = this.node.getComponent(tileLayer);
    this._tiledObject.config(
      tortoisePrefab,
      mushroomPrefab,
      flowerPrefab,
      heroPrefab,
      MushroomReward,
      MushroomAddlife
    );
  }
  getTiledMap(): cc.TiledMap {
    if (this._tiledMap) return this._tiledMap;
    this._tiledMap = this.node.getComponent(cc.TiledMap);
    return this._tiledMap;
  }
  getTiledLayer(): tileLayer {
    return this._tiledLayer;
  }
  getTiledObject(): tiledObject {
    return this._tiledObject;
  }
  test(): void {
    EventScokoban.on(
      "map-Move",
      (offsetX: number) => {
        this.node.x += offsetX;
      },
      this
    );
    // this.node.on(
    //     cc.Node.EventType.TOUCH_START,
    //     function () {
    //         cc.log('Drag stated ...');
    //         // this.opacity = 255;
    //     },
    //     this.node
    // );
    // this.node.on(
    //     cc.Node.EventType.TOUCH_MOVE,
    //      (event:any)=> {
    //         var delta = event.touch.getDelta();
    //         this.node.x += delta.x;
    //         this.node.y += delta.y;
    //         // if (this.getComponent(TouchDragger).propagate)
    //         //     event.stopPropagation();
    //     },
    //     this.node
    // );
    // this.node.on(cc.Node.EventType.TOUCH_END, function () {
    //     this.opacity = 160;
    // }, this.node);
  }
  // update (dt) {}
}
