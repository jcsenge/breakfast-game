import { GAME_CONFIG } from "./constants";

export const GameStatus = {
  Playing: "playing",
  GameOver: "gameOver",
} as const;

export type GameStatus = (typeof GameStatus)[keyof typeof GameStatus];

export class GameState {
  private lives: number = GAME_CONFIG.PLAYER_LIVES;
  private level: number = 1;
  private score: number = 0;
  private status: GameStatus = GameStatus.Playing;
  private startTime: number = Date.now();

  getLives(): number {
    return this.lives;
  }

  getLevel(): number {
    return this.level;
  }

  getScore(): number {
    return this.score;
  }

  getStatus(): GameStatus {
    return this.status;
  }

  loseLife(): void {
    if (this.status === GameStatus.Playing) {
      this.lives--;
      console.log(`💔 Life lost! Lives remaining: ${this.lives}`);

      if (this.lives <= 0) {
        this.status = GameStatus.GameOver;
        console.log("💀 Game Over!");
      }
    }
  }

  addScore(points: number): void {
    this.score += points;
  }

  updateLevel(): void {
    const timeElapsed = Date.now() - this.startTime;
    const newLevel = Math.min(
      Math.floor(timeElapsed / GAME_CONFIG.DIFFICULTY_INTERVAL) + 1,
      GAME_CONFIG.MAX_DIFFICULTY
    );

    if (newLevel > this.level) {
      this.level = newLevel;
      console.log(`⬆️ Level up! Now level ${this.level}`);
    }
  }

  reset(): void {
    this.lives = GAME_CONFIG.PLAYER_LIVES;
    this.level = 1;
    this.score = 0;
    this.status = GameStatus.Playing;
    this.startTime = Date.now();
  }

  isGameOver(): boolean {
    return this.status === GameStatus.GameOver;
  }
}
