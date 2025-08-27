// Mobile nav toggle (already included from index.js)
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');

if(navToggle){
    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('show');
    });
}


// Sample blog posts data
const posts = [
    {title: "Top 5 Investment Strategies for 2025", content: "Discover the most effective investment approaches to grow your portfolio in 2025 and beyond."},
    {title: "How to Save for Retirement Without Sacrificing Today", content: "Learn smart ways to balance living your best life now while planning for a secure future."},
    {title: "Understanding Cryptocurrency Risks", content: "A clear guide to navigating the volatile crypto market safely and wisely."},
    {title: "Budgeting Tips for Young Professionals", content: "Simple, practical tips to manage your money, reduce debt, and build savings early."},
    {title: "Top 10 Stocks to Watch This Year", content: "A curated list of potential high-performing stocks and what to watch out for."}
];

// Function to render posts
function renderPosts(postList) {
    const postContainer = document.getElementById('post-list');
    postContainer.innerHTML = '';
    postList.forEach(post => {
        const postDiv = document.createElement('div');
        postDiv.classList.add('post');
        postDiv.innerHTML = `<h3>${post.title}</h3><p>${post.content}</p>`;
        postContainer.appendChild(postDiv);
    });
}

// Initial render
renderPosts(posts);

// Search functionality
const searchBox = document.getElementById('search-box');
searchBox.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const filtered = posts.filter(post => post.title.toLowerCase().includes(searchTerm));
    renderPosts(filtered);
});




// Related posts example
const relatedPosts = [
    {title: "Top 5 Investment Strategies for 2025", link: "index.html"},
    {title: "How to Save for Retirement Without Sacrificing Today", link: "index.html"},
    {title: "Understanding Cryptocurrency Risks", link: "index.html"}
];

const relatedList = document.getElementById('related-list');
if(relatedList){
    relatedPosts.forEach(post => {
        const div = document.createElement('div');
        div.classList.add('post');
        div.innerHTML = `<a href="${post.link}">${post.title}</a>`;
        relatedList.appendChild(div);
    });
}

// Recommended posts for sidebar
const recommendedPosts = [
    {
        title: "Top 5 Investment Strategies for 2025",
        link: "../posts/2025-08-27-investment-strategies.html",
        img: "../assets/investment.jpg"
    },
    {
        title: "How to Save for Retirement Without Sacrificing Today",
        link: "../posts/2025-08-25-retirement-saving.html",
        img: "../assets/retirement.jpg"
    },
    {
        title: "Understanding Cryptocurrency Risks",
        link: "../posts/2025-08-20-crypto-risks.html",
        img: "../assets/crypto.jpg"
    }
];

const recommendedList = document.getElementById('recommended-list');

if(recommendedList){
    recommendedPosts.forEach(post => {
        const card = document.createElement('div');
        card.classList.add('recommended-card');
        card.innerHTML = `
            <img src="${post.img}" alt="${post.title}">
            <div class="card-content">
                <a href="${post.link}">${post.title}</a>
            </div>
        `;
        recommendedList.appendChild(card);
    });
}
