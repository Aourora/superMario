import { HeroState } from "../../Common/Utils";
import Player from "../Player";

/**
 * 状态控制脚本
 */
export default class StateCtrl {
  public owner: Player = null;
  public anim: cc.Animation = null;
  public currentState: string = HeroState.STAND;

  constructor(target: Player) {
    this.owner = target;
    this.anim = this.owner.getComponent(cc.Animation);
  }

  public upDate(): void {
    this._setHeroScaleX();
    const state: string = this.owner.curState + this._getHeroState();
    if (state === this.currentState) return;

    this.currentState = state;
    if ("idel" === state) {
      let curAniClip = this.anim.currentClip;
      if (!curAniClip) {
        return;
      }
      this.anim.play(curAniClip.name, 0);
      this.anim.sample(curAniClip.name);
      this.anim.stop();
      return;
    }
    this.anim.play(state);
  }
  /**
   * 状态获取优先级
   * 1.死亡状态
   * 2.跳跃状态
   * 3.行走状态/站立状态
   */
  private _getHeroState(): HeroState {
    if (this.owner.speed.y !== 0) {
      return HeroState.JUMP;
    } else if (this.owner.speed.x === 0 && this.owner.speed.y === 0) {
      return HeroState.STAND;
    } else {
      return HeroState.WALK;
    }
  }

  /**
   * 设置Hero方向偏转
   */
  private _setHeroScaleX(): void {
    const { speed } = this.owner;
    if (speed.x > 0) {
      this.owner.node.scaleX = 1;
    } else if (speed.x < 0) {
      this.owner.node.scaleX = -1;
    }
  }
}
