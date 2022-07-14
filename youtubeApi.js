const videoChannel = document.querySelector('#video-channel');
const videoContainer = document.querySelector('#video-container');

const apiKey = 'AIzaSyBCIkJBLEhT9eGipac7LWUqm7eanRVrO2I';
const channelId = 'UCD2YO_A_PVMgMDN9jpRrpVA'; //랄로
const channelEndpoint1 = `https://www.googleapis.com/youtube/v3/channels?key=${apiKey}&id=${channelId}&part=snippet,contentDetails,statistics`;

fetch(channelEndpoint1)
    .then(res => res.json())
    .then(data => {
        console.log(data)
        showChannel(data);
        const playlistId = data.items[0].contentDetails.relatedPlaylists.uploads;
        requestPlaylist(playlistId);
    });

function showChannel(data){
    const imageLink = data.items[0].snippet.thumbnails.medium.url;
    const title = data.items[0].snippet.title;
    const descriptions = data.items[0].snippet.descriptions;
    const videos = data.items[0].statistics.videoCount;
    const subscribers = data.items[0].statistics.subscriberCount;
    const views = data.items[0].statistics.viewCount;
    let output = `
        <div class="col-md-6 mb-4 text-center">
            <img class="img-fluid" src="${imageLink}">
        </div>
        <div class="col-md-6 mb-4">
            <ul>
                <li class="list-group-item bg-danger text-white"><strong>채널명: ${title}</strong></li>
                <li class="list-group-item">채널 소개: ${descriptions}</li>
                <li class="list-group-item">영상 개수: ${numberWithCommas(videos)}</li>
                <li class="list-group-item">구독자 수: ${numberWithCommas(subscribers)}</li>
                <li class="list-group-item">시청 횟수: ${numberWithCommas(views)}</li>
            </ul>
        </div>
    `;
    videoChannel.innerHTML = output;
}

function requestPlaylist(playlistId){
    const maxResults = 12;
    const playlisURL = `https://www.googleapis.com/youtube/v3/playlistItems?key=${apiKey}&playlistId=${playlistId}&part=snippet&maxResults=${maxResults}`;

    fetch(playlisURL)
        .then(res => res.json())
        .then(data => {
            console.log(data);
            loadVideo(data);
        });
}

function loadVideo(data){
    const playListItems = data.items;

    if(playListItems){
        let output = '';
        playListItems.map(item => {
            const videoId = item.snippet.resourceId.videoId;
            output += `
            <div class="col-lg-4 col-md-6 mb-4">
            <div class="card card-body p-0 shadow embed-responsive embed-responsive-16by9">
                <iframe height="auto" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
            </div>
        </div>
            `;

        });

        videoContainer.innerHTML = output;

    } else{
        videoContainer.innerHTML = 'Sorry, No video';
    }
}

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

