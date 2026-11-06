# PoringBase — Base de dados inicial v1

Esta pasta é o primeiro contrato de dados da PoringBase. Ela usa JSON simples para que o front-end possa carregar os arquivos com `fetch()` durante o desenvolvimento em servidor local ou hospedagem HTTP.

## Estrutura

- `manifest.json`: versão da estrutura, regras de normalização e fontes.
- `data/items.json`: catálogo de itens.
- `data/monsters.json`: catálogo de monstros e seus drops.
- `data/maps.json`: catálogo de mapas (a preencher depois de validar nomes, imagens e regiões).
- `data/spawns.json`: relação entre monstros e mapas (a preencher com dados de spawn verificados).
- `data/element-chart.json`: matriz global de afinidades elementais (pendente de validação).

## Chaves e relacionamentos

- `id`: ID numérico da entrada na fonte de dados.
- `aegisName`: identificador técnico estável. Use-o para relacionar itens e drops.
- `slug`: endereço amigável da página, independente do nome localizado.
- `name.ptBR`: nome exibido pela PoringBase.
- `name.sourceName`: nome usado pela fonte de referência.
- `null`: informação ainda não confirmada; não significa zero. Valores padrão documentados são aplicados explicitamente e anotados no registro.

## Regras importantes

1. O perfil escolhido é Classic / Pre-Renewal genérico. Não misture dados Renewal.
2. Os valores de drop são armazenados no formato original do rAthena: `10000 = 100%`. Para exibir percentual, use `rate / 100`.
3. O campo `weight` mostra o peso do jogo. O rAthena armazena `Weight` em décimos; por exemplo, `150` vira `15` na interface.
4. Preços são em Zeny. `sellIsDerived: true` indica que o preço de venda foi calculado pela regra da fonte e não veio explícito no registro.
5. As imagens são independentes dos dados. JSON não cria nem garante transparência. Depois de adicionar um PNG com canal alfa, informe seu caminho em `visuals.icon`, `visuals.cardFront` ou `visuals.monsterArt`.
6. A tabela elemental é global e deve ser validada antes de calcular as porcentagens apresentadas na ficha de cada monstro.
7. Mapas e spawns estão vazios intencionalmente. Não preencher com locais estimados.
8. O Gryphon (ID 1259) da referência Pre-Renewal é classe Boss, não MVP. A arte-conceito pode divergir visualmente, mas os dados técnicos devem vir da base validada.

## Como carregar no front-end

Com a pasta `data/` na raiz do site e usando um servidor local (por exemplo, Live Server no VS Code):

```js
async function loadJson(path) {
  const response = await fetch(path);

  if (!response.ok) {
    throw new Error(`Não foi possível carregar ${path}: ${response.status}`);
  }

  return response.json();
}

const [items, monsters] = await Promise.all([
  loadJson('./data/items.json'),
  loadJson('./data/monsters.json')
]);
```

Não abra as páginas por `file://` para testar `fetch()`: use Live Server ou outro servidor HTTP local.

## Fontes e licença

A estrutura inicial foi conferida com os arquivos Pre-Renewal do projeto rAthena. Os arquivos do rAthena indicam GPL-3.0-or-later. Antes de redistribuir uma base derivada ou publicar cópias/adaptações, revise as obrigações da licença e mantenha atribuição adequada.

- Itens consumíveis: https://raw.githubusercontent.com/rathena/rathena/master/db/pre-re/item_db_usable.yml
- Monstros: https://raw.githubusercontent.com/rathena/rathena/master/db/pre-re/mob_db.yml
- Documentação de campos de monstros: https://github.com/rathena/rathena/blob/master/doc/yaml/db/mob_db.yml
