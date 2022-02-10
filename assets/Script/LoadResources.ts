import { createDtMgr } from "./Common/Utils";
import DataManage from "./Manager/DataManage";
const { ccclass, property } = cc._decorator;

@ccclass
export default class Load extends cc.Component {
  @property({
    displayName: "进度条",
    type: cc.ProgressBar,
  })
  public loadBar: cc.ProgressBar = null;

  public start(): void {
    createDtMgr("MapDtMgr", DataManage);
    createDtMgr("PrefabDtMgr", DataManage);
    createDtMgr("JsonDtMgr", DataManage);
    cc.resources.loadDir(
      "./",
      (finish, total, item) => {
        this.loadBar.progress = finish / total;
      },
      (error, assets) => {
        if (error) {
          return;
        }
        console.log(assets);
        for (let value of assets) {
          if (value instanceof cc.TiledMapAsset) {
            DataManage.getManager("MapDtMgr").addData(value.name, value);
          } else if (value instanceof cc.Prefab) {
            DataManage.getManager("PrefabDtMgr").addData(value.name, value);
          } else if (value instanceof cc.JsonAsset) {
            DataManage.getManager("JsonDtMgr").addData(value.name, value.json);
          }
        }
        //cc.find("Canvas/Root/Game").active = true;
        cc.director.loadScene("tiledMap");
      }
    );
  }
}
