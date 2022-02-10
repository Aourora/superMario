/**
 * enemy 种类
 * tortoise  乌龟
 * mushroom  蘑菇
 *
 * 左右移动
 * 1，移动方块是阻碍物则反向
 */

import TiledMap from "../tileMap/tiledMap";

const { ccclass, property } = cc._decorator;
enum DirEnum {
  LEFT,
  RIGHT,
}
@ccclass
export default class Enemy extends cc.Component {
  @property({
    displayName: "初始运动方向",
    type: cc.Enum(DirEnum),
  })
  protected initdir: DirEnum = DirEnum.LEFT;
  @property({
    displayName: "X方向速度",
    type: cc.Integer,
  })
  protected speed: number = 100;
  protected dir: number = 0;
  protected speedY: number = 0;
  protected tiledMap: TiledMap = null;

  onLoad() {
    this.tiledMap = this.node.parent.getComponent(TiledMap);
    this.dir = this.initdir ? 1 : -1;
  }

  update(dt: number) {
    const curPosition = cc.v2(this.node.x, this.node.y);
    const size = this.node.getContentSize();
    //判断是否站立在地面
    if (
      this.collision(curPosition, "land", cc.v2(0, -size.height / 2 - 10)) ||
      this.collision(curPosition, "block", cc.v2(0, -size.height / 2 - 10))
    ) {
      const position = curPosition.add(cc.v2(this.speed * dt * this.dir, 0));
      //判断移动后是否撞到地面建筑物
      if (
        this.collision(
          position,
          "block",
          cc.v2((size.width / 2) * this.dir, 0)
        ) ||
        this.collision(position, "pipe", cc.v2((size.width / 2) * this.dir, 0))
      ) {
        this.turnDir();
      } else if (
        this.collision(
          position,
          "trap",
          cc.v2(
            0,
            -(
              size.height / 2 +
              this.tiledMap.getTiledObject()._tileSize.height +
              10
            )
          )
        )
      ) {
        //判断移动后是否处于陷进层上方
        this.turnDir();
        this.node.x += this.speed * dt * this.dir;
        return;
      } else {
        this.node.setPosition(position);
      }
    } else {
      //自由落体
      this.speedY -= 1200 * dt;
      this.node.y += dt * this.speedY;
    }
  }

  protected turnDir(): void {
    this.node.scaleX *= -1;
    this.dir *= -1;
  }

  protected collision(
    position: cc.Vec2,
    layerName: string,
    offset: cc.Vec2
  ): boolean {
    const tiledObject = this.tiledMap.getTiledObject();
    const tiledLayer = this.tiledMap.getTiledLayer();

    const tiled = tiledObject.getTiledByPos(position.add(offset));
    if (tiledLayer.isCollision(tiled, layerName)) {
      return true;
    }
    return false;
  }

  public die(): boolean {
    return true;
  }
}
