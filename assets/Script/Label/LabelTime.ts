import EventScokoban from "../Common/event/eventTarget";
import LabelBase from "./LabelBase";

const { ccclass } = cc._decorator;

@ccclass
export default class LabelTime extends LabelBase {
  onLoad(): void {
    super.onLoad();
    this.schedule(() => {
      this.changeString(-1);
      if (this.numberData <= 0) {
        EventScokoban.emit("GameOver", true);
        this.unscheduleAllCallbacks();
      }
    }, 1);
  }
}
