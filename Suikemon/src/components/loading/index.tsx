import { useEffect, useState } from "react"

let sleeping = false

export default function Loading() {
    const [sprites, setSprites] = useState<string[]>([
        "left-1/2 top-[20%] sprite-icon-0025Li",
        "left-[20%] top-1/2 sprite-icon-0025Ph",
        "left-1/2 bottom-[20%] sprite-icon-0025Po",
        "right-[20%] top-1/2 sprite-icon-0025Be"
    ])

    function delay(ms: number) {
        return new Promise( resolve => setTimeout(resolve, ms) );
    }

    async function rotate() {
        await delay(666)
        setSprites(sprites.map((sprite, index) => sprite.split(' ')[0] + ' ' + sprite.split(' ')[1] + ' ' + sprites[(index + 1) % 4].split(' ')[2]))
        sleeping = false
    }

    useEffect(() => {
        if (sleeping)
            return
        sleeping = true
        rotate()
    }, [sprites, sleeping])

    return (
        <div className="fixed h-screen w-screen top-0 left-0 z-[70]">
            <div className="h-full w-full bg-black opacity-20"></div>
            {sprites.map(sprite => <span className={"absolute sprite-icon scale-[6.6] " + sprite} key={sprite}></span>)}
        </div>
    )
}