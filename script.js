
// trendings products
const trendingProducts = () => {
    const url = 'https://fakestoreapi.com/products';
    const trendingContainer = document.getElementById('trending-products-container');
    trendingContainer.innerHTML = `
        <div class="col-span-full flex flex-col items-center justify-center py-20">
            <span class="loading loading-spinner loading-lg text-primary"></span>       
            <p class="mt-4 text-gray-500 font-medium">Loading products...</p>
        </div>
    `;

    fetch(url)
        .then(res => res.json())
        .then(data => {
            trendingContainer.innerHTML = '';
            // sort by rating count and get top 4
            const sorted = data.sort((a, b) => b.rating.count - a.rating.count);
            const top4 = sorted.slice(0, 4);
            top4.forEach(product => {
                console.log('Trending products:', product.rating.count, typeof product.rating.count);

                const trendingDiv = document.createElement('div');
                trendingDiv.innerHTML = `
 <div class="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden group">
                    <div class="bg-gray-300 p-6 relative">
                        <img class="h-48 w-full object-contain group-hover:scale-105 transition-transform duration-500"
                            src=${product.image} alt=${product.title}>
                    </div>

                    <div class="p-5 border-t border-gray-50">
                        <div class="flex justify-between items-center mb-3">
                            <span class="text-xs font-bold text-blue-600 uppercase">${product.category}</span>
                            <div class="flex items-center gap-1">
                                <i class="fa-solid fa-star text-yellow-400 text-xs"></i>
                                <span class="text-xs font-bold text-gray-700">${product.rating.rate} (${product.rating.count}) </span>
                            </div>
                        </div>                            
                            <h3 class="text-gray-800 font-bold mb-4 line-clamp-1 group-hover:text-blue-600 transition-colors">${product.title}</h3>

                        <div class="mb-5">
                            <p class="font-bold text-gray-900">Price: $${product.price}</p>
                        </div>

                        <div class="flex gap-2">
                            <a href="productdetails.html?id=${product.id}"
                                class="flex-1 btn btn-ghost btn-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg">
                                <i class="fa-regular fa-eye"></i> Details
                            </a>
                            <button class="flex-1 btn btn-primary btn-sm rounded-lg text-white">
                                <i class="fa-solid fa-cart-plus"></i> Add
                            </button>
                        </div>
                    </div>
                </div>
`
trendingContainer.appendChild(trendingDiv);

            });
        })
        .catch(err => console.log(err));
}
trendingProducts();



const allProducts = () => {
    const productsContainer = document.getElementById('products-container');
    productsContainer.innerHTML = `
        <div class="col-span-full flex flex-col items-center justify-center py-20">
            <span class="loading loading-spinner loading-lg text-primary"></span>
            <p class="mt-4 text-gray-500 font-medium">Loading products...</p>
        </div>
    `;
    const url = 'https://fakestoreapi.com/products';
    fetch(url)
        .then(res => res.json())
        .then(data => {
            productsContainer.innerHTML = '';

            data.forEach(product => {
                const productDiv = document.createElement('div');
                productDiv.innerHTML = `
                <div class="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden group">
                    <div class="bg-gray-300 p-6 relative">
                        <img class="h-48 w-full object-contain group-hover:scale-105 transition-transform duration-500"
                            src=${product.image} alt=${product.title}>
                    </div>

                    <div class="p-5 border-t border-gray-50">
                        <div class="flex justify-between items-center mb-3">
                            <span class="text-xs font-bold text-blue-600 uppercase">${product.category}</span>
                            <div class="flex items-center gap-1">
                                <i class="fa-solid fa-star text-yellow-400 text-xs"></i>
                                <span class="text-xs font-bold text-gray-700">${product.rating.rate} (${product.rating.count}) </span>
                            </div>
                        </div>                            
                            <h3 class="text-gray-800 font-bold mb-4 line-clamp-1 group-hover:text-blue-600 transition-colors">${product.title}</h3>

                        <div class="mb-5">
                            <p class="font-bold text-gray-900">Price: $${product.price}</p>
                        </div>

                        <div class="flex gap-2">
                            <button
                                class="flex-1 btn btn-ghost btn-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg">
                                <i class="fa-regular fa-eye"></i> Details
                            </button>
                            <button class="flex-1 btn btn-primary btn-sm rounded-lg text-white">
                                <i class="fa-solid fa-cart-plus"></i> Add
                            </button>
                        </div>
                    </div>
                </div>
                `
                productsContainer.appendChild(productDiv);
            });

        })
        .catch(err => console.log(err));
}

