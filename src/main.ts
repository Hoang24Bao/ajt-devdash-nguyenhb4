import { getProducts, getProductById, getCategories } from './api';
import { Product } from './types';

// DOM Elements
const statusContainer = document.getElementById('status-container') as HTMLDivElement;
const productsContainer = document.getElementById('products-container') as HTMLDivElement;
const searchInput = document.getElementById('search-input') as HTMLInputElement;

const detailModal = document.getElementById('detail-modal') as HTMLDivElement;
const closeModalBtn = document.getElementById('close-modal') as HTMLSpanElement;
const detailContainer = document.getElementById('detail-container') as HTMLDivElement;

// Local state to store products for filtering
let allProducts: Product[] = [];

//Manage UI Status States (Loading, Error, Success)
function renderStatus(state: 'loading' | 'clear' | 'error', message: string = ''): void {
  if (!statusContainer) return;
  
  if (state === 'loading') {
    statusContainer.innerHTML = `<div class="status-message loading">⏳ Loading products dashboard, please wait...</div>`;
    if (productsContainer) productsContainer.innerHTML = '';
  } else if (state === 'error') {
    statusContainer.innerHTML = `<div class="status-message error">❌ Error: ${message}</div>`;
  } else {
    statusContainer.innerHTML = '';
  }
}

//Display products list
function renderProducts(products: Product[]): void {
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

  // Re-bind click events for each card item to trigger detail modal view
  const cards = productsContainer.querySelectorAll('.product-card');
  cards.forEach(card => {
    card.addEventListener('click', () => {
      const idStr = card.getAttribute('data-id');
      if (idStr) {
        const id = parseInt(idStr, 10);
        loadProductDetail(id);
      }
    });
  });
}

//Async flow to load full dashboard list resource
async function loadDashboard(): Promise<void> {
  renderStatus('loading');
  try {
    // Kích hoạt đồng thời 2 luồng gọi mạng chạy song song cùng lúc để tối ưu thời gian
    const [response, _categoriesData] = await Promise.all([
      getProducts(),
      getCategories()
    ]);
    
    allProducts = response.products;
    
    renderStatus('clear');
    renderProducts(allProducts);
  } catch (err) {
    // Lưới an toàn bắt lỗi hệ thống và phản ánh lên UI
    const errorMessage = err instanceof Error ? err.message : 'Đã có lỗi không xác định xảy ra';
    renderStatus('error', errorMessage);
  }
}

//Async flow to load and pop single product details by ID inside Modal
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

// Search bar input listener using HOF array .filter mechanism
if (searchInput) {
  searchInput.addEventListener('input', () => {
    const query = searchInput.value.toLowerCase().trim();
    const filtered = allProducts.filter(p => p.title.toLowerCase().includes(query));
    renderProducts(filtered);
  });
}

// Modal closing actions binds
if (closeModalBtn && detailModal) {
  closeModalBtn.addEventListener('click', () => {
    detailModal.classList.add('hidden');
  });
  
  detailModal.addEventListener('click', (e) => {
    if (e.target === detailModal) {
      detailModal.classList.add('hidden');
    }
  });
}

// Initial system activation
document.addEventListener('DOMContentLoaded', loadDashboard);