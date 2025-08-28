// -------------------- Mobile nav toggle --------------------
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');
if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('show');
    });
}

// -------------------- Utility: escape HTML to prevent XSS --------------------
function escapeHTML(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

// -------------------- Render Posts with Pagination --------------------
let currentPage = 1;
const postsPerPage = 5;
let filteredArticles = [...articles]; // 全局筛选后的文章列表
articles.sort((a, b) => new Date(b.date) - new Date(a.date)); // 按日期降序

function renderPosts(postList, page = 1) {
    const postContainer = document.getElementById('post-list');
    if (!postContainer) return;
    postContainer.innerHTML = '';
    const start = (page - 1) * postsPerPage;
    const end = start + postsPerPage;
    const pagePosts = postList.slice(start, end);

    pagePosts.forEach(post => {
    const postDiv = document.createElement('div');
    postDiv.classList.add('post');
    postDiv.innerHTML = `
        <img src="${escapeHTML(post.img)}" alt="${escapeHTML(post.title)}">
        <div class="post-content">
            <h3><a href="${escapeHTML(post.link)}">${escapeHTML(post.title)}</a></h3>
            <p>${escapeHTML(post.summary)}</p>
            <small>${escapeHTML(post.date)} | ${escapeHTML(post.category)}</small>
        </div>
    `;
    postContainer.appendChild(postDiv);
});

    renderPagination(postList.length, page);
}

// -------------------- Pagination --------------------
function renderPagination(totalPosts, page) {
    const paginationContainer = document.getElementById('pagination');
    if (!paginationContainer) return;
    paginationContainer.innerHTML = '';
    const totalPages = Math.ceil(totalPosts / postsPerPage);

    for (let i = 1; i <= totalPages; i++) {
        const btn = document.createElement('button');
        btn.textContent = i;
        if (i === page) btn.classList.add('active');
        btn.addEventListener('click', () => {
            currentPage = i;
            renderPosts(filteredArticles, currentPage);
        });
        paginationContainer.appendChild(btn);
    }
}

// -------------------- Search Functionality with Debounce --------------------
const searchBox = document.getElementById('search-box');
function debounce(func, delay) {
    let timer;
    return function (...args) {
        clearTimeout(timer);
        timer = setTimeout(() => func.apply(this, args), delay);
    };
}
if (searchBox) {
    searchBox.addEventListener('input', debounce((e) => {
        const term = e.target.value.toLowerCase();
        filteredArticles = articles.filter(post =>
            post.title.toLowerCase().includes(term) ||
            post.summary.toLowerCase().includes(term)
        );
        currentPage = 1;
        renderPosts(filteredArticles, currentPage);
    }, 300));
}

// -------------------- Filter by Category --------------------
function filterByCategory(category) {
    filteredArticles = articles.filter(post => post.category === category);
    currentPage = 1;
    renderPosts(filteredArticles, currentPage);
}

// -------------------- Recommended Posts --------------------
function renderRecommendedPosts(currentPostTitle = '', count = 6) {
    const recommendedList = document.getElementById('recommended-list');
    if (!recommendedList) return;
    recommendedList.innerHTML = '';

    const available = articles.filter(post => post.title !== currentPostTitle);
    const recommended = [...available].sort(() => 0.5 - Math.random()).slice(0, count);

    recommended.forEach(post => {
        const card = document.createElement('div');
        card.classList.add('recommended-card');
        card.innerHTML = `
            <a href="${escapeHTML(post.link)}">
                <img src="${escapeHTML(post.img)}" >
                <div class="card-content">${escapeHTML(post.title)}</div>
            </a>
        `;
        recommendedList.appendChild(card);
    });
}

// -------------------- Related Posts --------------------

document.addEventListener("DOMContentLoaded", function() {
    const relatedList = document.getElementById('related-list');
    if (!relatedList) return;

    // 获取 meta 信息
    const currentTitleMeta = document.querySelector("meta[name='post-title']");
    const currentCategoryMeta = document.querySelector("meta[name='current-category']");
    if (!currentTitleMeta || !currentCategoryMeta) return;

    const currentTitle = currentTitleMeta.content.trim();
    const currentCategory = currentCategoryMeta.content.trim();

    // 随机挑选相关文章
    const relatedArticles = articles
        .filter(a => a.category === currentCategory && a.title !== currentTitle)
        .sort(() => Math.random() - 0.5)
        .slice(0, 3);

    // 清空旧内容
    relatedList.innerHTML = '';

relatedArticles.forEach(post => {
    const card = document.createElement('div');
    card.classList.add('related-card');  // 使用相关文章卡片样式
    card.innerHTML = `
        <a href="${escapeHTML(post.link)}">
            ${post.img ? `<img src="${escapeHTML(post.img)}" alt="${escapeHTML(post.title)}">` : ''}
            <div class="card-content">${escapeHTML(post.title)}</div>
        </a>
    `;
    relatedList.appendChild(card);
    });
});


// -------------------- Initialization --------------------
renderPosts(filteredArticles, currentPage);

// 判断当前是否文章页，示例：
const currentPostTitle = window.currentPostTitle || ''; // 页面 JS 需定义当前文章标题
const currentPostCategory = window.currentPostCategory || ''; // 页面 JS 需定义当前文章分类

if (currentPostTitle && currentPostCategory) {
    renderRecommendedPosts(currentPostTitle);
    renderRelatedPosts(currentPostTitle, currentPostCategory);
} else {
    renderRecommendedPosts(); // 首页随机推荐
}
