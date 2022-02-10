import DataManage from "../Manager/DataManage";

const KeyCodeState: Record<number, string> = {
  [68]: "Right",
  [65]: "Left",
  [87]: "Up",
  [83]: "Down",
};

enum KeyState {
  RIGHT = "Right",
  LEFT = "Left",
  UP = "Up",
  DOWN = "Down",
}

enum HeroState {
  STAND = "idel",
  WALK = "Walk",
  JUMP = "Jump",
  DIE = "Die",
}

interface LabelData {
  type: string;
  value: number;
}

class DataItem {
  private dataObj: object = {};

  public getData(name: string): any {
    return this.dataObj[name];
  }

  public addData(name: string, data: any): void {
    this.dataObj[name] = data;
  }
}

function createDtMgr(name: string, obj?: DataManage): void {
  DataManage.addManager(name, new DataItem());
}

function deepClone(obj: any): any {
  let result = Array.isArray(obj) ? [] : {};
  for (let key in obj) {
    if (typeof obj[key] === "object") {
      result[key] = deepClone(obj[key]);
    } else {
      result[key] = obj[key];
    }
  }
  return result;
}

export {
  createDtMgr,
  DataItem,
  KeyCodeState,
  HeroState,
  deepClone,
  KeyState,
  LabelData,
};
