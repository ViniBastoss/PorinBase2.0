const exemplo = {
    Id: 1002,
    Name: "Poring",
    Level: 1,
    Hp: 50
}

const grifo = {
    Id: 1259,
    Name: "Gryphon",
    Level: 72,
    Hp: 27800
}

const normalizarMonstro = (monstro) => {
    return { 
        id: monstro.Id,
        name: monstro.Name,
        level: monstro.Level,
        hp: monstro.Hp
    };
};

const resultado = normalizarMonstro(exemplo)
console.log(resultado);
console.log(exemplo.Hp);
const resultado2 = normalizarMonstro(grifo);
console.log(resultado2);
console.log(grifo.Hp);