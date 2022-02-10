import { KeyState, deepClone, LabelData } from "../../Common/Utils";
import Player from "../Player";
import EventScokoban from "../../Common/event/eventTarget";
import TiledMap from "../../tileMap/tiledMap";

class MoveCtrl {
  public owner: Player = null;
  public tiledMap: TiledMap = null;
  public MidPointX: number = 0;
  public jumpKeyTime: number = 0;
  public canvasWidth: number = 200;
  public leftBorder: number = 0;
  public rightBorder: number = 0;
  public isLand: boolean = false;
  constructor(target: Player, midPointX: number, tiledMap: TiledMap) {
    this.owner = target;
    this.MidPointX = midPointX + this.canvasWidth;
    this.leftBorder = midPointX;
    this.rightBorder = -midPointX;
    this.tiledMap = tiledMap;
  }
  public upData(dt: number): void {
    const { accel, maxSpeed, deceleration, keyState } = this.owner;
    const speed = deepClone(this.owner.speed);
    const size = this.owner.node.getContentSize();
    const tiledObject = this.tiledMap.getTiledObject();
    const tiledLayer = this.tiledMap.getTiledLayer();
    const offset = this.owner.getOffset();
    /**
     * 计算X方向
     */
    let dirX =
      (keyState.get(KeyState.RIGHT) ? 1 : 0) +
      (keyState.get(KeyState.LEFT) ? -1 : 0);
    /**
     * 计算加速还是减速
     */
    if ((dirX > 0 && speed.x >= 0) || (dirX < 0 && speed.x <= 0)) {
      /**
       * 加速
       */
      speed.x += dirX * dt * accel.x;
      if (Math.abs(speed.x) > maxSpeed.x) {
        speed.x = maxSpeed.x * dirX;
      }
    } else if (!dirX && !speed.x) {
      /**
       * 静止
       */
    } else {
      /**
       * 减速
       */
      dirX = dirX ? dirX : speed.x > 0 ? -1 : 1;
      speed.x += dirX * dt * deceleration.x;
      speed.x = speed.x < 0 === this.owner.speed.x < 0 ? speed.x : 0;
    }

    /**
     * 计算Y方向
     */

    //没有上升到最大高度时松开按键
    if (this.jumpKeyTime != 0 && !keyState.get(KeyState.UP)) {
      this.jumpKeyTime = 0;
      this.isLand = true;
    }

    //长按跳跃键
    if (keyState.get(KeyState.UP) && !this.isLand) {
      if (this.jumpKeyTime) {
        this.owner.playJumpAudio();
      }
      this.jumpKeyTime += dt;
      if (this.jumpKeyTime >= this.owner.jumpTime) {
        this.jumpKeyTime = 0;
        this.isLand = true;
      }
      speed.y = 300;
    }

    if (this.jumpKeyTime == 0) {
      speed.y -= dt * deceleration.y;
    }
    const position = cc.v2(
      this.owner.node.x + speed.x * dt,
      this.owner.node.y + speed.y * dt
    );
    if (speed.y <= 0) {
      //下降过程Y方向碰撞检测
      if (
        this.collisionLand(
          position,
          "land",
          cc.v2(0, -size.height / 2 + offset)
        ) ||
        this.collisionLand(
          position,
          "block",
          cc.v2(0, -size.height / 2 + offset)
        ) ||
        this.collisionLand(
          position,
          "pipe",
          cc.v2(0, -size.height / 2 + offset)
        )
      ) {
        if (!keyState.get(KeyState.UP)) {
          this.isLand = false;
        }
        speed.y = 0;
      }
      //是否掉进陷进层
      if (
        this.collisionLand(
          position,
          "trap",
          cc.v2(0, -size.height / 2 + offset)
        )
      ) {
        EventScokoban.emit("GameOver", true);
      }
    } else {
      //上升过程Y方向碰撞检测
      if (
        this.collisionLand(
          position,
          "block",
          cc.v2(0, size.height / 2 + offset / 2)
        )
      ) {
        this.jumpKeyTime = 0;
        this.isLand = true;
        speed.y = 0;
        const rect = cc.rect(
          this.owner.node.x,
          this.owner.node.y + offset,
          size.width,
          size.height
        );
        const nodes = tiledObject.getCollisionPropNodes(rect);
        if (nodes.length > 0) {
          nodes.forEach((node) => (node.active = true));
          tiledObject._propNodes.push(...nodes);
        }
      }
    }
    if (speed.x < 0) {
      //-X方向检测
      if (this._collisionLand(position, size, -1)) {
        speed.x = 0;
      }
    } else {
      //X方向检测
      if (this._collisionLand(position, size, 1)) {
        speed.x = 0;
      }
    }

    //是否捡到道具
    const propNodes = tiledObject.getCollisionPropNodes(
      this.owner.node.getBoundingBox()
    );
    if (propNodes.length > 0) {
      propNodes.forEach((node) => {
        if (!node.active) {
          tiledObject._propNodes.push(node);
          return;
        }
        if (node.name === "mushRoom_reward") {
          this.owner.changeBig();
        } else {
          const data: LabelData = {
            type: "Hp",
            value: 1,
          };
          EventScokoban.emit("changeLabel", data);
        }
        node.removeFromParent();
      });
    }

    //是否与coin碰撞
    const tiled = tiledObject.getTiledByPos(position);
    if (tiledLayer.isCollision(tiled, "coin")) {
      this.owner.playCoinAudio();
      tiledLayer.removeTiledTile(tiled, "coin");
      const data: LabelData = {
        type: "coin",
        value: 1,
      };
      EventScokoban.emit("changeLabel", data);
    }

    //与怪物碰撞
    const nodes = tiledObject.getCollisionNodes(
      this.owner.node.getBoundingBox()
    );
    const enemyComps = nodes
      .map((node) => node.getComponent("enemy"))
      .filter((comp) => !!comp);
    if (
      (nodes.length > 0 && speed.y >= 0) ||
      nodes.length !== enemyComps.length
    ) {
      //玩家死亡

      if (this.owner.changeSmall()) {
        enemyComps.forEach((comp) => {
          if (!comp.die()) {
            tiledObject._enemyNodes.push(comp.node);
          }
        });
      } else {
        EventScokoban.emit("GameOver", false);
        nodes.forEach((node) => tiledObject._enemyNodes.push(node));
      }
    } else if (nodes.length > 0) {
      //踩死怪物
      this.owner.playenemyAudio();
      enemyComps.forEach((comp) => {
        if (!comp.die()) {
          tiledObject._enemyNodes.push(comp.node);
        }
      });
      speed.y = 300;
    }

    this.owner.speed.x = speed.x;
    this.upDataX(speed.x * dt);
    this.owner.speed.y = speed.y;
    this.owner.node.y += speed.y * dt;
  }
  /**
   *
   * @param offsetX X方向移动距离
   */
  private upDataX(offsetX: number): void {
    offsetX = parseInt(offsetX.toString());
    const posX = this.owner.node.x + offsetX;
    const size = this.owner.node.getContentSize();
    if (
      posX <= size.width / 2 + this.leftBorder ||
      posX >= this.rightBorder - size.width / 2
    )
      return;
    this.owner.node.x += offsetX;
    if (posX >= this.MidPointX && posX + this.canvasWidth <= this.rightBorder) {
      this.leftBorder += offsetX;
      this.MidPointX += offsetX;
      EventScokoban.emit("map-Move", -offsetX);
    }
  }

