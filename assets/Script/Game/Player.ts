import AudioContainer from "../AudioContainer";
import EventScokoban from "../Common/event/eventTarget";
import { KeyCodeState } from "../Common/Utils";
import TiledMap from "../tileMap/tiledMap";
import { MoveCtrl } from "./Ctrl/MoveCtrl";
import StateCtrl from "./Ctrl/StateCtrl";
const { ccclass, property } = cc._decorator;

@ccclass
export default class Player extends cc.Component {
  @property({
    displayName: "加速度",
  })
  public accel: cc.Vec2 = cc.v2(0, 0);
  @property({
    displayName: "减速度",
  })
  public deceleration: cc.Vec2 = cc.v2(0, 0);
  @property({
    displayName: "最大速度",
  })
  public maxSpeed: cc.Vec2 = cc.v2(300, 300);
  @property({
    displayName: "跳跃初始速度",
  })
  public jumpInitSpeed: number = 300;
  @property({
    displayName: "跳跃蓄力时长",
  })
  public jumpTime: number = 0.3;
  @property({
    displayName: "跳跃音效",
    type: cc.AudioClip,
  })
  public jumpAudioClip: cc.AudioClip = null;
  @property({
    displayName: "金币音效",
    type: cc.AudioClip,
  })
  public coinAudioClip: cc.AudioClip = null;
  @property({
    displayName: "敌人音效",
    type: cc.AudioClip,
  })
  public enemyAudioClip: cc.AudioClip = null;
  @property({
    displayName: "死亡音效",
    type: cc.AudioClip,
  })
  public dieAudioClip: cc.AudioClip = null;
  public speed: cc.Vec2 = cc.v2(0, 0);
  public keyState: Map<string, boolean> = new Map();
  public moveCtrl: MoveCtrl = null;
  public stateCtrl: StateCtrl = null;
  public Hp: number = 10;
  public curState: string = "small";
  onLoad(): void {
    cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onkeyDown, this);
    cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onkeyUp, this);
    EventScokoban.on("PlayerDie", this._die, this);

    //移动控制脚本
    const midPointX = -this.node.parent.width / 2;
    const tileMap = this.node.parent.getComponent(TiledMap);
    this.moveCtrl = new MoveCtrl(this, midPointX, tileMap);
    //状态控制脚本
    this.stateCtrl = new StateCtrl(this);
    this.node.zIndex = 2;
  }
  public onkeyDown(event: any): void {
    const key = KeyCodeState[event.keyCode];
    if (key === undefined) return;
    this.keyState.set(key, true);
  }
  public onkeyUp(event: any): void {
    const key = KeyCodeState[event.keyCode];
    if (key === undefined) return;
    this.keyState.set(key, false);
  }
  update(dt: number): void {
    this.moveCtrl.upData(dt);
    this.stateCtrl.upDate();
  }
  onDestroy(): void {
    cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.onkeyDown, this);
    cc.systemEvent.off(cc.SystemEvent.EventType.KEY_UP, this.onkeyUp, this);
  }

  protected _die(): void {
    this.update = function () {};
    this.playDieAudio();
    this.getComponent(cc.Animation).play(this.curState + "Die");
    this.node.runAction(
      cc.sequence(
        cc.moveBy(0.7, cc.v2(0, 80)),
        cc.moveBy(0.7, cc.v2(0, -130)),
        cc.callFunc(() => {
          cc.director.pause();
          EventScokoban.emit("DieViewOn");
        })
      )
    );
  }

  public playJumpAudio(): void {
    AudioContainer.play(this.jumpAudioClip, false, 0.3);
  }
  public playCoinAudio(): void {
    AudioContainer.play(this.coinAudioClip, false, 0.3);
  }
  public playenemyAudio(): void {
    AudioContainer.play(this.enemyAudioClip, false, 0.3);
  }
  public playDieAudio(): void {
    AudioContainer.stopAllAudio();
    AudioContainer.play(this.dieAudioClip, false, 0.3);
  }

  public getOffset(): number {
    return this.curState === "Big" ? 10 : 5;
  }

  public changeBig(): void {
    this.curState = "Big";
  }

  public changeSmall(): Boolean {
    if (this.curState === "small") return false;
    this.curState = "small";
    return true;
  }
}
