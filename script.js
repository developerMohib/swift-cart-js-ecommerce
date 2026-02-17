
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