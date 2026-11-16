const exemplo = {
    Id: 1002,
    Name: "Poring",
    Level: 1,
    Hp: 50
}

function normalizarMonstro(monstro) {
    return {
        id: monstro.Id,
        name: monstro.Name,
        level: monstro.Level,
        hp: monstro.Hp
    };
}

const resultado = normalizarMonstro(exemplo);
console.log(resultado)
console.log(exemplo.Name)