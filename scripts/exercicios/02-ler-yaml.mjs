import { readFile, writeFile } from "node:fs/promises";
import { parse } from "yaml";
const conteudo = await readFile("scripts/exercicios/monstros-amostra.yml","utf8");
const dados = parse(conteudo);


const normalizarMonstro = (monstro) => {
    return { 
        id: monstro.Id,
        aegisName: monstro.AegisName,
        name: monstro.Name,
        level: monstro.Level,
        hp: monstro.Hp
    };
};

const normalizados = dados.Body.map(normalizarMonstro);
const textoJson = JSON.stringify(normalizados, null, 2);

await writeFile(
    "scripts/exercicios/monstros-normalizados.json",
textoJson, 
"utf8"
);


console.log("Arquivo de exercício gerado")

