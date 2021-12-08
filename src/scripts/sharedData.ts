
interface Provider {
    size: number,
    boats: number,
    vs: boolean,
    turn: boolean,
}

let boardSettings : Provider = {
    size : 8,
    boats : 8,
    vs : false,
    turn :true,
}

export default boardSettings;