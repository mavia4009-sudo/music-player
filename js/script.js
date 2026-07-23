let currentsong = new Audio();
let songs = [];
let currFolder = "";
let currentSongIndex = 0;

function formatTime(seconds) {

    if (isNaN(seconds)) {
        return "00:00";
    }

    let minutes = Math.floor(seconds / 60);
    let secs = Math.floor(seconds % 60);

    let formattedMinutes = String(minutes).padStart(2, "0");
    let formattedSeconds = String(secs).padStart(2, "0");

    return `${formattedMinutes}:${formattedSeconds}`;
}


async function getsongs(folder) {

    currFolder = folder;

    let a = await fetch(`${folder}/info.json`);
    let response = await a.json();

    songs = response.songs || [];

    console.log("Folder:", currFolder);
    console.log("Songs:", songs);

    let songUL =
        document
            .querySelector(".songlist")
            .getElementsByTagName("ul")[0];

    songUL.innerHTML = "";

    for (const song of songs) {

        songUL.innerHTML += `<li>

            <img src="music.svg" alt="">

            <div class="info">
                <div>${song}</div>
                <div>Maviya</div>
            </div>

            <div class="playnow">
                <span>Play Now</span>
                <img src="play.svg" alt="">
            </div>

        </li>`;

    }


    Array.from(
        document
            .querySelector(".songlist")
            .getElementsByTagName("li")
    ).forEach((e, index) => {

        e.addEventListener("click", () => {

            currentSongIndex = index;

            playMusic(
                songs[currentSongIndex]
            );

        });

    });

    return songs;
}


function playMusic(track, pause = false) {

    if (!track) {
        return;
    }

   currentsong.src = `${currFolder}/${encodeURIComponent(track)}`;

    document
        .querySelector(".songinfo")
        .innerHTML = track;

    document
        .querySelector(".songtime")
        .innerHTML = "00:00/00:00";


    if (!pause) {

        currentsong.play();

        document
            .querySelector("#play")
            .src = "pause.svg";

    }

}


async function displayalbum() {

    let folders = [
        "ncs",
        "cs",
        "Karan aujal",
        "pal pal",
        "talha anjum",
        "English song",
        "majboor",
        "Love song",
        "fifa",
        "chill",
        "Afsos",
        "Angry mood",
       
        
    ];

    let cardcontainer =
        document.querySelector(".cardcontainer");

    cardcontainer.innerHTML = "";


    for (const folder of folders) {

        let a =
            await fetch(
                `songs/${folder}/info.json`
            );

        let response =
            await a.json();


        cardcontainer.innerHTML += `<div
            data-folder="${folder}"
            class="card"
        >

            <div class="imgbox">

                <img
                    src="songs/${folder}/cover.jpg"
                    alt=""
                >

                <div class="cardplay">

                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="black"
                    >

                        <path
                            d="M8 5v14l11-7z"
                        />

                    </svg>

                </div>

                <h2>${response.title}</h2>

                <p>${response.description}</p>

            </div>

        </div>`;

    }


    Array.from(
        document.getElementsByClassName("card")
    ).forEach(e => {

        e.addEventListener(
            "click",
            async item => {

                songs =
                    await getsongs(
                        `songs/${item.currentTarget.dataset.folder}`
                    );

                currentSongIndex = 0;

                if (songs.length > 0) {

                    playMusic(
                        songs[0]
                    );

                }

            }
        );

    });

}


async function main() {

    await displayalbum();


    songs =
        await getsongs(
            "songs/ncs"
        );


    if (songs.length > 0) {

        currentSongIndex = 0;

        playMusic(
            songs[0],
            true
        );

    }


    document
        .querySelector("#play")
        .addEventListener(
            "click",
            () => {

                if (currentsong.paused) {

                    currentsong.play();

                    document
                        .querySelector("#play")
                        .src = "pause.svg";

                }

                else {

                    currentsong.pause();

                    document
                        .querySelector("#play")
                        .src = "play.svg";

                }

            }
        );


    currentsong.addEventListener(
        "timeupdate",
        () => {

            document
                .querySelector(".songtime")
                .innerHTML =
                `${formatTime(currentsong.currentTime)}/${formatTime(currentsong.duration)}`;


            if (currentsong.duration) {

                document
                    .querySelector(".circle")
                    .style.left =
                    (currentsong.currentTime /
                    currentsong.duration) *
                    100 + "%";

            }

        }
    );


    document
        .querySelector(".seekbar")
        .addEventListener(
            "click",
            e => {

                let percent =
                    (e.offsetX /
                    e.target.getBoundingClientRect().width) *
                    100;


                document
                    .querySelector(".circle")
                    .style.left =
                    percent + "%";


                if (currentsong.duration) {

                    currentsong.currentTime =
                        currentsong.duration *
                        percent /
                        100;

                }

            }
        );


    document
        .querySelector(".hamburger")
        .addEventListener(
            "click",
            () => {

                document
                    .querySelector(".left")
                    .style.left = "0";

            }
        );


    document
        .querySelector(".close")
        .addEventListener(
            "click",
            () => {

                document
                    .querySelector(".left")
                    .style.left = "-120%";

            }
        );


    document
        .querySelector("#prevwies")
        .addEventListener(
            "click",
            () => {

                if (currentSongIndex > 0) {

                    currentSongIndex--;

                    playMusic(
                        songs[currentSongIndex]
                    );

                }

            }
        );


    document
        .querySelector("#next")
        .addEventListener(
            "click",
            () => {

                if (
                    currentSongIndex + 1 <
                    songs.length
                ) {

                    currentSongIndex++;

                    playMusic(
                        songs[currentSongIndex]
                    );

                }

            }
        );


    document
        .querySelector(".range")
        .getElementsByTagName("input")[0]
        .addEventListener(
            "input",
            e => {

                let vol =
                    parseInt(e.target.value) / 100;

                currentsong.volume = vol;

                if (vol <= 0.1) {

                    currentsong.muted = true;

                    document
                        .querySelector(".volume img")
                        .src = "mute.svg";

                }

                else {

                    currentsong.muted = false;

                    document
                        .querySelector(".volume img")
                        .src = "vloume.svg";

                }

            }
        );


    document
        .querySelector(".volume > img")
        .addEventListener(
            "click",
            e => {

                currentsong.muted =
                    !currentsong.muted;


                if (currentsong.muted) {

                    e.target.src =
                        "mute.svg";

                }

                else {

                    e.target.src =
                        "vloume.svg";

                }

            }
        );

}


main();