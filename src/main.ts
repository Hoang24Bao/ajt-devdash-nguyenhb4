import { getProducts, getCategories } from './api';
import { Product } from './types';
import { appState } from './state';
import { renderStatus, renderProducts } from './ui';
import { sanitizeQuery } from './utils';

const searchInput = document.getElementById('search-input') as HTMLInputElement;
const detailModal = document.getElementById('detail-modal') as HTMLDivElement;
const closeModalBtn = document.getElementById('close-modal') as HTMLSpanElement;

let allProducts: Product[] = [];

async function loadDashboard(): Promise<void> {
  appState.currentState = {status: 'loading'};
  renderStatus(appState.currentState);
  
  try {
    const [response, _categoriesData] = await Promise.all([
      getProducts(),
      getCategories()
    ]);
    
    allProducts = response.products;
    appState.currentState = {status: 'success', data: allProducts};
    renderStatus(appState.currentState);
    renderProducts(allProducts);
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
    appState.currentState = { status: 'error', message: errorMessage };
    renderStatus(appState.currentState);
  }
}

if (searchInput) {
  searchInput.addEventListener('input', () => {
    const query = sanitizeQuery(searchInput.value);
    const filtered = allProducts.filter(p => p.title.toLowerCase().includes(query));
    renderProducts(filtered);
  });
}

if (closeModalBtn && detailModal) {
  closeModalBtn.addEventListener('click', () => detailModal.classList.add('hidden'));
  detailModal.addEventListener('click', (e) => {
    if (e.target === detailModal) detailModal.classList.add('hidden');
  });
}

appState.currentState = {status: 'idle'};
renderStatus(appState.currentState);
document.addEventListener('DOMContentLoaded', loadDashboard);