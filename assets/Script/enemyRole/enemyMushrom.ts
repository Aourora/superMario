import Enemy from "./enemy";

const { ccclass, property } = cc._decorator;

@ccclass
export default class EnemtMushrom extends Enemy {
  @property(cc.Animation)
  protected animationComp: cc.Animation = null;

  public die(): boolean {
    this.node.y -= 5;
    const clips = this.animationComp.getClips();
    this.animationComp.play(clips[1].name, 0);
    this.node.runAction(
      cc.sequence(
        cc.delayTime(0.24),
        cc.callFunc(() => {
          this.node.removeFromParent();
        })
      )
    );
    return true;
  }
}
