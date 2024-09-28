import * as fs from 'fs'

const origin = fs.readFileSync("./originData.txt", {encoding: "utf-8", flag: 'r'})

const step1 = origin.split("\n")

const step2 = step1.filter(str => str.length > 2 && str.split('|')[0] === "{{Rdexn")

// step3 to resolve: 水}} can't be selected
const step3 = step2.map(str => str.slice(0, str.length - 2))

const step4 = step3.filter(str => {
    const array = str.split('|')
    for (let i = 0; i < array.length; i++)
        if (array[i] === "水")
            return true
    return false
})

const step5 = step4.map(str => str.split('|')[1] + ' ' + str.split('|')[2] + ' ' + str.split('|')[3])

const step6 = step5.map(str => str + " https://wiki.52poke.com/wiki/" + encodeURIComponent(str.split(' ')[1]))

const finalData = step6.map(str => {
    const idx = str.split(' ')[0]
    let pre = ""
    while (pre.length + idx.length < 4)
        pre += '0'
    return str + " sprite-icon-" + pre + idx
})

fs.writeFileSync("./data.txt", "// index   chinese   japanese   detail   sprite-icon\n" + finalData.join("\n"))

fs.writeFileSync("./data.ts", "// index   chinese   japanese   detail   sprite-icon\nconst data = [" + finalData.map(str => '"' + str + '",').join("\n") + ']')

// Finally, manually fine-tune according to the rendering effect