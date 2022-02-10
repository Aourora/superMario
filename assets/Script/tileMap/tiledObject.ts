import tiledMapData from "./tiledMapData";
import {
  OBJECT_ENEMY_MAP,
  OBJECT_ENEMY_MUSHROOM,
  OBJECT_ENEMY_FLOWER,
  OBJECT_ENEMY_TORTOISE,
  OBJECT_OTHERS_BIRTH_POINT,
  OBJECT_MUSHROOM_REWARD,
  OBJECT_MUSHROOM_ADDLIFE,
} from "../Common/constant";
const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {
  public _objectGroupName: string = "objects";
  public _objectGroup: cc.TiledObjectGroup = null;
  public _tiledMap: cc.TiledMap = null;
  public _tortoisePre: cc.Prefab = null;
  public _mushroomPre: cc.Prefab = null;
  public _flowerPre: cc.Prefab = null;
  public _background: cc.TiledLayer = null;
  public _tileSize: cc.Size = null;
  public _enemyNodes: cc.Node[] = [];
  public _propNodes: cc.Node[] = [];
  onLoad() {}
  getTiledMap(): cc.TiledMap {
    if (this._tiledMap) return this._tiledMap;
    this._tiledMap = this.node.getComponent(cc.TiledMap);
    return this._tiledMap;
  }
  initObjects(): void {
    this._tiledMap = this.getTiledMap();
    this._tileSize = this._tiledMap.getTileSize();
    this._background = this._tiledMap.getLayer("background");
    this._objectGroup = this._tiledMap.getObjectGroup(this._objectGroupName);
    console.log(this._tiledMap);
  }
  config(
    tortoisePrefab: cc.Prefab,
    mushroomPrefab: cc.Prefab,
    flowerPrefab: cc.Prefab,
    heroPrefab: cc.Prefab,
    MushroomReward: cc.Prefab,
    MushroomAddlife: cc.Prefab
  ): void {
    this.initObjects();
    this.initEnemy(tortoisePrefab, mushroomPrefab, flowerPrefab);
    this.initHero(heroPrefab);
    this.initMushroom(MushroomReward, MushroomAddlife);
  }
  initEnemy(
    tortoisePrefab: cc.Prefab,
    mushroomPrefab: cc.Prefab,
    flowerPrefab: cc.Prefab
  ): void {
    const objects = this._objectGroup.getObjects();
    objects.forEach((object) => {
      const enemyType = object["enemy"];
      // console.log(object);
      if (enemyType) {
        if (enemyType === OBJECT_ENEMY_MUSHROOM) {
          this.generateEnemy(mushroomPrefab, object);
        } else if (enemyType == OBJECT_ENEMY_FLOWER) {
          this.generateEnemy(flowerPrefab, object);
        } else if (enemyType === OBJECT_ENEMY_TORTOISE) {
          this.generateEnemy(tortoisePrefab, object);
        }
      }
    });
  }
  initHero(heroPre: cc.Prefab): void {
    const objects = this._objectGroup.getObjects();
    objects.forEach((object) => {
      if (object["others"]) {
        const enemyType = object["others"];
        if (enemyType === OBJECT_OTHERS_BIRTH_POINT) {
          this.generateEnemy(heroPre, object, "player");
        }
      }
    });
  }
  initMushroom(MushroomReward: cc.Prefab, MushroomAddlife: cc.Prefab): void {
    const objects = this._objectGroup.getObjects();
    objects.forEach((object) => {
      const enemyType = object["mushroom"];
      // console.log(object);
      if (enemyType) {
        if (enemyType === OBJECT_MUSHROOM_REWARD) {
          const node = this.generateEnemy(
            MushroomReward,
            object,
            "mushRoom_reward"
          );
          const mapSize = this._tiledMap.getMapSize();
          node.y -= mapSize.height;
          this._propNodes.push(node);
        } else if (enemyType == OBJECT_MUSHROOM_ADDLIFE) {
          const node = this.generateEnemy(
            MushroomAddlife,
            object,
            "mushRoom_addlife"
          );
          const mapSize = this._tiledMap.getMapSize();
          node.y -= mapSize.height - 3;
          this._propNodes.push(node);
        }
      }
    });
  }
  generateEnemy(
    enemyPre: cc.Prefab,
    point: Object,
    name: string = "enemy"
  ): cc.Node {
    console.log(point);
    const newNode = cc.instantiate(enemyPre);
    newNode.name = name;
    newNode.parent = this.node;
    const title = this._getTileByPixel(point);
    const enemyPoint = this._getTilePixel(title);
    newNode.setPosition(enemyPoint);
    if (name === "enemy") {
      this._enemyNodes.push(newNode);
    }
    return newNode;
  }
  //得到是 左下角的 tile
  _getTileByPixel(posInPixel: any): cc.Vec2 {
    var mapSize = this.node.getContentSize();
    var x = Math.floor(posInPixel.x / this._tileSize.width);
    var y = Math.floor((mapSize.height - posInPixel.y) / this._tileSize.height);
    return cc.v2(x, y);
  }
  _getTilePixel(tile: cc.Vec2) {
    //获得块的左下角为锚点的坐标
    let pixel = this._background.getPositionAt(tile);
    var mapSize = this.node.getContentSize();
    var tileSize = this._tiledMap.getTileSize();
    let halfW = mapSize.width / 2,
      halfH = mapSize.height / 2;
    //坐标移到地图中间为 (0,0) 与 cocos 统一
    let x = pixel.x - halfW + tileSize.width / 2,
      y = pixel.y - halfH + tileSize.height / 2;
    return cc.v2(x, y);
  }

  //得到当前格子坐标
  public getTiledByPos(pos: cc.Vec2): cc.Vec2 {
    const mapPixSize = this.node.getContentSize();
    pos = pos.add(cc.v2(mapPixSize.width / 2, mapPixSize.height / 2));
    const mapSize = this._tiledMap.getMapSize();
    let tileX = Math.floor(pos.x / this._tileSize.width);
    let tileY = mapSize.height - Math.floor(pos.y / this._tileSize.height) - 1;
    return cc.v2(tileX, tileY);
  }

  public getBirthPoint(): cc.Vec2 {
    const objects = this._objectGroup.getObjects();
    let result: cc.Vec2 = null;
    objects.forEach((object) => {
      if (object["others"]) {
        const enemyType = object["others"];
        if (enemyType === OBJECT_OTHERS_BIRTH_POINT) {
          const title = this._getTileByPixel(object);
          result = this._getTilePixel(title);
        }
      }
    });
    return result;
  }

  public getCollisionNodes(rect: cc.Rect): cc.Node[] {
    const arrNodes: cc.Node[] = [];
    const tempNodes: cc.Node[] = [];
    this._enemyNodes.forEach((node) => {
      if (rect.intersects(node.getBoundingBox())) {
        arrNodes.push(node);
      } else {
        tempNodes.push(node);
      }
    });
    this._enemyNodes.length = 0;
    this._enemyNodes = tempNodes;
    return arrNodes;
  }
  public getCollisionPropNodes(rect: cc.Rect): cc.Node[] {
    const arrNodes: cc.Node[] = [];
    const tempNodes: cc.Node[] = [];
    this._propNodes.forEach((node) => {
      if (rect.intersects(node.getBoundingBox())) {
        arrNodes.push(node);
      } else {
        tempNodes.push(node);
      }
    });
    this._propNodes.length = 0;
    this._propNodes = tempNodes;
    return arrNodes;
  }
}
