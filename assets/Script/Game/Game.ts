import DataManage from "../Manager/DataManage";
import getManagers from "../Manager/Managers";
import TileMapCtrl from "./TileMapCtrl";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Game extends cc.Component {
  @property({
    displayName: "tileMapCtrl",
    type: TileMapCtrl,
  })
  public tiledMapCtrl: TileMapCtrl = null;

  onLoad() {
    this._createPlayer();

    this._registerManager();

    getManagers().initManager();
  }

  private _registerManager(): void {
    getManagers().addManager("TiledMapCtrl", this.tiledMapCtrl);
  }

  private _createPlayer(): void {
    const player = cc.instantiate(
      DataManage.getManager("PrefabDtMgr").getData("Player")
    );
    player.position = cc.v2(100, 100);
    const playerComp = player.getComponent("Player");
    playerComp.init(this.tiledMapCtrl.node);
    player.parent = this.node;
    this.tiledMapCtrl.target = player;
  }

  public start(): void {
    getManagers().lateInitManager();
  }

  public update(dt: number): void {
    getManagers().upDateManager(dt);
  }

  public lateUpdate(dt: number): void {
    getManagers().lateUpDateManager(dt);
  }
}
