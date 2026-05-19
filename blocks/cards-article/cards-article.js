export default function decorate(block) {
  const rows = [...block.children];
  rows.forEach((row) => {
    row.classList.add('cards-article-card');
    const cols = [...row.children];
    if (cols[0]) cols[0].classList.add('cards-article-card-body');
  });
}
