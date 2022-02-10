/**
 * 道具
 * mushroom 蘑菇
 *
 */

import TiledMap from "../tileMap/tiledMap";

const { ccclass, property } = cc._decorator;
enum DirEnum {
  LEFT,
  RIGHT,
}
@ccclass
export default class Prop extends cc.Component {
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

  protected isEnter: boolean = false;

  onLoad(): void {
    this.tiledMap = this.node.parent.getComponent(TiledMap);
    this.dir = this.initdir ? 1 : -1;
    this.node.runAction(
      cc.sequence(
        cc.moveBy(0.5, 0, 15),
        cc.callFunc(() => {
          this.isEnter = true;
        })
      )
    );
  }

  update(dt: number) {
    if (!this.isEnter) return;
    const curPosition = cc.v2(this.node.x, this.node.y);
    const size = this.node.getContentSize();
    //判断是否站立在地面
    if (
      this.collision(curPosition, "land", cc.v2(0, -size.height / 2 - 4)) ||
      this.collision(curPosition, "block", cc.v2(0, -size.height / 2 - 4))
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
              4
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

  protected turnDir(): void {
    this.node.scaleX *= -1;
    this.dir *= -1;
  }
}
