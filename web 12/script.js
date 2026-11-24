
const newsContainer = document.getElementById("newsContainer");
const searchInput = document.getElementById("searchInput");

// Function to load latest news
async function loadNews() {

    newsContainer.innerHTML =
        '<p class="message">Loading latest news...</p>';

    const url =
        "https://api.spaceflightnewsapi.net/v4/articles/?limit=12";

    try {

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error("Unable to fetch news.");
        }

        const data = await response.json();

        displayNews(data.results);

    } catch (error) {

        console.log("News API Error:", error);

        newsContainer.innerHTML =
            `<p class="message">Error: ${error.message}</p>`;

    }
}

// Function to display news articles
function displayNews(articles) {

    newsContainer.innerHTML = "";

    if (!articles || articles.length === 0) {
        newsContainer.innerHTML =
            '<p class="message">No news articles found.</p>';
        return;
    }

    articles.forEach(article => {

        const card = document.createElement("div");
        card.className = "news-card";

        const image = document.createElement("img");

        image.src = article.image_url ||
            "https://placehold.co/600x400?text=No+Image";

        image.alt = "News Image";

        image.onerror = function () {
            this.src = "https://placehold.co/600x400?text=No+Image";
        };

        const content = document.createElement("div");
        content.className = "news-content";

        const title = document.createElement("h2");
        title.textContent = article.title || "No Title";

        const description = document.createElement("p");
        description.textContent =
            article.summary || "No description available.";

        const source = document.createElement("p");
        source.className = "source";
        source.textContent =
            "Source: " + (article.news_site || "Unknown");

        const date = document.createElement("p");
        date.textContent = "Date: " +
            (article.published_at
                ? new Date(article.published_at).toLocaleDateString()
                : "Unavailable");

        const link = document.createElement("a");
        link.textContent = "Read More";
        link.href = article.url || "#";
        link.target = "_blank";
        link.rel = "noopener noreferrer";

        content.appendChild(title);
        content.appendChild(description);
        content.appendChild(source);
        content.appendChild(date);
        content.appendChild(link);

        card.appendChild(image);
        card.appendChild(content);

        newsContainer.appendChild(card);

    });
}

// Function to search news articles
async function searchNews() {

    const query = searchInput.value.trim();

    if (query === "") {
        newsContainer.innerHTML =
            '<p class="message">Please enter a search term.</p>';
        return;
    }

    newsContainer.innerHTML =
        '<p class="message">Searching news...</p>';

    const url =
        `https://api.spaceflightnewsapi.net/v4/articles/?search=${encodeURIComponent(query)}&limit=12`;

    try {

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error("Unable to search news.");
        }

        const data = await response.json();

        displayNews(data.results);

    } catch (error) {

        console.log("Search API Error:", error);

        newsContainer.innerHTML =
            `<p class="message">Error: ${error.message}</p>`;

    }
}

// Load news when the page opens
loadNews();
