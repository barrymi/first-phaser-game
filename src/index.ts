import "phaser";
// import { GameScene } from './GameScene';
// import PhaserGame from './PhaserGame';
import FirstGame from './FirstGame';

const config: GameConfig = {
  title: "Starfall",
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  parent: "game",
  scene: [FirstGame],
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 300 },
      debug: false
    }
  },
  backgroundColor: "#18216D"
};

export class SampleGame extends Phaser.Game {
  constructor(config: GameConfig) {
    super(config);
  }
};

window.onload = () => {
  var game = new SampleGame(config);
};