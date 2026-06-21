import { AppState } from './state';
import { Product } from './types';
import { getProductById } from './api';

const statusContainer = document.getElementById('status-container') as HTMLDivElement;
const productsContainer = document.getElementById('products-container') as HTMLDivElement;
const detailModal = document.getElementById('detail-modal') as HTMLDivElement;
const detailContainer = document.getElementById('detail-container') as HTMLDivElement;

//Quản trị luồng trạng thái ứng dụng
export function renderStatus(state: AppState): void {
  if (!statusContainer) return;
  
  switch (state.status) {
    case 'idle':
      statusContainer.innerHTML = `<div class="status-message text-muted">System is idle. Waiting to initialize...</div>`;
      if (productsContainer) productsContainer.innerHTML = '';
      break;
    case 'loading':
      statusContainer.innerHTML = `<div class="status-message loading">⏳ Loading products dashboard, please wait...</div>`;
      if (productsContainer) productsContainer.innerHTML = '';
      break;
    case 'error':
      statusContainer.innerHTML = `<div class="status-message error">❌ Error: ${state.message}</div>`;
      if (productsContainer) productsContainer.innerHTML = '';
      break;
    case 'success':
      statusContainer.innerHTML = '';
      break;
  }
}

export function renderProducts(products: Product[]): void {
  if (!productsContainer) return;
  
  if (products.length === 0) {
    productsContainer.innerHTML = `<p class="text-center w-100 my-4 text-muted">No products found matching your search criteria.</p>`;
    return;
  }

  productsContainer.innerHTML = products.map(product => `
    <div class="col-12 col-sm-6 col-md-4 col-lg-3">
      <div class="product-card" data-id="${product.id}">
        <img src="${product.thumbnail}" alt="${product.title}" loading="lazy" />
        <div class="mt-2">
          <h3>${product.title}</h3>
          <p class="mb-1 text-muted">Category: <span class="badge bg-secondary">${product.category}</span></p>
          <p class="mb-0 fw-bold text-primary">Price: $${product.price}</p>
        </div>
      </div>
    </div>
  `).join('');

  const cards = productsContainer.querySelectorAll('.product-card');
  cards.forEach(card => {
    card.addEventListener('click', () => {
      const idStr = card.getAttribute('data-id');
      if (idStr) {
        loadProductDetail(parseInt(idStr, 10));
      }
    });
  });
}

async function loadProductDetail(id: number): Promise<void> {
  if (!detailModal || !detailContainer) return;
  
  detailContainer.innerHTML = '<p class="text-center py-3">⏳ Fetching deep product specifications...</p>';
  detailModal.classList.remove('hidden');

  try {
    const product = await getProductById(id);
    
    detailContainer.innerHTML = `
      <div class="row g-4 mt-2 align-items-center">
        <div class="col-12 col-md-4 text-center">
          <img src="${product.thumbnail}" alt="${product.title}" class="img-fluid rounded-3 bg-light p-3 border shadow-sm" style="max-height: 300px; object-fit: contain; width: 100%;" />
        </div>
        <div class="col-12 col-md-8">
          <h2 class="h3 fw-bold mb-1 text-dark">${product.title}</h2>
          <p class="text-muted small mb-3">Brand: <span class="badge bg-dark">${product.brand || 'N/A'}</span></p>
          <div class="mb-3 p-3 bg-light rounded-3 border">
            <h5 class="fs-6 fw-bold text-secondary mb-1">Product Description</h5>
            <p class="text-secondary small mb-0">${product.description}</p>
          </div>
          <h3 class="h2 text-primary fw-bold mb-3">$${product.price} <span class="fs-6 text-danger fw-normal">(-${product.discountPercentage}% OFF)</span></h3>
          <div class="row g-2 text-sm border-top pt-3">
            <div class="col-6">Availability: <strong class="text-success">${product.stock} units</strong></div>
            <div class="col-6">Rating: <strong class="text-warning">⭐ ${product.rating} / 5</strong></div>
          </div>
        </div>
      </div>
    `;
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Failed to parse single resource request';
    detailContainer.innerHTML = `<p class="error">❌ Error: ${msg}</p>`;
  }
}