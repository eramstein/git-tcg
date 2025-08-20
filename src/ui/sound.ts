// Sound effects for battle actions
class SoundManager {
  private sounds: Map<string, HTMLAudioElement> = new Map();

  constructor() {
    this.preloadSounds();
  }

  private preloadSounds() {
    const soundFiles = {
      'karate-chop': '/src/assets/sounds/karate-chop.mp3',
      'power-punch': '/src/assets/sounds/power-punch.mp3',
      'drop-tile': '/src/assets/sounds/jumpland.mp3',
      'destroy-tile': '/src/assets/sounds/power-punch.mp3',
    };

    for (const [name, path] of Object.entries(soundFiles)) {
      const audio = new Audio(path);
      audio.preload = 'auto';
      this.sounds.set(name, audio);
    }
  }

  playSound(soundName: string) {
    const sound = this.sounds.get(soundName);
    if (sound) {
      // Reset to beginning and play
      sound.currentTime = 0;
      sound.play().catch((error) => {
        console.warn('Failed to play sound:', soundName, error);
      });
    }
  }

  playAttackSound(attackerPower: number) {
    if (attackerPower <= 3) {
      this.playSound('karate-chop');
    } else {
      this.playSound('power-punch');
    }
  }

  playDeploySound() {
    this.playSound('drop-tile');
  }

  playDestroySound() {
    this.playSound('destroy-tile');
  }
}

// Create a singleton instance
export const soundManager = new SoundManager();
