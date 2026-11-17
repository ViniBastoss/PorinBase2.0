import {readFile} from "node:fs/promises";
import {parse} from "yaml";

const conteudo = await readFile("scripts/exercicios/monstros-amostra.yml","utf8");
const dados = parse(conteudo);

console.log(dados.Body);

