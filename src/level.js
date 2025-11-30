// @ts-check
import * as LJS from '../littlejs/littlejs.esm.js'
import Cell from './cell.js'
import KeyDoor from './keydoor.js'
import Player from './player.js'
import { LEVEL_SIZE } from './utils/const.js'
import groupAdjacentTiles from './utils/groupAdjacentTiles.js'
import parseTileObj from './utils/parseTileObj.js'
const { vec2 } = LJS

/**
 * @typedef {Object} TileObj
 * @property {string} id
 * @property {number} x
 * @property {number} y
 */

/**
 * @typedef {Object} Layer
 * @property {string} name
 * @property {TileObj[]} tiles
 * @property {boolean} collider
 */

/**
 * @typedef {Object} GameData
 * @property {number} tileSize
 * @property {number} mapWidth
 * @property {number} mapHeight
 * @property {Layer[]} layers
 */

/** @type {GameData?} */
let gameData = null

/** @type {KeyDoor[]} */
let keydoors = []
export function getKey() {
  keydoors.forEach((keydoor) => keydoor.open())
}

/**
 *
 * @param {number} level
 * @param {number} maxClearedLevel
 */
export async function setupLevel(level, maxClearedLevel) {
  // reset objects
  LJS.engineObjects.forEach((obj) => obj.destroy())
  keydoors = []

  // ui
  const fullscreenBtn = new LJS.UIButton(vec2(175, 100), vec2(200, 50), 'fullscreen', LJS.WHITE)
  fullscreenBtn.onClick = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen()
      }
    }
  }

  // @ts-expect-error - fetch json
  gameData = await LJS.fetchJSON(`../levels/${level}.json`)
  if (!gameData) throw Error('cannot read leveldata')

  for (const { name, tiles, collider } of gameData.layers) {
    if (tiles.length === 0) continue

    if (name === '플레이어') {
      const { pos, tileInfo } = parseTileObj(tiles[0])
      new Player(pos, tileInfo)

      continue
    } else if (name === '열쇠문') {
      const groups = groupAdjacentTiles(tiles)
      const { tileInfo } = parseTileObj(tiles[0]) // 열쇠문의 tileInfo는 일정함

      // 로비의 열쇠문은 클리어 현황에 따라 열린다
      const keydoorQueue = [1, 6, 1, 6, 1, 6, 2, 7, 2, 7, 2, 7, 3, 8, 3, 8, 3, 8, 4, 9, 4, 9, 4, 9, 5, 10, 5, 10, 5, 10]

      for (const group of groups) {
        const { x } = group[0]
        const yValues = group.map((t) => t.y)
        const miny = Math.min(...yValues)
        const maxy = Math.max(...yValues)

        const pos = vec2(x, LEVEL_SIZE.y - (miny + maxy) / 2)

        keydoors.push(new KeyDoor(pos, vec2(1, maxy - miny + 1), tileInfo))

        if (level === 0) {
          const thisLevel = keydoorQueue.shift()
          if (!thisLevel) throw Error('keydoor이 너무 많음')
          if (thisLevel <= maxClearedLevel + 1) keydoors.pop()?.open()
        }
      }

      continue
    }

    if (!collider) continue
    // 충돌 가능한 object 생성
    // 충돌 이슈로 수직으로 인접한 같은 레이어의 object는 합친다

    const groups = groupAdjacentTiles(tiles)

    // 로비의 돌은 이동할 레벨을 저장한다
    // 이때 처리되는 순서를 하드코딩한다
    const nxtQueue = [1, 6, 1, 6, 1, 6, 2, 7, 2, 7, 2, 7, 3, 8, 3, 8, 3, 8, 4, 9, 4, 9, 4, 9, 5, 10, 5, 10, 5, 10]

    for (const group of groups) {
      const { x } = group[0]
      const yValues = group.map((t) => t.y)
      const miny = Math.min(...yValues)
      const maxy = Math.max(...yValues)

      const pos = vec2(x, LEVEL_SIZE.y - (miny + maxy) / 2)
      if (level === 0 && name === '돌') {
        new Cell(pos, vec2(1, maxy - miny + 1), true, nxtQueue.shift())
      } else {
        new Cell(pos, vec2(1, maxy - miny + 1), name === '돌')
      }
    }
  }
}

export function render() {
  LJS.drawRect(LJS.cameraPos, vec2(100), LJS.rgb(130 / 255, 200 / 255, 229 / 255)) // draw background

  if (!gameData) return

  // draw tiles
  for (const { name, tiles } of gameData.layers) {
    if (name === '플레이어') continue // do not draw player
    if (name === '열쇠문') continue // do not draw keydoor

    for (const tileObj of tiles) {
      const { pos, tileInfo } = parseTileObj(tileObj)
      LJS.drawTile(pos, vec2(1), tileInfo)
    }
  }
}
