const homeUrl = `${BASE_URL}/videos?part=snippet,statistics&chart=mostPopular&regionCode=IN&maxResults=20&key=${API_KEY}`;

let cache;

document.addEventListener("DOMContentLoaded", async () => {
    const aside = document.querySelector("#sideBar");
    const toggleAside = document.querySelector(".toggleAside");
    const videoGrid = document.getElementById("video-grid");

    const searchBox = document.getElementById("searchInput");
    const searchBtn = document.getElementById("searchButton");
    const filters = document.getElementById("filters");

    const scrollRight = document.getElementById("scroll-right");

    scrollRight.addEventListener("click", () => {
        scrollRight.parentElement.scrollLeft += 300;
    });

    // ! Show/Hide SideBar
    toggleAside.addEventListener("click", () => {
        aside.classList.toggle("hiddenElement");
    });

    // ! Search Videos
    searchBtn.addEventListener("click", () => {
        const searchText = searchBox.value.trim().replaceAll(" ", "+");
        videoGrid.innerHTML = "";
        searchVideo(searchText, videoGrid);
    });

    cache = await caches.open("videos-cache");

    const cachedItems = await cache.match("video-items");

    if (cachedItems) {
        try {
            const cachedItemsData = await cachedItems.json();
            cachedItemsData.items.map((item) => {
                videoGrid.appendChild(createVideoItem(item));
            });
        } catch (error) {
            console.error("Error parsing cached items:", error);
        }
    } else {
        try {
            const response = await fetch(homeUrl);
            const responseData = await response.json();
            if (responseData.error) {
                console.error(responseData.error.message);
            } else {
                // Store in cache
                cache.put(
                    "video-items",
                    new Response(JSON.stringify(responseData))
                );
                // Render Data in Page
                responseData.items.map((item) => {
                    videoGrid.appendChild(createVideoItem(item));
                });
            }
        } catch (error) {
            console.error(error);
        }
    }
    fetchCategories().then((categories) => {
        // console.log(categories);
        categories.map((category) => {
            const filterItem = document.createElement("div");
            filterItem.className = "filter-item";
            filterItem.innerHTML = `<p>${category.snippet.title}</p>`;
            filters.appendChild(filterItem);
        });
    });
});
const searchVideo = (searchText, videoGrid) => {
    fetch(
        `${BASE_URL}/search?part=snippet,statistics&q=${searchText}&maxResults=20&key=${API_KEY}`
    )
        .then(async (response) => await response.json())
        .then((data) => {
            if (data.error) {
                console.error(data.error.message);
            } else {
                data.items.map((item) => {
                    videoGrid.appendChild(createVideoItem(item));
                });
            }
        });
};

const fetchCategories = async () => {
    const response = await fetch(
        `${BASE_URL}/videoCategories?part=snippet&regionCode=IN&key=${API_KEY}`
    );
    const json = await response.json();
    return json.items;
};
