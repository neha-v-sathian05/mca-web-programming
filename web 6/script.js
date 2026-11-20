
const products = [
    {
        name: "Premium Laptop",
        price: 55000,
        category: "Electronics",
        icon: "💻",
        badge: "BESTSELLER"
    },
    {
        name: "Smartphone",
        price: 22000,
        category: "Electronics",
        icon: "📱",
        badge: "HOT DEAL"
    },
    {
        name: "Wireless Headphones",
        price: 1800,
        category: "Electronics",
        icon: "🎧",
        badge: "POPULAR"
    },
    {
        name: "Classic T-Shirt",
        price: 599,
        category: "Clothing",
        icon: "👕",
        badge: "TRENDING"
    },
    {
        name: "Denim Jeans",
        price: 1299,
        category: "Clothing",
        icon: "👖",
        badge: "NEW"
    },
    {
        name: "JavaScript Guide",
        price: 650,
        category: "Books",
        icon: "📘",
        badge: "POPULAR"
    },
    {
        name: "Python Programming",
        price: 799,
        category: "Books",
        icon: "📗",
        badge: "BESTSELLER"
    },
    {
        name: "Smart Watch",
        price: 2499,
        category: "Electronics",
        icon: "⌚",
        badge: "HOT DEAL"
    }
];

const productList = document.getElementById("productList");
const search = document.getElementById("search");
const category = document.getElementById("category");
const noResults = document.getElementById("noResults");
const count = document.getElementById("count");
const cartCount = document.getElementById("cartCount");

let cart = 0;

function displayProducts() {

    const searchText = search.value.toLowerCase();
    const selectedCategory = category.value;

    const filteredProducts = products.filter(product => {

        const matchesSearch =
            product.name.toLowerCase().includes(searchText);

        const matchesCategory =
            selectedCategory === "All" ||
            product.category === selectedCategory;

        return matchesSearch && matchesCategory;
    });

    productList.innerHTML = "";

    filteredProducts.forEach(product => {

        productList.innerHTML += `
            <div class="product">

                <span class="product-badge">
                    ${product.badge}
                </span>

                <div class="product-icon">
                    ${product.icon}
                </div>

                <h3>${product.name}</h3>

                <p class="price">
                    ₹${product.price.toLocaleString("en-IN")}
                </p>

                <span class="category-label">
                    ${product.category}
                </span>

                <button class="add-btn">
                    + Add to Cart
                </button>

            </div>
        `;
    });

    count.textContent =
        "Showing " + filteredProducts.length + " products";

    noResults.style.display =
        filteredProducts.length === 0 ? "block" : "none";
}

// Search Products
search.addEventListener("input", displayProducts);

// Filter Categories
category.addEventListener("change", displayProducts);

// Add to Cart
productList.addEventListener("click", function(event) {

    if (event.target.classList.contains("add-btn")) {

        cart++;

        cartCount.textContent = cart;

        event.target.textContent = "✓ Added!";

        setTimeout(() => {
            event.target.textContent = "+ Add to Cart";
        }, 1000);
    }
});

// Display all products initially
displayProducts();


