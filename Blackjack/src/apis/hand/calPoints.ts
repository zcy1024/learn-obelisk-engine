import dfs from "./dfs"

export default function calPoints(cards: string[]): number {
    if (cards.length === 0)
        return 0
    const points = dfs(0, 0, cards)
    const sorted = points.sort((a, b) => b - a)
    let res = sorted[0]
    let index = 1
    while (res > 21 && index < sorted.length) {
        if (sorted[index] > 21) {
            index++
            continue
        }
        res = sorted[index]
        break
    }
    return res
}