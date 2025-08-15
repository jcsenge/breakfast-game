import "./style.css";
import { GameScene } from "./scene";
import { Environment } from "./environment";
import { PlayerController } from "./player";
import { UI } from "./ui";
import { EnemyManager } from "./enemies";
import { ProjectileManager } from "./projectileManager";
import { CollisionDetector } from "./collision";
import { GameState, GameStatus } from "./gameState";

class MeowShooter {
  private gameScene: GameScene;
  private environment: Environment;
  private player: PlayerController;
  private ui: UI;
  private enemyManager: EnemyManager;
  private projectileManager: ProjectileManager;
  private gameState: GameState;
  private prevTime: number = performance.now();

  constructor() {
    console.log("🚀 Initializing MeowShooter...");
    this.gameScene = new GameScene();
    console.log("📹 Game scene created");
    this.environment = new Environment(this.gameScene.getScene());
    console.log("🌍 Environment created");
    this.player = new PlayerController(this.gameScene.getControls());
    console.log("🐱 Player controller created");
    this.enemyManager = new EnemyManager(this.gameScene.getScene());
    console.log("🍅 Enemy manager created");
    this.projectileManager = new ProjectileManager(
      this.gameScene.getScene(),
      this.gameScene.getCamera()
    );
    console.log("💥 Projectile manager created");
    this.gameState = new GameState();
    console.log("🎯 Game state created");
    this.ui = new UI();
    console.log("🎨 UI created");
    this.setupGameplay();
    this.startGameLoop();
    console.log("🎮 Game loop started");
  }

  private setupGameplay(): void {
    this.player.setShootCallback((position, direction) => {
      if (this.gameState.getStatus() === GameStatus.Playing) {
        this.projectileManager.shootProjectile(position, direction);
        this.ui.hideInstructions();
      }
    });
  }

  private startGameLoop(): void {
    const animate = () => {
      requestAnimationFrame(animate);

      if (this.gameState.isGameOver()) {
        this.handleGameOver();
        return;
      }

      const currentTime = performance.now();
      const delta = (currentTime - this.prevTime) / 1000;

      // Update game systems
      this.player.update();
      this.enemyManager.update(this.player.getPosition(), delta);
      this.projectileManager.update(delta);
      
      // Update difficulty and level progression
      const previousLevel = this.gameState.getLevel();
      this.gameState.updateLevel();
      if (this.gameState.getLevel() > previousLevel) {
        this.enemyManager.updateDifficulty(this.gameState.getLevel());
      }

      // Handle collisions
      this.handleCollisions();

      // Update UI
      this.ui.updateLives(this.gameState.getLives());
      this.ui.updateLevel(this.gameState.getLevel());
      this.ui.updateScore(this.gameState.getScore());

      this.gameScene.render();
      this.prevTime = currentTime;
    };
    animate();
  }

  private handleCollisions(): void {
    const collisions = CollisionDetector.checkCollisions(
      this.projectileManager.getProjectiles(),
      this.enemyManager.getTomatoes(),
      this.player.getPosition()
    );

    // Handle projectile hits
    collisions.projectileHits.forEach(({ projectile, tomato }) => {
      this.projectileManager.removeProjectile(projectile);
      this.enemyManager.removeTomato(tomato);
      this.gameState.addScore(10);
      console.log("🎯 Hit! +10 points");
    });

    // Handle player hits
    collisions.playerHits.forEach((tomato) => {
      console.log(`💔 Player hit by tomato! Lives before: ${this.gameState.getLives()}`);
      this.enemyManager.removeTomato(tomato);
      this.gameState.loseLife();
      console.log(`💔 Lives after: ${this.gameState.getLives()}`);
    });

    // Handle out of bounds
    if (collisions.playerOutOfBounds) {
      this.gameState.loseLife();
    }
  }

  private handleGameOver(): void {
    console.log("🎮 Game Over! Showing game over screen...");
    this.ui.showGameOver(this.gameState.getScore(), this.gameState.getLevel());
    
    // Unlock the cursor for UI interaction
    if (this.gameScene.getControls().isLocked) {
      this.gameScene.getControls().unlock();
    }
  }
}

const app = document.querySelector<HTMLDivElement>("#app")!;
app.innerHTML = "";

new MeowShooter();
