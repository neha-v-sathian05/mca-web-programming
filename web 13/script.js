
const searchInput = document.getElementById("searchInput");
const results = document.getElementById("results");

let timer;
let controller;

// Listen for user input
searchInput.addEventListener("input", function () {

    clearTimeout(timer);

    const query = searchInput.value.trim();

    if (query === "") {
        if (controller) {
            controller.abort();
        }

        results.innerHTML =
            '<p class="message">Enter a keyword to start searching.</p>';
        return;
    }

    // Delay search slightly while typing
    timer = setTimeout(() => {
        searchData(query);
    }, 300);

});

// Function to fetch search results
async function searchData(query) {

    if (controller) {
        controller.abort();
    }

    controller = new AbortController();

    results.innerHTML =
        '<p class="message">Searching...</p>';

    const url =
        `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query)}&format=json&origin=*&srlimit=10`;

    try {

        const response = await fetch(url, {
            signal: controller.signal
        });

        if (!response.ok) {
            throw new Error("Unable to fetch search results.");
        }

        const data = await response.json();

        displayResults(data.query.search);

    } catch (error) {

        if (error.name === "AbortError") {
            return;
        }

        results.innerHTML =
            `<p class="message">${error.message}</p>`;

    }
}

// Function to display results
function displayResults(items) {

    results.innerHTML = "";

    if (items.length === 0) {
        results.innerHTML =
            '<p class="message">No results found.</p>';
        return;
    }

    items.forEach(item => {

        const card = document.createElement("div");
        card.className = "result-card";

        const title = document.createElement("h2");
        title.textContent = item.title;

        const description = document.createElement("p");
        description.textContent =
            item.snippet.replace(/<[^>]*>/g, "");

        const link = document.createElement("a");
        link.textContent = "Read More";
        link.href =
            `https://en.wikipedia.org/?curid=${item.pageid}`;
        link.target = "_blank";
        link.rel = "noopener noreferrer";

        card.appendChild(title);
        card.appendChild(description);
        card.appendChild(link);

        results.appendChild(card);

    });

}

// Function to clear search
function clearSearch() {

    searchInput.value = "";

    if (controller) {
        controller.abort();
    }

    clearTimeout(timer);

    results.innerHTML =
        '<p class="message">Enter a keyword to start searching.</p>';
}
