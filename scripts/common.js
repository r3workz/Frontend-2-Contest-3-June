const BASE_URL = "https://www.googleapis.com/youtube/v3"
const API_KEY = "AIzaSyArFYYF3huX2wKXpL_vUsDUK5rz_I8wKLY"

const createVideoItem = item => {
	// console.log(item);
	const vidItem = document.createElement("div")
	vidItem.className = "video-item"
	vidItem.innerHTML = `
    <img class="vi-image" src="${item.snippet.thumbnails.medium.url}" alt=""/>
    <div class="vi-title"><p>${item.snippet.title}</p></div>
    <div class="vi-channel">${item.snippet.channelTitle}</div>
    
    `
	// <div class="vi-views-uploaded">${convertCount(
	// 	item.statistics.viewCount
	// )} views . ${convertDateToRelativeTime(item.snippet.publishedAt)}</div>

	const statistics = document.createElement("div")
	statistics.className = "vi-views-uploaded"

	if (item.statistics) {
		statistics.innerHTML = `
        ${convertCount(
			item.statistics.viewCount
		)} views . ${convertDateToRelativeTime(item.snippet.publishedAt)}
        `
	}
	vidItem.appendChild(statistics)

	vidItem.addEventListener("click", () => {
		sessionStorage.setItem("video-id", item.id)
		window.location.pathname = "/videoDetails.html"
	})
	return vidItem
}

// Convert date to relative time (1 day ago, 2 hours ago, etc)
function convertDateToRelativeTime(dateString) {
	const date = new Date(dateString)
	const now = new Date()
	const difference = now - date

	const seconds = Math.floor(difference / 1000)
	const minutes = Math.floor(seconds / 60)
	const hours = Math.floor(minutes / 60)
	const days = Math.floor(hours / 24)
	const weeks = Math.floor(days / 7)

	let unit
	let number

	if (weeks > 0) {
		unit = weeks > 1 ? "weeks" : "week"
		number = weeks
	} else if (days > 0) {
		unit = days > 1 ? "days" : "day"
		number = days
	} else if (hours > 0) {
		unit = hours > 1 ? "hours" : "hour"
		number = hours
	} else if (minutes > 0) {
		unit = minutes > 1 ? "minutes" : "minute"
		number = minutes
	} else {
		unit = "seconds"
		number = seconds
	}

	return `${number} ${unit} ago`
}

// Convert viewCount to human readable(K=1000, M=1000000)
function convertCount(viewCount) {
	const K = 1000
	const M = 1000000
	if (viewCount < K) {
		return `${viewCount}`
	}
	if (viewCount < M) {
		return `${(viewCount / K).toFixed(1)} K`
	}
	return `${(viewCount / M).toFixed(1)} M`
}