  public collisionLand(
    playerPosition: cc.Vec2,
    layerName: string,
    offset: cc.Vec2
  ): boolean {
    const tiledObject = this.tiledMap.getTiledObject();
    const tiledLayer = this.tiledMap.getTiledLayer();
    //是否与Land/block碰撞
    const tiled = tiledObject.getTiledByPos(playerPosition.add(offset));
    if (tiledLayer.isCollision(tiled, layerName)) {
      return true;
    }
    return false;
  }

  protected _collisionLand(
    position: cc.Vec2,
    size: cc.Size,
    dir: number
  ): boolean {
    if (
      this.collisionLand(position, "block", cc.v2((dir * size.width) / 2, 0)) ||
      this.collisionLand(
        position,
        "block",
        cc.v2((dir * size.width) / 2, size.height / 2 + 5)
      ) ||
      this.collisionLand(
        position,
        "block",
        cc.v2((dir * size.width) / 2, -size.height / 2 + 15)
      ) ||
      this.collisionLand(position, "pipe", cc.v2((dir * size.width) / 2, 0)) ||
      this.collisionLand(
        position,
        "pipe",
        cc.v2((dir * size.width) / 2, size.height / 2 + 5)
      ) ||
      this.collisionLand(
        position,
        "pipe",
        cc.v2((dir * size.width) / 2, -size.height / 2 + 15)
      )
    ) {
      return true;
    }
    return false;
  }
}

export { MoveCtrl };
