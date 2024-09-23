export default function dfs(index: number, point: number, cards: string[]): number[] {
    if (index === cards.length)
        return [point]
    if (cards[index] === "A") {
        const res = dfs(index + 1, point + 1, cards)
        return res.concat(dfs(index + 1, point + 11, cards))
    }
    if (cards[index] === "J" || cards[index] === "Q" || cards[index] === "K")
        return dfs(index + 1, point + 10, cards)
    if (cards[index] === "*")
        return dfs(index + 1, point, cards)
    return dfs(index + 1, point + Number(cards[index]), cards)
}