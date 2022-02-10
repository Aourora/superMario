const { ccclass, property } = cc._decorator;

@ccclass
export default class LabelBase extends cc.Component {
  @property(cc.Label)
  label: cc.Label = null;
  @property({
    displayName: "初始数值",
    type: cc.Integer,
  })
  public initNumberData: number = 0;
  @property({
    displayName: "数值长度",
    type: cc.Integer,
  })
  public numberLength: number = 0;

  protected initString: string = "";
  protected numberData: number = 0;

  onLoad(): void {
    this.initString = this.label.string;
    this.changeString(this.initNumberData);
  }
  public changeString(num: number): void {
    this.numberData += num;
    this.label.string =
      this.initString + this.preFixZero(this.numberData, this.numberLength);
  }

  public resetString(): void {
    this.numberData = this.initNumberData;
    this.label.string =
      this.initString + this.preFixZero(this.initNumberData, this.numberLength);
  }

  protected preFixZero(num: number, n: number): string {
    return (Array(n).join("0") + num).slice(-n);
  }
}
