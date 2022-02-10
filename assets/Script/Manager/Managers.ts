//创建这个的目的是为了要存储所有被总控制脚本管理的所有脚本对象。
class Managers {
  public objMgr: object = {};
  addManager(name: string, obj: any) {
    if (!this.objMgr[name]) {
      this.objMgr[name] = obj;
    }
  }

  getManager(name: string) {
    return this.objMgr[name];
  }

  removeManager(name: string) {
    delete this.objMgr[name];
  }

  clear() {
    for (let key in this.objMgr) {
      delete this.objMgr[key];
    }
  }

  //可以一次性初始化这个管理者所存储的所有被game管理的脚本对象的init
  initManager() {
    for (let key in this.objMgr) {
      if (this.objMgr[key].init) {
        this.objMgr[key].init();
      }
    }
  }

  lateInitManager() {
    for (let key in this.objMgr) {
      if (this.objMgr[key].lateInit) {
        this.objMgr[key].lateInit();
      }
    }
  }

  upDateManager(dt: number) {
    for (let key in this.objMgr) {
      if (this.objMgr[key].upDate) {
        this.objMgr[key].upDate(dt);
      }
    }
  }

  lateUpDateManager(dt: number) {
    for (let key in this.objMgr) {
      if (this.objMgr[key].lateUpDate) {
        this.objMgr[key].lateUpDate(dt);
      }
    }
  }
}

let instance = null;
export default function getManagers(): Managers {
  if (!instance) {
    instance = new Managers();
  }
  return instance;
}
