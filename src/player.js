// @ts-check
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { clamp, EngineObject, gamepadIsDown, gamepadStick, isUsingGamepad, keyDirection, keyIsDown, RED, TileInfo, Timer, vec2, Vector2 } from '../littlejs/littlejs.esm.js'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import Cell from './cell.js'
import { clearLevel } from './game.js'
import createParticle from './utils/createParticle.js'

const CLEAR_SPEED = 1

export default class Player extends EngineObject {
  /**
   *
   * @param {Vector2} pos
   * @param {TileInfo} tileInfo
   */
  constructor(pos, tileInfo) {
    super(pos, vec2(0.99), tileInfo)

    this.setCollision() // make object collide
    this.gravityScale = 1

    this.jumpTimer = new Timer()
  }

  update() {
    // input tracking
    const moveInput = isUsingGamepad ? gamepadStick(0).scale(5) : keyDirection()
    const holdingJump = keyIsDown('KeyW') || keyIsDown('ArrowUp') || gamepadIsDown(0)
    const isclimbwall = moveInput.x && this.velocity.x === 0

    // ^
    if (holdingJump && (this.groundObject || isclimbwall) && !this.jumpTimer.active()) {
      this.velocity.y = 0.7
      this.jumpTimer.set(0.06)
    }

    // 벽타기 중 천천히 내려오기
    if (isclimbwall && this.velocity.y < 0) {
      this.velocity.y = 0
    }

    // <>
    const maxCharacterSpeed = 0.3
    this.velocity.x = clamp(this.velocity.x + moveInput.x * 0.04, -maxCharacterSpeed, maxCharacterSpeed)
  }

  /**
   *
   * @param {Cell} o
   * @returns
   */
  collideWithObject(o) {
    if (o.isRock && this.velocity.length() >= CLEAR_SPEED) {
      this.clear(o.nxtValue)
    }

    return true // allow object to collide
  }

  /**
   *
   * @param {number} nxt
   */
  clear(nxt) {
    this.death()

    setTimeout(clearLevel, 1000, nxt)
  }

  death() {
    createParticle(this, RED)

    this.destroy()
  }
}
