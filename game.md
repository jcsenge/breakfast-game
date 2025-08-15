# Meow Shooter: 90's FPS Game

## Overview

Meow Shooter is a whimsical, browser-based first-person shooter (FPS) where you play as a coder cat fighting off pixelated tomatoes in a retro-inspired 90's environment. The game is built with TypeScript and Three.js, featuring a strict "Vintage Vibes" color palette (#C0C0C0, #7D7D7D, #A0522D, #D2691E, #F5DEB3) and a pixel-art UI. Your goal is to survive as long as possible by shooting tomatoes with binary code projectiles (0's and 1's), avoiding being overrun, and managing your limited lives.

## Visual Style

- **Palette:** Only #C0C0C0, #7D7D7D, #A0522D, #D2691E, #F5DEB3 used throughout
- **Font:** 'Press Start 2P' pixel font for all UI
- **Ground:** Detailed retro texture with sand and lines
- **Sky:** Solid 90's-style background
- **Obstacles:** Trees scattered around the environment
- **Enemies:** Red tomato spheres with green leafy tops
- **Projectiles:** Glowing orange cubes with "1" or "0" binary code
- **UI:** Pixel hearts for lives, difficulty indicator, crosshair, and game over popup

## Core Mechanics

- **Movement:** WASD for walking, mouse for looking (PointerLockControls)
- **Shooting:** Left click fires a binary code projectile (randomly "1" or "0")
- **Enemies:** Tomatoes spawn at the map's edge and move toward the player
- **Lives:** 3 lives; lose one if a tomato touches you or you leave the platform
- **Game Over:** Popup appears, cursor unlocks, restart button reloads the game
- **Difficulty:** Increases every 10 seconds (up to 10 levels); tomatoes spawn faster, move quicker, and spawn in greater numbers
- **Map:** 75x75 unit platform; leaving the edge ends the game

## Technical Implementation

- **Rendering:** Three.js, custom pixel textures for ground/sky
- **State:** Managed in main.ts (no external state library)
- **Collision:** Custom detection for tomatoes, projectiles, and player
- **UI:** DOM overlays for lives, difficulty, crosshair, and game over
- **Restart:** Reloads the page
- **Clean Code:** All logic is modular, immutable, and follows strict clean code standards

---

## 10 Steps to Build Meow Shooter

1. **Project Setup**

   - Initialize a Vite + TypeScript + Three.js project
   - Set up strict clean code standards and folder structure

2. **Scene and Camera**

   - Create a Three.js scene, perspective camera, and renderer
   - Add PointerLockControls for WASD + mouse look

3. **Environment**

   - Add a detailed, 90's-styled ground plane using only the allowed palette
   - Add a sky dome and place tree obstacles around the map

4. **Player Controls**

   - Implement WASD movement and mouse look
   - Lock/unlock pointer on click

5. **Tomato Enemies**

   - Create tomato models using only the allowed colors
   - Spawn tomatoes at random positions on the map edge
   - Make tomatoes move and rotate toward the player

6. **Shooting**

   - Left click fires a binary code projectile from the camera
   - Projectiles are glowing orange cubes with "1" or "0" texture
   - Projectiles always rotate to face the camera, move forward, and disappear after a short time

7. **Collisions**

   - Detect projectile-tomato collisions (destroy both)
   - Detect tomato-player collisions (lose a life and remove tomato)
   - End the game if the player leaves the platform

8. **UI Elements**

   - Show lives as pixel hearts and current difficulty level
   - Add a crosshair and game over popup with restart button
   - Style all UI with the retro palette and pixel font

9. **Progressive Difficulty**

   - Increase tomato speed, spawn rate, and number per spawn over time
   - Update UI to reflect difficulty

10. **Game Over and Restart**
    - End the game when lives reach 0 or player leaves the platform
    - Show a restart button to reload the game
    - Unlock the cursor for UI interaction

---

This project is a showcase of clean, modular TypeScript, strict color and style discipline, and classic 90's FPS gameplay in the browser.
