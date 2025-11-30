// @ts-check

/** @typedef {{id: string, x: number, y: number}} tileObj */

/**
 * Groups tiles that share the same x coordinate and are adjacent in the y direction.
 *
 * @param {tileObj[]} tiles
 * @returns {tileObj[][]}
 */
export default function groupAdjacentTiles(tiles) {
  // x만으로 그룹화
  /** @type {Record<string,tileObj[]>} */
  const grouped = {}

  tiles.forEach((tile) => {
    const key = `${tile.x}` // ← id 제거
    if (!grouped[key]) {
      grouped[key] = []
    }
    grouped[key].push(tile)
  })

  // 각 그룹을 y로 정렬하고 인접 타일끼리 묶기
  /** @type {tileObj[][]} */
  const result = []

  Object.values(grouped).forEach((group) => {
    // y 값 정렬
    group.sort((a, b) => a.y - b.y)

    let currentGroup = [group[0]]

    for (let i = 1; i < group.length; i++) {
      // 이전 타일과 y 차이가 1이면 같은 그룹
      if (group[i].y === group[i - 1].y + 1) {
        currentGroup.push(group[i])
      } else {
        // 아니면 새로운 그룹
        result.push(currentGroup)
        currentGroup = [group[i]]
      }
    }

    // 마지막 그룹 추가
    result.push(currentGroup)
  })

  return result
}
