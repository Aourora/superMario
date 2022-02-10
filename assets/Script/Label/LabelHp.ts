import LabelBase from "./LabelBase";

const { ccclass, property } = cc._decorator;

@ccclass
export default class LabelHp extends LabelBase {
  @property({
    displayName: "button背景节点",
    type: cc.Sprite,
  })
  protected buttonSprite: cc.Sprite = null;
  @property({
    displayName: "继续游戏",
    type: cc.SpriteFrame,
  })
  protected resumeSpriteFrame: cc.SpriteFrame = null;
  @property({
    displayName: "重新开始",
    type: cc.SpriteFrame,
  })
  protected startSpriteFrame: cc.SpriteFrame = null;
  protected hp: number = 3;
  protected string: string = "X";

  onLoad(): void {}
  public changeString(num: number): void {
    this.hp += num;
    this.label.string =
      this.string + this.preFixZero(this.hp, this.numberLength);
    if (this.hp <= 0) {
      this.buttonSprite.spriteFrame = this.startSpriteFrame;
    } else {
      this.buttonSprite.spriteFrame = this.resumeSpriteFrame;
    }
  }

  public ACT_StartGame(): void {
    cc.director.resume();
    cc.director.loadScene("Game");
  }
}
