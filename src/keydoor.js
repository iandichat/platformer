// @ts-check

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { EngineObject, TileInfo, Vector2, YELLOW } from '../littlejs/littlejs.esm.js'
import createParticle from './utils/createParticle.js'

export default class KeyDoor extends EngineObject {
  /**
   *
   * @param {Vector2} pos
   * @param {Vector2} size
   * @param {TileInfo} tileInfo
   */
  constructor(pos, size, tileInfo) {
    super(pos, size, tileInfo)

    this.setCollision() // make object collide
    this.gravityScale = 0
    this.mass = 0 // make object have static physics
  }

  open() {
    createParticle(this, YELLOW)

    this.destroy()
  }
}
