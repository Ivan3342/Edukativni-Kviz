//promenljive

const api = "https://apis.nervesys.com/api/1c456fbe-2ce3-472f-a421-9ccef2d93931";
const prikaziLeaderboardButton = document.getElementById("prikaziLeaderboardButton");
const zapocniKvizButton = document.getElementById("zapocniKvizButton");
const kvizWrapper = document.getElementById("kvizWrapper");
const dugmeWrapper = document.getElementById("dugmeWrapper");
const unosPobednika = document.getElementById("unosPobednika");
let pitanja = [];
let scores = JSON.parse(localStorage.getItem("scores")) || [];

//funkcije

let trenutniIndex = 0;
let nasumicnaPitanja = [];
let brojTacnih = 0;
let timerId = null;

unosPobednika.addEventListener("submit", async (e) => {
    e.preventDefault();
    await unesiPobednika();
    unosPobednika.classList.toggle("hidden");
    document.getElementById("pobednikIme").value = "";
});

const unesiPobednika = async () => {
    const imePobednika = document.getElementById("pobednikIme").value;
    const scorePobednika = brojTacnih;
    const score = {
        name: imePobednika,
        score: scorePobednika
    };
    scores.push(score);
    scores.sort((a, b) => b.score - a.score);
    localStorage.setItem("scores", JSON.stringify(scores));
}

const prikaziPitanje = (pitanje) => {
    const odgovori = [...pitanje.odgovori];
    for (let i = odgovori.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [odgovori[i], odgovori[j]] = [odgovori[j], odgovori[i]];
    }

    kvizWrapper.innerHTML = `
        <div class="pitanje">
            <h2>${pitanje.pitanje}</h2>
            <ul>
                ${odgovori.map((odgovor, index) => `<li class="odgovor" data-index="${index}">${odgovor}</li>`).join('')}
            </ul>
            <div id="progressBar" class="progress"></div>
            <button id="sledecePitanjeButton">Preskoci pitanje</button>
        </div>
    `;

    let timeLeft = 30;
    const progressBar = kvizWrapper.querySelector("#progressBar");
    progressBar.style.width = "100%";

    const updateProgressBar = () => {
        timeLeft--;
        progressBar.style.width = (timeLeft / 30 * 100) + "%";
        if (timeLeft <= 0) {
            clearInterval(timerId);
            timerId = null;
            trenutniIndex++;
            if (trenutniIndex < nasumicnaPitanja.length) {
                prikaziPitanje(nasumicnaPitanja[trenutniIndex]);
            } else {
                kvizWrapper.innerHTML = `<h2>Kviz je završen! Broj tacnih: ${brojTacnih}/${pitanja.length}</h2>`;
                unosPobednika.classList.toggle("hidden");
            }
        }
    };

    timerId = setInterval(updateProgressBar, 1000);

    const clearTimerAndNext = (callback) => {
        if (timerId) {
            clearInterval(timerId);
            timerId = null;
        }
        setTimeout(callback, 1000);
    };

    const odgovoriLista = kvizWrapper.querySelectorAll("li");
    odgovoriLista.forEach(li => {
        li.addEventListener("click", () => {
            if (timerId) {
                clearInterval(timerId);
                timerId = null;
            }
            if (li.textContent === pitanje.tacanOdgovor) {
                li.classList.add("tacan");
                brojTacnih++;
                setTimeout(() => {
                    trenutniIndex++;
                    if (trenutniIndex < nasumicnaPitanja.length) {
                        prikaziPitanje(nasumicnaPitanja[trenutniIndex]);
                    } else {
                        kvizWrapper.innerHTML = `<h2>Kviz je završen! Broj tacnih: ${brojTacnih}/${pitanja.length}</h2>`;
                        unosPobednika.classList.toggle("hidden");
                    }
                }, 1000);
            } else {
                li.classList.add("netacan");
                setTimeout(() => {
                    trenutniIndex++;
                    if (trenutniIndex < nasumicnaPitanja.length) {
                        prikaziPitanje(nasumicnaPitanja[trenutniIndex]);
                    } else {
                        kvizWrapper.innerHTML = `<h2>Kviz je završen! Broj tacnih: ${brojTacnih}/${pitanja.length}</h2>`;
                        unosPobednika.classList.toggle("hidden");
                    }
                }, 1000);
            }
        });
    });

    const sledecePitanjeButton = kvizWrapper.querySelector("#sledecePitanjeButton");
    sledecePitanjeButton.addEventListener("click", () => {
        if (timerId) {
            clearInterval(timerId);
            timerId = null;
        }
        trenutniIndex++;
        if (trenutniIndex < nasumicnaPitanja.length) {
            prikaziPitanje(nasumicnaPitanja[trenutniIndex]);
        } else {
            kvizWrapper.innerHTML = `<h2>Kviz je završen! Broj tacnih: ${brojTacnih}/${pitanja.length}</h2>`;
            document.getElementById("unosPobednika").classList.remove("hidden");
        }
    });
}

const fetchPitanja = async () => {
    await fetch(api).then(responese => responese.json()).then(data => {
        pitanja = data.questions.map(question => ({
            id: question.id,
            pitanje: question.question,
            odgovori: question.options,
            tacanOdgovor: question.correct_answer,
            objasnjenje: question.explanation
        }));
        nasumicnaPitanja = [...pitanja];
        for (let i = nasumicnaPitanja.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [nasumicnaPitanja[i], nasumicnaPitanja[j]] = [nasumicnaPitanja[j], nasumicnaPitanja[i]];
        }
        trenutniIndex = 0;
        prikaziPitanje(nasumicnaPitanja[trenutniIndex]);
    })
}

//dogadjaji

zapocniKvizButton.addEventListener("click", () => {
    dugmeWrapper.classList.toggle("hidden");
    fetchPitanja();
});

prikaziLeaderboardButton.addEventListener("click", () => {
    document.getElementById("leaderboard").classList.toggle("hidden");
    
    document.getElementById("scores").innerHTML = scores.map(score => `<li>${score.name}: ${score.score}</li>`).join('');
    if (scores.length === 0) {
        document.getElementById("scores").innerHTML = "<li>Nema rezultata</li>";
    }
});

document.getElementById("closeLeaderboardButton").addEventListener("click", () => {
    document.getElementById("leaderboard").classList.toggle("hidden");
});
