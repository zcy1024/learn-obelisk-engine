export default function pointToCard(point: number) {
    if (point === 11)
        return "J"
    if (point === 12)
        return "Q"
    if (point === 13)
        return "K"
    if (point === 1)
        return "A"
    if (point === 0)
        return "*"
    return point.toString()
}