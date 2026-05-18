export default function decorate(block) {
  const rows = [...block.children];
  rows.forEach((row) => {
    row.classList.add('cards-category-card');
    const cols = [...row.children];
    if (cols[0]) cols[0].classList.add('cards-category-card-image');
    if (cols[1]) cols[1].classList.add('cards-category-card-body');
  });
}
