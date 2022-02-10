import AudioContainer from "../AudioContainer";
import EventScokoban from "../Common/event/eventTarget";
import { LabelData } from "../Common/Utils";
import tiledMap from "../tileMap/tiledMap";
const { ccclass, property } = cc._decorator;

@ccclass
export default class Game extends cc.Component {
  @property(cc.Boolean)
  protected Debug: boolean = false;
  @property({
    displayName: "🐢乌龟",
    type: cc.Prefab,
  })
  public tortoisePrefab: cc.Prefab = null;
  @property({
    displayName: "🍄蘑菇",
    type: cc.Prefab,
  })
  public mushroomPrefab: cc.Prefab = null;
  @property({
    displayName: "🌺花朵",
    type: cc.Prefab,
  })
  public flowerPrefab: cc.Prefab = null;
  @property({
    displayName: "变大蘑菇",
    type: cc.Prefab,
  })
  public mushRoomRewardPrefab: cc.Prefab = null;
  @property({
    displayName: "加血蘑菇",
    type: cc.Prefab,
  })
  public mushRoomAddlifePrefab: cc.Prefab = null;
  @property({
    displayName: "🐱‍🚀玩家",
    type: cc.Prefab,
  })
  public heroPrefab: cc.Prefab = null;
  @property({
    displayName: "背景音乐",
    type: cc.AudioClip,
  })
  public audioClip: cc.AudioClip = null;
  @property({
    displayName: "地图",
    type: tiledMap,
  })
  public tiledMap: tiledMap = null;
  @property({
    displayName: "DieView",
    type: cc.Node,
  })
  protected dieViewNode: cc.Node = null;
  onLoad() {
    EventScokoban.release();
    AudioContainer.stopAllAudio();
    this.tiledMap.config(
      this.tortoisePrefab,
      this.mushroomPrefab,
      this.flowerPrefab,
      this.heroPrefab,
      this.mushRoomRewardPrefab,
      this.mushRoomAddlifePrefab
    );
    AudioContainer.play(this.audioClip, true, 0.2);
    EventScokoban.on(
      "GameOver",
      (bool: Boolean) => {
        if (bool || !this.Debug) {
          this._gameOver();
        }
      },
      this
    );
    EventScokoban.on(
      "DieViewOn",
      () => {
        this.dieViewNode.active = true;
      },
      this
    );
  }

  private _gameOver(): void {
    const data: LabelData = {
      type: "Hp",
      value: -1,
    };
    EventScokoban.emit("changeLabel", data);
    EventScokoban.emit("PlayerDie");
  }
}
