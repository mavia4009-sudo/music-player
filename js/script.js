let currentsong = new Audio();
let songs = [];
let currFolder = "";


// ==============================
// FORMAT TIME
// ==============================

function formatTime(seconds) {

    if (isNaN(seconds)) {
        return "00:00";
    }

    let minutes = Math.floor(seconds / 60);
    let secs = Math.floor(seconds % 60);

    return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}


// ==============================
// GET SONGS FROM info.json
// ==============================

async function getsongs(folder) {

    currFolder = folder;

    let response = await fetch(`${folder}/info.json`);
    let data = await response.json();

    songs = data.songs || [];

    console.log("Folder:", folder);
    console.log("Songs:", songs);


    let songUL = document
        .querySelector(".songlist")
        .getElementsByTagName("ul")[0];

    songUL.innerHTML = "";


    // SHOW SONGS

    for (const song of songs) {

        songUL.innerHTML += `
            <li>

                <img src="music.svg" alt="">

                <div class="info">
                    <div>${song}</div>
                    <div>Maviya</div>
                </div>

                <div class="playnow">
                    <span>Play Now</span>
                    <img src="play.svg" alt="">
                </div>

            </li>
        `;
    }


    // SONG CLICK

    Array.from(
        document
            .querySelector(".songlist")
            .getElementsByTagName("li")
    ).forEach((element, index) => {

        element.addEventListener("click", () => {

            playMusic(songs[index]);

        });

    });

    return songs;
}


// ==============================
// PLAY MUSIC
// ==============================

function playMusic(track, pause = false) {

    if (!track) return;

    currentsong.src =
        `${currFolder}/${encodeURIComponent(track)}`;

    console.log("Playing:", currentsong.src);

    if (!pause) {
        currentsong.play().catch(error => {
            console.error("Song play error:", error);
        });

        document.querySelector("#play").src = "pause.svg";
    }

    document.querySelector(".songinfo").innerHTML = track;
    document.querySelector(".songtime").innerHTML = "00:00/00:00";
}


// ==============================
// DISPLAY ALBUMS
// ==============================

async function displayalbum() {

    let cardcontainer =
        document.querySelector(".cardcontainer");

    cardcontainer.innerHTML = "";


    // EXACT FOLDER NAMES

    let folders = [
    "ncs",
    "cs",
    "karan aujal",
    "pal pal",
    "talha anjum",
    "English song",
    "majboor",
    "Love song",
    "fifa",
    "chill",
    "Afsos",
    "Angry mood"
];


    // LOAD CARDS

    for (const folder of folders) {

        try {

            let response =
                await fetch(
                    `songs/${folder}/info.json`
                );


            if (!response.ok) {

                console.error(
                    "info.json not found:",
                    folder
                );

                continue;

            }


            let info =
                await response.json();


            cardcontainer.innerHTML += `

                <div
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

                        <h2>
                            ${info.title}
                        </h2>

                        <p>
                            ${info.description}
                        </p>

                    </div>

                </div>

            `;

        } catch (error) {

            console.error(
                "Error loading:",
                folder,
                error
            );

        }

    }


    // ==============================
    // CARD CLICK
    // ==============================

    Array.from(
        document.getElementsByClassName("card")
    ).forEach(card => {

        card.addEventListener(
            "click",
            async () => {

                let folder =
                    card.dataset.folder;


                songs =
                    await getsongs(
                        `songs/${folder}`
                    );


                if (songs.length > 0) {

                    playMusic(
                        songs[0]
                    );

                }

            }
        );

    });

}


// ==============================
// MAIN
// ==============================

async function main() {


    // DISPLAY CARDS

    await displayalbum();


    // DEFAULT SONGS

    songs =
        await getsongs(
            "songs/ncs"
        );


    if (songs.length > 0) {

        playMusic(
            songs[0],
            true
        );

    }


    // ==============================
    // PLAY / PAUSE
    // ==============================

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

                } else {

                    currentsong.pause();

                    document
                        .querySelector("#play")
                        .src = "play.svg";

                }

            }
        );


    // ==============================
    // TIME UPDATE
    // ==============================

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


    // ==============================
    // SEEK BAR
    // ==============================

    document
        .querySelector(".seekbar")
        .addEventListener(
            "click",
            e => {

                let percent =
                    (e.offsetX /
                        e.target.getBoundingClientRect()
                            .width) *
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


    // ==============================
    // HAMBURGER
    // ==============================

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


    // ==============================
    // CLOSE
    // ==============================

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


    // ==============================
    // PREVIOUS
    // ==============================

    document
        .querySelector("#prevwies")
        .addEventListener(
            "click",
            () => {

                let currentSong =
                    decodeURIComponent(
                        currentsong.src
                            .split("/")
                            .pop()
                    );


                let index =
                    songs.indexOf(
                        currentSong
                    );


                if (index > 0) {

                    playMusic(
                        songs[index - 1]
                    );

                }

            }
        );


    // ==============================
    // NEXT
    // ==============================

    document
        .querySelector("#next")
        .addEventListener(
            "click",
            () => {

                let currentSong =
                    decodeURIComponent(
                        currentsong.src
                            .split("/")
                            .pop()
                    );


                let index =
                    songs.indexOf(
                        currentSong
                    );


                if (
                    index + 1 <
                    songs.length
                ) {

                    playMusic(
                        songs[index + 1]
                    );

                }

            }
        );


    // ==============================
    // VOLUME
    // ==============================

    document
        .querySelector(".range input")
        .addEventListener(
            "input",
            e => {

                let vol =
                    Number(e.target.value) /
                    100;


                currentsong.volume =
                    vol;


                if (vol <= 0.1) {

                    currentsong.muted = true;

                    document
                        .querySelector(".volume img")
                        .src = "mute.svg";

                } else {

                    currentsong.muted = false;

                    document
                        .querySelector(".volume img")
                        .src = "vloume.svg";

                }

            }
        );


    // ==============================
    // MUTE
    // ==============================

    document
        .querySelector(".volume > img")
        .addEventListener(
            "click",
            e => {

                if (currentsong.muted) {

                    currentsong.muted =
                        false;

                    e.target.src =
                        "vloume.svg";

                } else {

                    currentsong.muted =
                        true;

                    e.target.src =
                        "mute.svg";

                }

            }
        );

}


// ==============================
// START
// ==============================

main();