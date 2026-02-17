
const API_URL = 'https://fakestoreapi.com/products';
const DETAILS_PAGE = 'productdetails.html';

const escapeHtml = (str) => {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
};

const showLoading = (containerId) => {
  const container = document.getElementById(containerId);
  if (container) {
    container.innerHTML = `
      <div class="col-span-full flex flex-col items-center justify-center py-20">
        <span class="loading loading-spinner loading-lg text-primary"></span>
        <p class="mt-4 text-gray-500 font-medium">Loading products...</p>
      </div>`;
  }
};

const showError = (containerId, message) => {
  const container = document.getElementById(containerId);
  if (container) {
    container.innerHTML = `
      <div class="col-span-full text-center py-10">
        <i class="fa-solid fa-circle-exclamation text-error text-3xl"></i>
        <p class="mt-3 text-gray-600 font-medium">${message}</p>
        <button onclick="location.reload()" class="btn btn-sm btn-outline mt-4">Retry</button>
      </div>`;
  }
};

const createProductCard = (product) => {
  return `
    <div class="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden group hover:shadow-lg transition-all duration-300">
      <div class="bg-gray-100 p-6 relative">
        <img 
          class="h-48 w-full object-contain group-hover:scale-105 transition-transform duration-500"
          src="${escapeHtml(product.image)}" 
          alt="${escapeHtml(product.title)}"
          loading="lazy">
      </div>
      <div class="p-5">
        <div class="flex items-center gap-1 mb-3 justify-between">
        <span class="text-xs font-bold text-gray-700">${product.category}</span>
       
          <span class="text-xs font-bold text-gray-700">  <i class="fa-solid fa-star text-yellow-400 text-xs"></i> ${product.rating.rate} <span class="text-gray-400">(${product.rating.count})</span></span>
        </div>
        <h3 class="text-gray-800 font-bold mb-3 line-clamp-2 min-h-[48px] group-hover:text-blue-600 transition-colors">
          ${escapeHtml(product.title)}
        </h3>
          <p class="text-xl font-bold text-primary mb-4">$${product.price.toFixed(2)}</p>
        <div class="flex gap-2">
          <a href="${DETAILS_PAGE}?id=${product.id}" 
             class="flex-1 btn btn-ghost btn-sm border-gray-300 hover:border-blue-500 hover:text-blue-600 rounded-xl">
            <i class="fa-regular fa-eye mr-1"></i> View
          </a>
          <button onclick="addToCart(${product.id}, '${escapeHtml(product.title)}', ${product.price}, '${escapeHtml(product.image)}')" 
                  class="flex-1 btn btn-primary btn-sm rounded-xl text-white">
            <i class="fa-solid fa-cart-plus mr-1"></i> Add
          </button>
        </div>
      </div>
    </div>`;
};


const showNotification = (message, type = 'info') => {
  const toast = document.createElement('div');
  toast.className = `toast toast-end toast-top z-50`;
  toast.innerHTML = `
    <div class="alert alert-${type} shadow-lg">
      <span class="text-sm font-medium">${message}</span>
    </div>`;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 2500);
};

const loadTrending = async () => {
  const container = document.getElementById('trending-products-container');
  if (!container) return;
  
  showLoading('trending-products-container');
  
  try {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error('Failed to fetch');
    
    const data = await res.json();
    const top4 = data
      .sort((a, b) => b.rating.count - a.rating.count)
      .slice(0, 4);
    
    container.innerHTML = top4.map(p => createProductCard(p)).join('');
    
  } catch (err) {
    console.error('Trending error:', err);
    showError('trending-products-container', 'Could not load trending products');
  }
};

let allProductsData = [];

const loadProducts = async () => {
  const container = document.getElementById('products-container');
  const tabsContainer = document.getElementById('categoryTab');
  
  if (!container) return;
  showLoading('products-container');
  
  try {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error('Failed to fetch');
    
    allProductsData = await res.json();
    
    // Render all products initially
    renderProducts(allProductsData);
    
    // Setup category tabs
    if (tabsContainer) setupCategoryTabs(tabsContainer);
    
  } catch (err) {
    console.error('Products error:', err);
    showError('products-container', 'Could not load products');
  }
};

const renderProducts = (products) => {
  const container = document.getElementById('products-container');
  if (!container) return;
  
  if (products.length === 0) {
    container.innerHTML = `
      <div class="col-span-full text-center py-16">
        <i class="fa-solid fa-box-open text-gray-300 text-4xl"></i>
        <p class="mt-3 text-gray-500">No products found</p>
      </div>`;
    return;
  }
  
  container.innerHTML = products.map(p => createProductCard(p)).join('');
};

const setupCategoryTabs = (tabsContainer) => {
  // Unique categories using Set (fast!)
  const categories = [...new Set(allProductsData.map(p => p.category))];
  
  // "All" button
  const allBtn = document.createElement('button');
  allBtn.className = 'tab tab-active px-5 py-2 rounded-lg font-medium text-sm transition-all';
  allBtn.textContent = 'All';
  allBtn.onclick = () => filterByCategory('all', allBtn);
  tabsContainer.appendChild(allBtn);
  
  // Category buttons
  categories.forEach(cat => {
    const btn = document.createElement('button');
    btn.className = 'tab px-5 py-2 rounded-lg font-medium text-sm capitalize transition-all hover:bg-base-200';
    btn.textContent = cat;
    btn.onclick = () => filterByCategory(cat, btn);
    tabsContainer.appendChild(btn);
  });
};

const filterByCategory = (category, clickedBtn) => {
  // Update active tab
  document.querySelectorAll('#categoryTab .tab').forEach(tab => 
    tab.classList.remove('tab-active'));
  clickedBtn.classList.add('tab-active');
  
  // Filter & render
  const filtered = category === 'all' 
    ? allProductsData 
    : allProductsData.filter(p => p.category === category);
  
  renderProducts(filtered);
  
  // Smooth scroll to products
  document.getElementById('products-container')?.scrollIntoView({ 
    behavior: 'smooth', 
    block: 'start' 
  });
};


// ============ INITIALIZE ============
document.addEventListener('DOMContentLoaded', () => {
  // Load features if elements exist
  if (document.getElementById('trending-products-container')) loadTrending();
  if (document.getElementById('products-container')) loadProducts();
  
  // Setup search if input exists
  setupSearch();
  
  // Initialize cart badge
  updateCartBadge();
  
  // Auto-hide navbar on scroll (optional UX)
  let lastScroll = 0;
  window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;
    const currentScroll = window.pageYOffset;
    if (currentScroll > lastScroll && currentScroll > 100) {
      navbar.classList.add('navbar-hidden');
    } else {
      navbar.classList.remove('navbar-hidden');
    }
    lastScroll = currentScroll;
  });
});

// Expose functions for HTML onclick attributes
window.addToCart = addToCart;
window.filterByCategory = filterByCategory;