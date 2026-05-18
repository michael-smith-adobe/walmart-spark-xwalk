import { loadCSS } from '../../scripts/aem.js';

function closeModal(overlay) {
  overlay.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

export default function decorate(block) {
  const rows = [...block.children];
  const triggers = [];

  rows.forEach((row) => {
    const cells = [...row.children];
    const linkEl = cells[0]?.querySelector('a');
    const triggerLabel = linkEl?.textContent?.trim() || cells[0]?.textContent?.trim() || '';
    const id = triggerLabel.toLowerCase().replace(/\s+/g, '-');
    const parentLabel = cells[1]?.textContent?.trim() || '';
    const title = cells[2]?.textContent?.trim() || triggerLabel;
    const bodyCell = cells[3];

    triggers.push({ id, title });

    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.id = `modal-${id}`;
    overlay.setAttribute('aria-hidden', 'true');

    const dialog = document.createElement('div');
    dialog.className = 'modal-dialog';
    dialog.setAttribute('role', 'dialog');
    dialog.setAttribute('aria-label', title);

    const header = document.createElement('div');
    header.className = 'modal-header';

    const closeBtn = document.createElement('button');
    closeBtn.className = 'modal-close';
    closeBtn.setAttribute('aria-label', 'Close');
    closeBtn.innerHTML = '&#x2715;';

    const parentSpan = document.createElement('span');
    parentSpan.className = 'modal-parent';
    parentSpan.textContent = parentLabel || 'About your earnings';

    header.append(closeBtn, parentSpan);

    const accent = document.createElement('div');
    accent.className = 'modal-accent';

    const body = document.createElement('div');
    body.className = 'modal-body';

    const h1 = document.createElement('h1');
    h1.textContent = title;
    body.append(h1);

    if (bodyCell) {
      [...bodyCell.children].forEach((el) => body.append(el.cloneNode(true)));
    }

    dialog.append(header, accent, body);
    overlay.append(dialog);
    document.body.append(overlay);

    closeBtn.addEventListener('click', () => closeModal(overlay));
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeModal(overlay);
    });
  });

  block.style.display = 'none';

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-overlay[aria-hidden="false"]').forEach(closeModal);
    }
  });

  // Attach triggers to matching bold text in the page
  triggers.forEach(({ id, title }) => {
    const main = document.querySelector('main');
    if (main) {
      main.querySelectorAll('strong').forEach((strong) => {
        if (strong.textContent.trim().toLowerCase() === title.toLowerCase()) {
          const trigger = strong.closest('p') || strong;
          trigger.classList.add('modal-trigger');
          trigger.addEventListener('click', (e) => {
            e.preventDefault();
            const overlay = document.getElementById(`modal-${id}`);
            if (overlay) {
              overlay.setAttribute('aria-hidden', 'false');
              document.body.style.overflow = 'hidden';
            }
          });
        }
      });
    }
  });
}

// Keep the openModal export for compatibility with boilerplate usage
export async function openModal(fragmentUrl) {
  const path = fragmentUrl.startsWith('http')
    ? new URL(fragmentUrl, window.location).pathname
    : fragmentUrl;

  const { loadFragment } = await import('../fragment/fragment.js');
  const fragment = await loadFragment(path);
  if (!fragment) return;

  await loadCSS(`${window.hlx.codeBasePath}/blocks/modal/modal.css`);
  const dialog = document.createElement('dialog');
  dialog.classList.add('modal-content');
  dialog.append(...fragment.childNodes);

  const closeButton = document.createElement('button');
  closeButton.classList.add('close-button');
  closeButton.setAttribute('aria-label', 'Close');
  closeButton.type = 'button';
  closeButton.innerHTML = '&#x2715;';
  closeButton.addEventListener('click', () => dialog.close());
  dialog.prepend(closeButton);

  dialog.addEventListener('click', (e) => {
    const {
      left, right, top, bottom,
    } = dialog.getBoundingClientRect();
    const { clientX, clientY } = e;
    if (clientX < left || clientX > right || clientY < top || clientY > bottom) {
      dialog.close();
    }
  });

  document.body.append(dialog);
  dialog.showModal();
}
