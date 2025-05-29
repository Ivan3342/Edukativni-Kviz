const api = "https://apis.nervesys.com/api/1c456fbe-2ce3-472f-a421-9ccef2d93931";
const prikaziLeaderboardButton = document.getElementById("prikaziLeaderboardButton");
const zapocniKvizButton = document.getElementById("zapocniKvizButton");
const kvizWrapper = document.getElementById("kvizWrapper");

let pitanja = [];

const fetchPitanja = async () => {
    await fetch(api).then(responese => responese.json()).then(data => {
    data.questions.forEach(question => {
        pitanja.push({
            id: question.id,
            pitanje: question.question,
            odgovori: question.options,
            tacanOdgovor: question.correct_answer,
            objasnjenje: question.explanation
        });
    });
    console.log(pitanja);
})}

document.addEventListener("DOMContentLoaded", fetchPitanja)
