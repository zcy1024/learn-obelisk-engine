import { useAppSelector } from "../../store";

export default function SuikemonList() {
    const suikemonData = useAppSelector(state => state.suikemon.suikemonData)
    let origin: string[] = []
    for (let i = 1; i <= 2000; i++)
        origin.push(i.toString())
    const data = origin.filter(key => suikemonData.has(key))
    return (
        <div className="flex flex-wrap gap-14 pt-28 pb-4 inset-x-0 px-4 sm:px-6 lg:px-8 xl:px-24 2xl:px-56 mx-auto transition-all duration-700 ease-in-out after:flex-1">
            {data.map(key => {
                const [index, chinese, japanese, detail, sprite_icon] = suikemonData.get(key)
                return (
                    <div className="relative flex flex-col justify-between items-center h-48 w-48 text-center cursor-pointer rounded-full hover:ring transition-all duration-700 ease-in-out" key={index} onClick={() => window.open(detail, '_blank', 'noopener,noreferrer')}>
                        <div className="absolute left-0 top-0 w-full h-full rounded-full bg-gradient-to-t from-yellow-300 opacity-30"></div>
                        <div className="absolute left-0 top-0 w-full h-full rounded-full bg-gradient-to-b from-blue-300 opacity-60"></div>
                        <span className={`sprite-icon ${sprite_icon} scale-[2.5]`}></span>
                        <div className="font-medium leading-7 tracking-wider text-blue-500">
                            <p>#{index}</p>
                            <p>{chinese}</p>
                            <p>{japanese}</p>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}