allProducts();

let globalProducts = [];

const categoryFilter = () => {
    const url = 'https://fakestoreapi.com/products';
    const categoryTab = document.getElementById('categoryTab');
    categoryTab.innerHTML = `
        <div class="col-span-full flex flex-col items-center justify-center py-20">
            <span class="loading loading-spinner loading-lg text-primary"></span>
            <p class="mt-4 text-gray-500 font-medium">Loading products...</p>
        </div>
    `;
    fetch(url)
        .then(res => res.json())
        .then(data => {
            globalProducts = data;

            const categories = data.reduce((unique, item) => {
                if (!unique.includes(item.category)) {
                    unique.push(item.category);
                }
                return unique;
            }, []);
            categoryTab.innerHTML = '';
            // show all prod initially
            const allBtn = document.createElement('button');
            allBtn.role = 'tab';
            allBtn.className = 'tab tab-active px-6 rounded-lg font-medium transition-all duration-300 text-sm';
            allBtn.innerText = 'All';
            // pass parameter to filter 
            allBtn.onclick = (e) => handleFilter('all', e.target);
            categoryTab.appendChild(allBtn);

            categories.forEach(cat => {
                const btn = document.createElement('button');
                btn.role = 'tab';
                btn.className = 'tab px-6 rounded-lg font-medium transition-all duration-300 text-sm hover:bg-white/50 whitespace-nowrap capitalize';
                btn.innerText = cat;
                btn.onclick = (e) => handleFilter(cat, e.target);
                categoryTab.appendChild(btn);
            });
            // call to show all products initially
            displayProducts(data);
        })
        .catch(err => console.log(err));
}

const handleFilter = (category, targetElement) => {
    const allTabs = document.querySelectorAll('#categoryTab .tab');
    allTabs.forEach(tab => tab.classList.remove('tab-active'));
    targetElement.classList.add('tab-active');

    if (category === 'all') {
        displayProducts(globalProducts);
    } else {
        const filtered = globalProducts.filter(p => p.category === category);
        displayProducts(filtered);
    }
}

const displayProducts = (products) => {
    const productsContainer = document.getElementById('products-container');
    productsContainer.innerHTML = '';

    products.forEach(product => {
        const div = document.createElement('div');
        div.className = "bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden group";
        div.innerHTML = `
                           <div class="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden group">
                    <div class="bg-gray-300 relative">
                        <img class="h-48 w-full object-contain group-hover:scale-105 transition-transform duration-500"
                            src=${product.image} alt=${product.title}>
                    </div>

                    <div class="border-t border-gray-50 p-5">
                        <div class="flex justify-between items-center mb-3">
                            <span class="text-xs font-bold text-blue-600 uppercase">${product.category}</span>
                            <div class="flex items-center gap-1">
                                <i class="fa-solid fa-star text-yellow-400 text-xs"></i>
                                <span class="text-xs font-bold text-gray-700">${product.rating.rate} (${product.rating.count}) </span>
                            </div>
                        </div>                            
                            <h3 class="text-gray-800 font-bold mb-4 line-clamp-1 group-hover:text-blue-600 transition-colors">${product.title}</h3>

                        <div class="mb-5">
                            <p class="font-bold text-gray-900">Price: $${product.price}</p>
                        </div>

                        <div class="flex gap-2">
                            <button
                                class="flex-1 btn btn-ghost btn-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg">
                                <i class="fa-regular fa-eye"></i> Details
                            </button>
                            <button class="flex-1 btn btn-primary btn-sm rounded-lg text-white">
                                <i class="fa-solid fa-cart-plus"></i> Add
                            </button>
                        </div>
                    </div>
                </div>
        `;
        productsContainer.appendChild(div);
    });
}

categoryFilter();

