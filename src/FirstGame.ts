import * as Phaser from 'phaser';

class FirstGame extends Phaser.Scene {

  player!: Phaser.Physics.Arcade.Sprite;
  cursors!: Phaser.Input.Keyboard.CursorKeys;
  stars!: Phaser.Physics.Arcade.Group;
  bombs!: Phaser.Physics.Arcade.Group;
  score: integer;
  gameOver: boolean;
  scoreText!: Phaser.GameObjects.Text;

  constructor() {
    super({
      key: 'FirstGame'
    })
    this.score = 0;
    this.gameOver = false;
  }

  preload(): void {
    this.load.image('sky', 'assets/sky.png');
    this.load.image('ground', 'assets/platform.png');
    this.load.image('star', 'assets/star.png');
    this.load.image('bomb', 'assets/bomb.png');
    this.load.spritesheet('dude', 
        'assets/dude.png',
        { frameWidth: 32, frameHeight: 48 }
    );
  }

  create(): void {
    this.add.image(400, 300, 'sky');
    this.scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: '#000' });

    const platforms = this.physics.add.staticGroup();

    platforms.create(400, 568, 'ground').setScale(2).refreshBody();

    platforms.create(600, 400, 'ground');
    platforms.create(50, 250, 'ground');
    platforms.create(750, 220, 'ground');

    this.player = this.createPlayer();
    this.physics.add.collider(this.player, platforms);

    this.cursors = this.addKeyboardControlsTo();

    this.stars = this.createStars();
    this.physics.add.collider(this.stars, platforms);

    // Check to see if player overlaps a star.
    this.physics.add.overlap(this.player, this.stars, this.collectStar, undefined, this);

    this.bombs = this.physics.add.group();
    this.physics.add.collider(this.bombs, platforms);
    this.physics.add.collider(this.player, this.bombs, this.hitBomb, undefined, this);
  }

  update() {
    if (this.cursors.left && this.cursors.left.isDown) {
      this.player.setVelocityX(-160);
      this.player.anims.play('left', true);
    } else if (this.cursors.right && this.cursors.right.isDown) {
      this.player.setVelocityX(160);
      this.player.anims.play('right', true);
    } else {
      this.player.setVelocityX(0);
      this.player.anims.play('turn');
    }

    if (
      this.cursors.up 
        && this.cursors.up.isDown 
        && this.player.body.touching.down
    ) {
      this.player.setVelocityY(-330);
    }
  }

  private createPlayer(): Phaser.Physics.Arcade.Sprite {
    const player = this.physics.add.sprite(100, 450, 'dude');

    player.setBounce(0.2);
    player.setCollideWorldBounds(true);

    this.anims.create({
      key: 'left',
      frames: this.anims.generateFrameNumbers('dude', {
        start: 0,
        end: 3
      }),
      frameRate: 10,
      repeat: -1
    });

    this.anims.create({
      key: 'turn',
      frames: [
        {
          key: 'dude',
          frame: 4
        }
      ],
      frameRate: 20
    });

    this.anims.create({
      key: 'right',
      frames: this.anims.generateFrameNumbers('dude', {
        start: 5,
        end: 8
      }),
      frameRate: 10,
      repeat: -1
    });

    return player;
  }

  private addKeyboardControlsTo() {
    return this.input.keyboard.createCursorKeys();
  }

  private createStars(): Phaser.Physics.Arcade.Group {
    const stars = this.physics.add.group({
      key: 'star',
      repeat: 11,
      setXY: { x: 12, y: 0, stepX: 70 }
    });
    
    stars.children.iterate(function(child) {
        child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
    }, this);

    return stars;
  }

  private collectStar(player, star: Phaser.Physics.Arcade.Sprite) {
    star.disableBody(true, true);
    
    this.score += 10;
    this.scoreText.setText('Score: ' + this.score);

    if (this.stars.countActive(true) === 0) {
      this.stars.children.iterate(function(child) {
        child.enableBody(true, child.x, 0, true, true);
      }, this);

      const x = this.player.x < 400 
          ? Phaser.Math.Between(400, 800) 
          : Phaser.Math.Between(0, 400);

      const bomb: Phaser.Physics.Arcade.Sprite = this.bombs.create(x , 16, 'bomb');
      bomb.setBounce(1);
      bomb.setCollideWorldBounds(true);
      bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
    }
  }

  private hitBomb(player: any, bomb: any) {
    this.physics.pause();
    player.setTint(0xff0000);
    player.anims.play('turn');

    this.gameOver = true;
  }

}

export default FirstGame;