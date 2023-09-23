document.addEventListener("DOMContentLoaded", async () => {
    const aside = document.querySelector("#sideBar");
    const toggleAside = document.querySelector(".toggleAside");
    const searchBox = document.getElementById("searchInput");
    const searchBtn = document.getElementById("searchButton");
    const player = document.querySelector("#player");
    const cContainer = document.getElementById("commentsList");
    const videoList = document.getElementById("video-list");

    const videoId = sessionStorage.getItem("video-id");

    // Hide aside on page load
    aside.className = "hiddenElement";

    toggleAside.addEventListener("click", () => {
        aside.classList.toggle("hiddenElement");
    });

    // Diaabled input searchBox
    searchBox.disabled = true;

    searchBtn.addEventListener("click", () => {
        window.location.pathname = "/index.html";
    });

    fetchVideoById(videoId).then((videoData) => {
        // console.log(videoData.items[0]);
        const item = videoData.items[0];
        const cCount = document.getElementById("totalComments");
        const tags = document.getElementById("tags");

        // Load video
        // player.innerHTML = `
        // <iframe src="https://www.youtube.com/embed/${videoId}" frameborder="0"  allowfullscreen></iframe>`;
        player.innerHTML = item.player.embedHtml;

        cCount.innerText = `${item.statistics.commentCount} Comments`;

        createVideoDetails(item.snippet, item.statistics);

        fetchRelatedVideos(item.snippet.categoryId).then((relatedData) => {
            relatedData.items.map((item) => {
                videoList.appendChild(createVideoItem(item));
            });
        });
        if (item.snippet.tags) {
            item.snippet.tags.map((tag) => {
                const filterItem = document.createElement("div");
                filterItem.className = "filter-item";
                filterItem.innerHTML = `<p>${tag}</p>`;
                tags.appendChild(filterItem);
            });
        }
    });

    fetchCommentsById(videoId).then((commentData) => {
        commentData.items.map((cData) => {
            createComments(cContainer, cData);
        });
        // createComments();
    });
});

async function fetchVideoById(videoId) {
    const response = await fetch(
        `${BASE_URL}/videos?part=snippet,statistics,player&id=${videoId}&key=${API_KEY}`
    );
    const json = await response.json();
    // return json.items[0];
    return json;
}

async function fetchCommentsById(videoId) {
    const response = await fetch(
        `${BASE_URL}/commentThreads?part=snippet,replies&videoId=${videoId}&key=${API_KEY}`
    );
    const json = await response.json();
    // return json.items[0];
    return json;
}

// fetch Related videos
async function fetchRelatedVideos(vCatId) {
    const response = await fetch(
        `${BASE_URL}/videos?part=snippet,statistics&chart=mostPopular&regionCode=IN&videoCategoryId=${vCatId}&maxResults=20&key=${API_KEY}`
    );
    const json = await response.json();
    // return json.items[0];
    return json;
}

// Create video details
const createVideoDetails = (snippet, statistics) => {
    // Get video details container
    const videoDetails = document.getElementById("details");

    // Create & append video title
    const vidTitle = document.createElement("h3");
    vidTitle.innerHTML = snippet.title;
    videoDetails.appendChild(vidTitle);

    // Create & append video stats and actions
    const vidInfo = document.createElement("div");
    vidInfo.id = "vid-info";
    const publishDate = new Date(snippet.publishedAt);
    vidInfo.innerHTML = `
        <div id="views-date">${statistics.viewCount} views . ${publishDate
        .toDateString()
        .slice(4)}</div>
        <div id="actions">
            <button class="action-button">
                <img src="assets/liked.png" alt="Like-Icon" />
                <span>${convertCount(statistics.likeCount)}</span>
            </button>
            <button class="action-button">
                <img src="assets/dislike.png" alt="Dislike-Icon" />
            </button>
            <button class="action-button">
                <img src="assets/share.png" alt="Share-Icon" />
                <span>Share</span>
            </button>
            <button class="action-button">
                <img src="assets/save.png" alt="Save-Icon" />
                <span>Save</span>
            </button>
            <button class="action-button">
                <img src="assets/more.png" alt="More-Icon" />
            </button>
        </div>
        `;
    videoDetails.appendChild(vidInfo);

    // Create & append channel and video description
    const descriptionBox = document.createElement("div");
    descriptionBox.id = "descriptionBox";
    const channelData = document.createElement("div");
    channelData.id = "channelData";

    channelData.innerHTML = `
        <div id = channelData>
            <img id="channel-logo" class="avatar" src="assets/userAvatar.png" alt="channel-logo"/>
            <div id="channel-title">
                <h4>${snippet.channelTitle}</h4>
                <p>${snippet.channelTitle}</p>
            </div>
        </div>
        <button id="subscribeBtn">SUBSCRIBE</button>
    `;
    descriptionBox.appendChild(channelData);

    const description = document.createElement("div");
    description.id = "description";
    description.innerHTML = `
        <p>${snippet.description}</p>
    `;
    descriptionBox.appendChild(description);

    videoDetails.appendChild(descriptionBox);
};

const createComments = (cContainer, cData) => {
    const commentBox = document.createElement("div");
    commentBox.className = "commentBox";

    commentBox.innerHTML = `
        <img class="avatar" src="${
            cData.snippet.topLevelComment.snippet.authorProfileImageUrl
        }" alt="userIcon" />
        <div class="commentText">
            <div class="commentHeader">
                <span>${
                    cData.snippet.topLevelComment.snippet.authorDisplayName
                }</span>
                <span>${convertDateToRelativeTime(
                    cData.snippet.topLevelComment.snippet.publishedAt
                )}</span>
            </div>
            <p>${cData.snippet.topLevelComment.snippet.textDisplay}</p>
            <div class="commentFooter">
                <button><img src="assets/liked.png" alt="Like-Icon" />${
                    cData.snippet.topLevelComment.snippet.likeCount
                }</button>
                <button><img src="assets/dislike.png" alt="Like-Icon" /></button>
                <button>Reply</button>
            </div>
        </div>
    `;
    cContainer.append(commentBox);
};
