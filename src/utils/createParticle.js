// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Color, EngineObject, ParticleEmitter } from '../../littlejs/littlejs.esm.js'

/**
 *
 * @param {EngineObject} obj
 * @param {Color} color
 */
export default function createParticle(obj, color) {
  new ParticleEmitter(
    obj.pos,
    0,
    obj.size,
    0.1,
    200,
    3.14,
    undefined,
    color,
    color,
    color.scale(1, 0),
    color.scale(1, 0),
    0.2,
    0.5,
    1,
    0.1,
    0.1,
    0.99,
    0.95,
    0.4,
    3.14,
    0.1,
    0.5,
    false,
    true,
  )
}
