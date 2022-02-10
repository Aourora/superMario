const { ccclass, property } = cc._decorator;

@ccclass
export default class EnemyFlower extends cc.Component {
  @property({
    displayName: "出现时间间隔",
    type: cc.Integer,
  })
  protected showTime: number = 2;
  protected offset: cc.Vec2 = cc.v2(-8, -25);
  protected initPosition: cc.Vec2 = null;
  onLoad() {
    this.node.active = false;
    this.schedule(() => {
      this.node.active = true;
      this.initPosition = this.initPosition || this.node.getPosition();
      this.node.setPosition(this.initPosition.add(this.offset));
      this.node.runAction(
        cc.sequence(cc.moveBy(1, cc.v2(0, 27)), cc.moveBy(1, cc.v2(0, -27)))
      );
    }, this.showTime);
  }
}
