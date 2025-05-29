//promenljive

const api = "https://apis.nervesys.com/api/1c456fbe-2ce3-472f-a421-9ccef2d93931";
const prikaziLeaderboardButton = document.getElementById("prikaziLeaderboardButton");
const zapocniKvizButton = document.getElementById("zapocniKvizButton");
const kvizWrapper = document.getElementById("kvizWrapper");
const dugmeWrapper = document.getElementById("dugmeWrapper");
let pitanja = [];

//funkcije

// Funkcija za prikaz pitanja u nasumičnom redosledu

let trenutniIndex = 0;
let nasumicnaPitanja = [];
let brojTacnih = 0;

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
            <button id="sledecePitanjeButton">Preskoci pitanje</button>
        </div>
    `;

    const odgovoriLista = kvizWrapper.querySelectorAll("li");
    odgovoriLista.forEach(li => {
        li.addEventListener("click", () => {
            if (li.textContent === pitanje.tacanOdgovor) {
                li.classList.add("tacan");
                brojTacnih++;
                setTimeout(() => {
                    trenutniIndex++;
                    if (trenutniIndex < nasumicnaPitanja.length) {
                        prikaziPitanje(nasumicnaPitanja[trenutniIndex]);
                    } else {
                        kvizWrapper.innerHTML = `<h2>Kviz je završen! Broj tacnih: ${brojTacnih}</h2>`;
                    }
                }, 1000);
            } else {
                li.classList.add("netacan");
            }
        });
    });

    const sledecePitanjeButton = kvizWrapper.querySelector("#sledecePitanjeButton");
    sledecePitanjeButton.addEventListener("click", () => {
        trenutniIndex++;
        if (trenutniIndex < nasumicnaPitanja.length) {
            prikaziPitanje(nasumicnaPitanja[trenutniIndex]);
        } else {
            kvizWrapper.innerHTML = `<h2>Kviz je završen! Broj tacnih: ${brojTacnih}</h2>`;
        }
    });
}


// Izmeni fetchPitanja da izmeša pitanja pre prikaza
const fetchPitanja = async () => {
    await fetch(api).then(responese => responese.json()).then(data => {
        pitanja = data.questions.map(question => ({
            id: question.id,
            pitanje: question.question,
            odgovori: question.options,
            tacanOdgovor: question.correct_answer,
            objasnjenje: question.explanation
        }));
        // Izmešaj pitanja
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

document.addEventListener("DOMContentLoaded", fetchPitanja)

zapocniKvizButton.addEventListener("click", () => {
    dugmeWrapper.classList.toggle("hidden");
});



