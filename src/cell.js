// @ts-check

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { EngineObject, rgb, Vector2 } from '../littlejs/littlejs.esm.js'

export default class Cell extends EngineObject {
  /**
   *
   * @param {Vector2} pos
   * @param {Vector2} size
   * @param {boolean} isRock
   * @param {number} nxtValue - 로비의 돌은 이동할 레벨을 저장한다
   */
  constructor(pos, size, isRock, nxtValue = 0) {
    super(pos, size)
    this.isRock = isRock
    this.nxtValue = nxtValue

    this.setCollision() // make object collide
    this.gravityScale = 0
    this.mass = 0 // make object have static physics
    this.color = rgb(0, 0, 0, 0)
  }
}
