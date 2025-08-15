import { VINTAGE_COLORS } from "./constants";

export class UI {
  private livesElement: HTMLElement;
  private levelElement: HTMLElement;
  private scoreElement: HTMLElement;
  private gameOverElement: HTMLElement;

  constructor() {
    this.createUI();
    this.livesElement = document.getElementById("lives")!;
    this.levelElement = document.getElementById("level")!;
    this.scoreElement = document.getElementById("score")!;
    this.gameOverElement = document.getElementById("game-over")!;
  }

  private createUI(): void {
    const app = document.querySelector<HTMLDivElement>("#app")!;

    const uiHTML = `
      <div class="crosshair"></div>
      <div class="ui-overlay">
        <div class="ui-stats">
          <div id="lives" class="ui-item">Lives: ♥♥♥</div>
          <div id="level" class="ui-item">Level: 1</div>
          <div id="score" class="ui-item">Score: 0</div>
        </div>
      </div>
      <div id="game-over" class="game-over-popup hidden">
        <div class="game-over-content">
          <h1>GAME OVER</h1>
          <div class="final-stats">
            <div>Final Score: <span id="final-score">0</span></div>
            <div>Level Reached: <span id="final-level">1</span></div>
          </div>
          <button id="restart-btn" class="pixel-button">RESTART GAME</button>
          <div class="restart-hint">Restarting in <span id="countdown">3</span>s...</div>
        </div>
      </div>
      <div class="instructions">
        <div>Click to lock cursor</div>
        <div>WASD to move, Left click to shoot</div>
      </div>
    `;

    app.insertAdjacentHTML("beforeend", uiHTML);
    this.setupEventListeners();
  }

  private setupEventListeners(): void {
    const restartBtn = document.getElementById("restart-btn");
    if (restartBtn) {
      restartBtn.addEventListener("click", () => {
        window.location.reload();
      });
    }
  }

  updateLives(lives: number): void {
    const hearts = "♥".repeat(lives) + "♡".repeat(Math.max(0, 3 - lives));
    this.livesElement.textContent = `Lives: ${hearts}`;
  }

  updateLevel(level: number): void {
    const difficultyName = this.getDifficultyName(level);
    this.levelElement.textContent = `Level: ${level} (${difficultyName})`;
  }

  private getDifficultyName(level: number): string {
    if (level <= 2) return "Easy";
    if (level <= 4) return "Medium";
    if (level <= 6) return "Hard";
    if (level <= 8) return "Extreme";
    return "NIGHTMARE";
  }

  updateScore(score: number): void {
    this.scoreElement.textContent = `Score: ${score}`;
  }

  showGameOver(finalScore: number, finalLevel: number): void {
    this.gameOverElement.classList.remove("hidden");
    
    const finalScoreElement = document.getElementById("final-score");
    const finalLevelElement = document.getElementById("final-level");
    
    if (finalScoreElement) finalScoreElement.textContent = finalScore.toString();
    if (finalLevelElement) finalLevelElement.textContent = finalLevel.toString();
    
    this.startCountdown();
  }

  private startCountdown(): void {
    const countdownElement = document.getElementById("countdown");
    let count = 3;
    
    const interval = setInterval(() => {
      count--;
      if (countdownElement) {
        countdownElement.textContent = count.toString();
      }
      
      if (count <= 0) {
        clearInterval(interval);
        window.location.reload();
      }
    }, 1000);
  }

  hideInstructions(): void {
    const instructions = document.querySelector(".instructions");
    if (instructions) {
      instructions.classList.add("hidden");
    }
  }
}
