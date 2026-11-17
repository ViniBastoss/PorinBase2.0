import {readFile} from "node:fs/promises"

const conteudo = await readFile("scripts/exercicios/monstros-amostra.yml","utf8")

console.log(typeof conteudo)

