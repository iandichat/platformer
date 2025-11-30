// @ts-check

import { tile, vec2 } from '../../littlejs/littlejs.esm.js'
import { BLOCK_SIZE, LEVEL_SIZE } from './const.js'

/** @typedef {{id: string, x: number, y: number}} tileObj */

/**
 *
 * @param {tileObj} param0
 * @returns
 */
export default function parseTileObj({ id, x, y }) {
  return {
    pos: vec2(x, LEVEL_SIZE.y - y),
    tileInfo: tile(vec2(Number(id) % 8, Math.floor(Number(id) / 8)), BLOCK_SIZE),
  }
}
