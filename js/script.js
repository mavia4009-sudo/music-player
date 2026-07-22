
let currentsong = new Audio();
let songs;
let currFolder;
function formatTime(seconds) {
    let minutes = Math.floor(seconds / 60);
    let secs = Math.floor(seconds % 60);

    let formattedMinutes = String(minutes).padStart(2, "0");
    let formattedSeconds = String(secs).padStart(2, "0");

    return `${formattedMinutes}:${formattedSeconds}`;
}

async function getsongs(folder) {

    currFolder = folder;

    let a = await fetch(`/${folder}/`);
    let response = await a.text();

    let div = document.createElement("div");
    div.innerHTML = response;

    let as = div.getElementsByTagName("a");

    songs = [];

    for (let i = 0; i < as.length; i++) {
        const element = as[i];

        if (element.href.includes(".mp3")) {
            songs.push(
                decodeURIComponent(
                    element.href
                        .split(`${folder}/`)[1]
                        .replace(".preview", "")
                )
            );
        }
    }





    let songUL = document.querySelector(".songlist").getElementsByTagName("ul")[0]
    songUL.innerHTML = ""
    for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML + `<li>
          
                      <img src="music.svg" alt="">
                    <div class="info">
                        <div> ${song}</div>
                        <div>Maviya</div>
                    </div>
                    <div class="playnow">
                        <span>Play Now</span>
                    <img src="play.svg" alt="">
                    </div>
                      
        
        </li>`;

    }
    Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {
            playMusic(
                e.querySelector(".info").firstElementChild.innerHTML.trim()
            )

        })

    });
    return songs



}
const playMusic = (track, pause = false) => {
   
    // let audio = new Audio( `/songs/${track}`);
    currentsong.src = `/${currFolder}/${track}`;
    if (!pause) {
        currentsong.play()
        play.src = "pause.svg"
    }
    document.querySelector(".songinfo").innerHTML = decodeURI(track)
    document.querySelector(".songtime").innerHTML = "00:00/00:00"




}
async function displayalbum() {
    let a = await fetch(`songs/`)
    let response = await a.text()
    let div = document.createElement("div")
    div.innerHTML = response;

    let ancores = div.getElementsByTagName("a")
    let cardcontainer = document.querySelector(".cardcontainer");

    let array = Array.from(ancores)
    for (let index = 0; index < array.length; index++) {
        const e = array[index];


        let link = e.getAttribute("href");

        if (link.includes("/songs/") && link !== "//songs/..//") {
            let folder = (link.split("/")[2]);

            let a = await fetch(`songs/${folder}/info.json`)
            let response = await a.json()
          
            cardcontainer.innerHTML += `<div data-folder="${folder}" class="card ">
                        <div class="imgbox">

                            <img src="songs/${folder}/cover.jpg" alt="">
                            <div class="cardplay">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                    fill="black">
                                    <path d="M8 5v14l11-7z" />
                                </svg>
                            </div>


                            <h2>${response.tittle}</h2>
                            <p>${response.description}</p>
                            
                        </div>

                    </div>`
        }
    };
    Array.from(document.getElementsByClassName("card")).forEach(e => {
        e.addEventListener("click", async item => {
            
            songs = await getsongs(`songs/${item.currentTarget.dataset.folder}`);
            playMusic(songs[0]);

        })

    })

}
displayalbum()


async function main() {



    songs = await getsongs("songs/ncs")
   

    // await getsongs("songs/ncs")
    playMusic(songs[0], true)



    play.addEventListener("click", () => {

        if (currentsong.paused) {
            currentsong.play()
            play.src = "pause.svg"
        }
        else {
            currentsong.pause()
            play.src = "play.svg"

        }
    })
    currentsong.addEventListener("timeupdate", () => {
        document.querySelector(".songtime").innerHTML = `${formatTime(currentsong.currentTime)}/${formatTime(currentsong.duration)}`
        document.querySelector(".circle").style.left = (currentsong.currentTime / currentsong.duration) * 100 + "%"

    })
    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100
        document.querySelector(".circle").style.left = percent + "%"
        currentsong.currentTime = ((currentsong.duration) * percent) / 100
    })
    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0"
    });
    document.querySelector(".close").addEventListener("click", () => {



        document.querySelector(".left").style.left = "-120%"


    })



    prevwies.addEventListener("click", () => {




        let currentSong = decodeURIComponent(currentsong.src.split("/").pop());
        let index = songs.indexOf(currentSong);

        if (index - 1 >= 0) {
            playMusic(songs[index - 1]);
        }
    })


    next.addEventListener("click", () => {
       

        let currentSong = decodeURIComponent(currentsong.src.split("/").pop());
        let index = songs.indexOf(currentSong);
        if (index + 1 < songs.length) {
            playMusic(songs[index + 1]);
        }
    });





   document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {

    let vol = parseInt(e.target.value) / 100;

    currentsong.volume = vol;

    if (e.target.value <= 10) {

        currentsong.muted = true;
        document.querySelector(".volume img").src = "mute.svg";

    } 
    else {

        currentsong.muted = false;
        document.querySelector(".volume img").src = "vloume.svg";

    }

});
    let isMuted = false;
    document.querySelector(".volume>img").addEventListener("click", e => {
        
        if (e.target.src.includes("vloume.svg")) {
            e.target.src = ("mute.svg")
            currentsong.volume = "0"
            isMuted = true;
            document.querySelector(".range").getElementsByTagName("input").value = 0
        }
        else {
            e.target.src = ("vloume.svg")
            
            currentsong.volume = "0.10"
            isMuted = false;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 0.10
        }
    })







}
main()




