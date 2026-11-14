
'use strict';

// Registros que já aparecem no catálogo da página inicial.
const catalogRecords = []


const searchForm = document.querySelector('#results-search');
const categorySelect = document.querySelector('#category');
const queryInput = document.querySelector('#query');
const resultsGrid = document.querySelector('#results-grid');
const resultsCount = document.querySelector('#results-count');
const emptyState = document.querySelector('#empty-state');
const emptyMessage = document.querySelector('#empty-message');

function normalizeText(value) {
  return String(value)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase('pt-BR')
    .trim();
}

function createResultCard(record) {
  const article = document.createElement('article');
  article.className = 'result-card';

  const imageWrapper = document.createElement('div');
  imageWrapper.className = 'result-card__image';

  const image = document.createElement('img');
  image.src = record.image;
  image.alt = `Imagem de ${record.name}`;
  image.loading = 'lazy';

  image.addEventListener('error', () => {
    image.remove();
  }, { once: true });

  const badge = document.createElement('span');
  badge.className = 'result-card__badge';
  badge.textContent = record.badge;

  imageWrapper.append(image, badge);

  const body = document.createElement('div');
  body.className = 'result-card__body';

  const meta = document.createElement('p');
  meta.className = 'result-card__meta';
  meta.textContent = 'Monstro';

  const title = document.createElement('h3');
  title.textContent = record.name;

  const description = document.createElement('p');
  description.className = 'result-card__description';
  description.textContent = `“${record.description}”`;

  const classification = document.createElement('p');
  classification.className = 'result-card__classification';
  classification.textContent = record.classification;

  body.append(meta, title, description, classification);
  article.append(imageWrapper, body);

  return article;
}

function renderResults() {
  const selectedCategory = categorySelect.value;
  const normalizedQuery = normalizeText(queryInput.value);

  const filteredRecords = catalogRecords.filter((record) => {
    const matchesCategory =
      selectedCategory === 'todos' ||
      record.category === selectedCategory;

    const searchableContent = normalizeText(
      `${record.name} ${record.category} ${record.badge} ${record.classification} ${record.description} ${record.searchableText}`
    );

    const matchesQuery =
      normalizedQuery === '' ||
      searchableContent.includes(normalizedQuery);

    return matchesCategory && matchesQuery;
  });

  resultsGrid.replaceChildren(...filteredRecords.map(createResultCard));

  const total = filteredRecords.length;

  resultsCount.textContent =
    `${total} ${total === 1 ? 'registro encontrado' : 'registros encontrados'}`;

  emptyState.hidden = total > 0;
  resultsGrid.hidden = total === 0;

  if (total === 0 && selectedCategory !== 'todos' && selectedCategory !== 'monstros') {
    emptyMessage.textContent =
      'Ainda não há registros publicados nesta categoria. No momento, o catálogo disponível nesta página reúne monstros.';
  } else if (total === 0) {
    emptyMessage.textContent =
      'Não encontramos esse termo no catálogo atual. Confira a escrita ou tente pesquisar por Bafomé, Ifrit ou Drake.';
  }
}

function loadSearchFromUrl() {
  const params = new URLSearchParams(window.location.search);

  const category = params.get('categoria') || params.get('tipo') || 'todos';
  const query = params.get('q') || '';

  const allowedCategories = [
    'todos',
    'monstros',
    'itens',
    'cartas',
    'mapas'
  ];

  categorySelect.value = allowedCategories.includes(category)
    ? category
    : 'todos';

  queryInput.value = query;

  renderResults();
}

searchForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const params = new URLSearchParams();

  params.set('categoria', categorySelect.value);

  if (queryInput.value.trim()) {
    params.set('q', queryInput.value.trim());
  }

  const queryString = params.toString();

  const nextUrl = queryString
    ? `resultados.html?${queryString}`
    : 'resultados.html';

  window.location.assign(nextUrl);
});

categorySelect.addEventListener('change', renderResults);


async function loadCatalog() {
  resultsCount.textContent = "Carregando monstros...";

  try {
    const response = await fetch("./data/monsters.json");

    if (!response.ok) {
      throw new Error(`Erro HTTP: ${response.status}`);
    }

    const monsters = await response.json();

    catalogRecords = monsters.map((monster) => ({
      name: monster.name.ptBR ?? monster.name.sourceName,
      category: "monstros",
      badge: monster.classification.class === "boss"
        ? "Chefe"
        : "Monstro",
      classification: [
        `Nível ${monster.stats.level}`,
        monster.biology.element,
        monster.biology.size
      ].join(" • "),
      description: `HP: ${monster.stats.hp ?? "—"} | EXP Base: ${monster.stats.baseExp ?? "—"}`,
      image: monster.visuals.monsterArt,
      searchableText: `${monster.name.sourceName} ${monster.aegisName} ${monster.slug}`
    }));

    loadSearchFromUrl();

  } catch (error) {
    console.error("Falha ao carregar catálogo:", error);
    resultsGrid.replaceChildren();
    resultsGrid.hidden = true;
    emptyState.hidden = false;
    resultsCount.textContent = "Erro ao carregar catálogo";
    emptyMessage.textContent =
      "Verifique o caminho do JSON e se o Live Server está ativo.";
  }
}


loadCatalog();
