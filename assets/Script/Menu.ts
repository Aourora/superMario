const { ccclass } = cc._decorator;

@ccclass
export default class Menu extends cc.Component {
  public ACT_BtnStart(): void {
    cc.director.loadScene("Game");
  }
}
