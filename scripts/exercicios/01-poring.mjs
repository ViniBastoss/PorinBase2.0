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
const monstros =[exemplo, grifo];

const normalizados = monstros.map(normalizarMonstro);
console.log(normalizados)

