import { DataItem } from "../Common/Utils";
const { ccclass } = cc._decorator;

@ccclass("DataManage")
export default class DataManage {
  private static objMgr: object = Object.create(null);

  public static addManager(name: string, obj: DataItem): void {
    if (!this.objMgr[name]) {
      this.objMgr[name] = obj;
    }
  }

  public static getManager(name: string): DataItem {
    return this.objMgr[name];
  }

  public static removeManager(name: string): void {
    delete this.objMgr[name];
  }

  public static clear(): void {
    for (let key in this.objMgr) {
      delete this.objMgr[key];
    }
  }
}
