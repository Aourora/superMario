class AudioContainer {
  private static _isMute: boolean = false;
  static play(audioClip: cc.AudioClip, loop: boolean, volume: number): void {
    if (this._isMute) return;
    cc.audioEngine.play(audioClip, loop, volume);
  }

  static stopAllAudio(): void {
    cc.audioEngine.stopAllEffects();
  }

  static onAudio(): void {
    this._isMute = false;
    cc.audioEngine.setEffectsVolume(0.2);
  }
  static offAudio(): void {
    this._isMute = true;
    cc.audioEngine.setEffectsVolume(0);
  }
}
export default AudioContainer;
