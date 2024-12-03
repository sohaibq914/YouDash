import data from "./data.json";

let currentData = [];

function mapWithRank(row, i) {
  return { ...row, ranking: i + 1 };
}

export function getInitialData() {
  currentData = data.map(mapWithRank);
  return currentData;
}

export function genNextData() {
  const nextData = [...currentData];
  const changes = Math.floor(Math.random() * 3);

  for (let i = 0; i < changes; i++) {
    const index = Math.floor(Math.random() * data.length);
    nextData[index].score += Math.floor(Math.random() * 5000 + 1000);
  }

  currentData = nextData.sort((a, b) => b.score - a.score).map(mapWithRank);
  return currentData;
}
