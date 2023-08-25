const playPausebtn = document.querySelector(".play-pause-btn")
const fullScreenbtn = document.querySelector(".full-screen-btn")
const miniPlayerbtn = document.querySelector(".mini-player-btn")

const muteBtn = document.querySelector(".mute-btn")
const volumeSlider = document.querySelector(".volume-slider")
const speedBtn = document.querySelector(".speed-btn")

const currentTimeElem = document.querySelector(".current-time")
const totalTimeElem = document.querySelector(".total-time")
const previewImg = document.querySelector(".preview-img")
const thumbnailImg = document.querySelector(".thumbnail-img")

const videoContainer = document.querySelector(".vid-container")
const timelineContainer = document.querySelector(".timeline")
const video = document.querySelector("video")




//timeline

timelineContainer.addEventListener("mousemove", handleTimelineUpdate)
timelineContainer.addEventListener("mousedown", toggleScrubbing)
document.addEventListener("mouseup", e => {
    if (isScrubbing) toggleScrubbing(e)
})

document.addEventListener("mousemove", e => {
    if (isScrubbing) handleTimelineUpdate(e)
})

let isScrubbing = false
function toggleScrubbing(e) {
    const rect = timelineContainer.getBoundingClientRect()
    const percent = Math.min(Math.max(0, e.x - rect.x), rect.width) /
    rect.width
    isScrubbing = (e.buttons & 1) === 1
    videoContainer.classList.toggle("scrubbing", isScrubbing)
    if (isScrubbing) {
        wasPaused =video.paused
        video.pause()
    }else{
        video.currentTime = percent * video.duration
        if(!wasPaused) video.play()
    }
handleTimelineUpdate()
}


function handleTimelineUpdate(e) {
    const rect = timelineContainer.getBoundingClientRect()
    const percent = Math.min(Math.max(0, e.x - rect.x), rect.width) /
    rect.width
    const previewImgNumber = Math.max(1, math.floor((percent * 
        video.duration) / 10))
        const previewImgSrc = `assets/previewImgs/preview${previewImgNumber}.jpg`
        previewImg.src = previewImgSrc
        timelineContainer.computedStyleMap.setProperty("--preview-position", percent)

        if (isSrubbing) {
            e.preventDefault()
            thumbnailImg.src = previewImgSrc
            timelineContainer.style.setProperty("--progress-position", percent)
        }
}



document.addEventListener("keydown", e =>{
    const tagName = document.activeElement.tagName.toLowerCase()
    if (tagName === "input") return

    switch(e.key) {
        case " ":
            if (tagName === "input") return
        case "k":
            togglePlay()
            break;
        case "f":
            toggleFullScreenMode()
            break;
        case "i":
            toggleMiniPlayerMode()
            break;
        case "m":
            toggleMute()
            break;
        case "arrowleft":
        case "j" :
            skip(-5)
            break;
        case "arrowright":
        case "l" :
            skip(-5)
            break;
    }
})


speedBtn.addEventListener("click", changePlaybackSpeed)
function changePlaybackSpeed(){
    let newPlayBackRate = video.playbackRate + 0.25
    if (newPlayBackRate >2) newPlayBackRate = 0.25
    video.playbackRate = newPlayBackRate
    speedBtn.textContent = `${newPlayBackRate}x`
}

//duration
video.addEventListener("loadeddata", ()=> {
    totalTimeElem.textContent = formatDuration(video.duration)
})
video.addEventListener("timeupdate", ()=>{
    currentTimeElem.textContent = formatDuration(video.currentTime)
    const percent = video.currentTime / video.duration
    timelineContainer.style.setProperty("--progress-position", percent)
})

const zeroFormatter = new Intl.NumberFormat(undefined, {
    minimumIntegerDigits : 2
})
function formatDuration(time){
    const seconds =Math.floor(time % 60)
    const minutes = Math.floor(time /60) %60
    const hours =Math.floor(time / 3600)
    if(hours === 0) {
        return `${minutes}:${zeroFormatter.format(seconds)}`
    } else{
        return `${hours}:${minutes}:${zeroFormatter.format(seconds)}`
    }
}



function skip(duration) {
    video.currentTime += duration
}

//play or pause
playPausebtn.addEventListener("click", togglePlay)
video.addEventListener("click", togglePlay)

//volume
muteBtn.addEventListener("click", toggleMute)
volumeSlider.addEventListener("input", e =>{
    video.volume = e.target.value
    video.muted = e.target.value === 0
})

function toggleMute() {
    video.muted = !video.muted
}
video.addEventListener("volumechange", ()=>{
    volumeSlider.value = video.volume
    let volumeLevel
    if(video.muted || video.volume === 0){
        volumeSlider.value = 0
        volumeLevel = "muted"
    }else if(video.volume >= 0.5) {
        volumeLevel = "high"
    }else{
        volumeLevel = "low"
    }

    videoContainer.dataset.volumeLevel = volumeLevel
})


//view Modes
fullScreenbtn.addEventListener("click", toggleFullScreenMode)
miniPlayerbtn.addEventListener("click", toggleMiniPlayerMode)

function toggleFullScreenMode(){
    // videoContainer.classList.toggle("full-screen")
    if(document.fullscreenElement == null){
        videoContainer.requestFullscreen()
    }
    else{
        document.exitFullscreen()
    }
}
document.addEventListener("fullscreenchange", ()=>{
    videoContainer.classList.toggle("full-screen", document.fullscreenElement)
})


function toggleMiniPlayerMode() {
    if(videoContainer.classList.contains("mini-player")){
        document.exitPictureInPicture()
    }
    else{
        video.requestPictureInPicture()
    }
}
video.addEventListener("enterpictureinpicture", ()=>{
    videoContainer.classList.add("mini-player")
})
video.addEventListener("leavepictureinpicture", ()=>{
    videoContainer.classList.remove("mini-player")
})




function togglePlay() {
    video.paused ? video.play() : video.pause()
}

video.addEventListener("play", ()=>{
    videoContainer.classList.remove("paused")
})

video.addEventListener("pause", ()=>{
    videoContainer.classList.add("paused")
})