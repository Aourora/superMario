import Enemy from "./enemy";

const { ccclass, property } = cc._decorator;

@ccclass
export default class EnemyTortoise extends Enemy {
  @property(cc.Animation)
  protected animationComp: cc.Animation = null;

  public die(): boolean {
    const curAnimClip =
      this.animationComp.currentClip || this.animationComp.defaultClip;
    if (curAnimClip.name === "enemyTortoiseHome") {
      this.speed = 100;
      this.scheduleOnce(() => {
        this.speed = 0;
        this.unscheduleAllCallbacks();
      }, 1);
    } else {
      const clips = this.animationComp.getClips();
      this.animationComp.play(clips[1].name, 0);
      this.speed = 0;
      this.scheduleOnce(this._reset.bind(this), 3);
    }
    return false;
  }

  private _reset(): void {
    const clips = this.animationComp.getClips();
    this.animationComp.play(clips[2].name, 0);
    this.speed = 20;
  }
}
