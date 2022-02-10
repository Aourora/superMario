import EventScokoban from "../Common/event/eventTarget";
import { LabelData } from "../Common/Utils";
import LabelItem from "./LabelBase";
const { ccclass, property } = cc._decorator;

@ccclass
export default class LabelContainer extends cc.Component {
  @property({
    displayName: "score",
    type: LabelItem,
  })
  public scoreLabel: LabelItem = null;

  @property({
    displayName: "coin",
    type: LabelItem,
  })
  public coinLabel: LabelItem = null;

  @property({
    displayName: "word",
    type: LabelItem,
  })
  public wordLabel: LabelItem = null;

  @property({
    displayName: "time",
    type: LabelItem,
  })
  public timeLabel: LabelItem = null;
  @property({
    displayName: "Hp",
    type: LabelItem,
  })
  public HpLabel: LabelItem = null;

  onLoad(): void {
    EventScokoban.on("changeLabel", this.changeLabel, this);
  }

  protected changeLabel(data: LabelData): void {
    switch (data.type) {
      case "coin":
        this.coinLabel.changeString(data.value);
        break;
      case "Hp":
        this.HpLabel.changeString(data.value);
        break;
    }
  }
}
