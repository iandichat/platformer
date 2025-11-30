// @ts-check
import * as LJS from '../littlejs/littlejs.esm.js'
import { LEVEL_SIZE } from './utils/const.js'
import { render, setupLevel } from './level.js'
const { vec2 } = LJS

let level = 0 // 로비
let maxClearedLevel = 0

/**
 *
 * @param {number} nxt
 */
export function clearLevel(nxt) {
  maxClearedLevel = Math.max(maxClearedLevel, level)

  level = nxt
  setupLevel(level, maxClearedLevel)
}

///////////////////////////////////////////////////////////////////////////////

async function gameInit() {
  LJS.setTouchGamepadEnable(true)
  LJS.setTouchGamepadSize(250)
  LJS.setTouchGamepadButtonCount(1)
  LJS.setTouchGamepadCenterButton(true)

  LJS.setCameraPos(LEVEL_SIZE.scale(0.5)) // center camera in level
  LJS.setCanvasFixedSize(LEVEL_SIZE.add(vec2(20, 0)).scale(35))

  LJS.setGravity(vec2(0, -0.1))

  // ui
  new LJS.UISystemPlugin()

  setupLevel(level, maxClearedLevel)
}

///////////////////////////////////////////////////////////////////////////////

function gameUpdate() {}

///////////////////////////////////////////////////////////////////////////////

function gameUpdatePost() {}

///////////////////////////////////////////////////////////////////////////////

function gameRender() {
  render()
}

///////////////////////////////////////////////////////////////////////////////

function gameRenderPost() {
  // LJS.drawTextScreen("asdf", vec2(LJS.mainCanvasSize.x / 2, 70), 50); // show score
}

///////////////////////////////////////////////////////////////////////////////

// Startup LittleJS Engine
LJS.engineInit(gameInit, gameUpdate, gameUpdatePost, gameRender, gameRenderPost, ['../levels/spritesheet.png'])

console.log('game.js loaded!')
