const audio = document.getElementById('audio');
const playBtn = document.getElementById('play');
const progress = document.getElementById('progress');
const progressContainer = document.querySelector('.progress-container');
const volumeSlider = document.getElementById('volume');
const title = document.getElementById('title');
const artist = document.getElementById('artist');
const coverImg = document.getElementById('cover-img');
const playlistEl = document.getElementById('playlist');

let songs = [];
let currentSong = 0;

// Fetch playlist from server
fetch('/api/songs')
    .then(res => res.json())
    .then(data => {
        songs = data;
        buildPlaylist();
        loadSong(currentSong);
    });

function buildPlaylist() {
    playlistEl.innerHTML = '';
    songs.forEach((song,index)=>{
        const li = document.createElement('li');
        li.textContent = `${song.title} - ${song.artist}`;
        li.addEventListener('click',()=>{currentSong=index;loadSong(currentSong);playSong();});
        playlistEl.appendChild(li);
    });
}

function loadSong(index){
    const song = songs[index];
    audio.src = song.src;
    title.textContent = song.title;
    artist.textContent = song.artist;
    coverImg.src = song.cover;
}

function playSong(){ audio.play(); playBtn.textContent='⏸️'; }
function pauseSong(){ audio.pause(); playBtn.textContent='▶️'; }

playBtn.addEventListener('click',()=>{ audio.paused ? playSong() : pauseSong(); });

document.getElementById('next').addEventListener('click',()=>{
    currentSong = (currentSong+1)%songs.length;
    loadSong(currentSong); playSong();
});

document.getElementById('prev').addEventListener('click',()=>{
    currentSong = (currentSong-1+songs.length)%songs.length;
    loadSong(currentSong); playSong();
});

audio.addEventListener('timeupdate',()=>{
    const percent = (audio.currentTime/audio.duration)*100;
    progress.style.width=`${percent}%`;
});

progressContainer.addEventListener('click',(e)=>{
    const width = progressContainer.clientWidth;
    audio.currentTime=(e.offsetX/width)*audio.duration;
});

volumeSlider.addEventListener('input',()=>{ audio.volume=volumeSlider.value; });

audio.addEventListener('ended',()=>{
    currentSong=(currentSong+1)%songs.length;
    loadSong(currentSong); playSong();
});

volumeSlider.value = 0.5;
audio.volume = 0.5;
