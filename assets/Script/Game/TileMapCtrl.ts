import DataManage from "../Manager/DataManage";

const { ccclass, property } = cc._decorator;

@ccclass
export default class TileMapCtrl extends cc.Component {
  public target: cc.Node = null;
  public start(): void {
    this.node.getComponent(cc.TiledMap).tmxAsset =
      DataManage.getManager("MapDtMgr").getData("MarioMap1");
  }
  public update(dt: number): void {
    // if (!this.target) return;
    // const w_pos = this.target.convertToWorldSpaceAR(cc.Vec2.ZERO);
    // const c_pos = this.node.parent.convertToNodeSpaceAR(w_pos);
    // console.log(c_pos.x);
    // this.node.x = c_pos.x;
  }
}
