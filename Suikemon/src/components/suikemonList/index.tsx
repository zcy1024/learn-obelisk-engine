import { useAppSelector } from "../../store";

export default function SuikemonList() {
    const suikemonData = useAppSelector(state => state.suikemon.suikemonData)
    let origin: string[] = []
    for (let i = 1; i <= 2000; i++)
        origin.push(i.toString())
    const data = origin.filter(key => suikemonData.has(key))
    return (
        <div className="flex flex-wrap gap-6 pt-20 inset-x-0 px-4 sm:px-6 lg:px-8 xl:px-24 2xl:px-56 mx-auto transition-all duration-700 ease-in-out after:flex-1">
            {data.map(item => (
                <div className="flex flex-col justify-between items-center h-36 w-24 text-center">
                    <span className="sprite-icon sprite-icon-001"></span>
                    <p>妙蛙种子</p>
                    <p>テツノイワオ</p>
                    <p>Bulbasaur</p>
                </div>
            ))}
        </div>
    )
}