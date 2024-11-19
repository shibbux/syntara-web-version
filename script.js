let btn = document.querySelector("#btn");
let content = document.querySelector("#content");
let voice = document.querySelector("#voice");
let syt = document.querySelector("#syntara");

let toDoList = []; 

function speak(text) {
    let text_speak = new SpeechSynthesisUtterance(text);
    text_speak.rate = 1;
    text_speak.pitch = 1;
    text_speak.volume = 1;
    text_speak.lang = "en-GB";
    window.speechSynthesis.speak(text_speak);
    syt.innerText = text;
}

function wishMe() {
    let day = new Date();
    let hours = day.getHours();
    if (hours >= 0 && hours < 12) {
        speak("Good Morning Sir");
    } else if (hours >= 12 && hours < 16) {
        speak("Good afternoon Sir");
    } else {
        speak("Good Evening Sir");
    }
}

let speechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
let recognition = new speechRecognition();

recognition.onresult = (event) => {
    let currentIndex = event.resultIndex;
    let transcript = event.results[currentIndex][0].transcript;
    content.innerText = transcript;
    
    takeCommand(transcript.toLowerCase());
};

btn.addEventListener("click", () => {
    recognition.start();
    voice.style.display = "flex";
    btn.style.display = "none";
});

function manageToDo(message) {
    if (message.includes("add to my to-do list")) {
        const task = message.replace("add to my to-do list", "").trim();
        toDoList.push(task);
        speak(`Added ${task} to your to-do list.`);
    } else if (message.includes("show my to-do list")) {
        if (toDoList.length > 0) {
            speak(`Here is your to-do list: ${toDoList.join(", ")}`);
        } else {
            speak("Your to-do list is empty.");
        }
    }
}

async function getDefinition(word) {
    const url = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        if (data[0]) {
            const definition = data[0].meanings[0].definitions[0].definition;
            speak(`The definition of ${word} is: ${definition}`);
        } else {
            speak("I couldn't find the definition of that word.");
        }
    } catch (error) {
        speak("There was an error fetching the word's definition.");
    }
}

async function getWeather(city = "Haryana") {
    const apiKey = "a45b8f42edc9efe46a19537560bc7ee4"; // Replace with your OpenWeatherMap API key
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        if (data.cod === 200) {
            const weather = `The weather in ${data.name} is ${data.weather[0].description} with a temperature of ${data.main.temp}°C.`;
            speak(weather);
        } else {
            speak("Sorry, I couldn't find the weather for that location.");
        }
    } catch (error) {
        speak("There was an error fetching the weather data.");
    }
}
async function getNews() {
    const apiKey = "e02b16b0c00c40149897a035cde85ff9"; // Replace with your News API key
    const url = `https://newsapi.org/v2/top-headlines?country=us&apiKey=${apiKey}`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        const articles = data.articles.slice(0, 3);
        let news = "Here are the top headlines: ";
        articles.forEach((article, index) => {
            news += `Headline ${index + 1}: ${article.title}. `;
        });
        speak(news);
    } catch (error) {
        speak("I couldn't fetch the news at the moment.");
    }
}
async function tellJoke() {
    try {
        const response = await fetch("https://official-joke-api.appspot.com/random_joke");
        const data = await response.json();
        const joke = `${data.setup} ... ${data.punchline}`;
        speak(joke);
    } catch (error) {
        speak("I couldn't fetch a joke at the moment.");
    }
}
function changeBackgroundColor(color) {
    document.body.style.backgroundColor = color;
    speak(`Changing the background color to ${color}`);
}


async function convertCurrency(amount, fromCurrency, toCurrency) {
    const apiKey = "bfc101318085c5a4ebce7b7c"; // Replace with a currency conversion API key
    const url = `https://api.exchangerate-api.com/v4/latest/${fromCurrency}`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        if (data.rates[toCurrency]) {
            const conversion = (amount * data.rates[toCurrency]).toFixed(2);
            speak(`${amount} ${fromCurrency} is equal to ${conversion} ${toCurrency}.`);
        } else {
            speak("I couldn't find the conversion rate for that currency.");
        }
    } catch (error) {
        speak("There was an error with the currency conversion.");
    }
}

function solveMath(expression) {
    try {
        const result = eval(expression);
        speak(`The result of ${expression} is ${result}`);
    } catch (error) {
        speak("I couldn't solve that math problem.");
    }
}

async function searchWikipedia(query) {
    const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${query}`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        if (data.extract) {
            speak(`According to Wikipedia, ${data.extract}`);
        } else {
            speak("I couldn't find information on that topic.");
        }
    } catch (error) {
        speak("There was an error fetching information from Wikipedia.");
    }
}

function takeCommand(message) {
    voice.style.display = "none";
    btn.style.display = "flex";

    if (message.includes("hello") || message.includes("hey")) {
        speak("Hello sir, I am Syntara. What can I help you with?");
    } else if (message.includes("who are you")) {
        speak("I am Syntara, your virtual assistant, created by Shivam Kumar and Shubham Karna.");
    } else if (message.includes("time")) {
        let time = new Date().toLocaleString(undefined, { hour: "numeric", minute: "numeric" });
        speak(`The time is ${time}`);
    } else if (message.includes("date")) {
        let date = new Date().toLocaleString(undefined, { day: "numeric", month: "short" });
        speak(`Today's date is ${date}`);
    } else if (message.includes("weather")) {
        const city = message.replace("weather in", "").trim() || "Haryana";
        getWeather(city);
    } else if (message.includes("news")) {
        speak("Fetching the latest news for you...");
        getNews();
    } else if (message.includes("joke")) {
        tellJoke();
    } else if (message.includes("add to my to-do list") || message.includes("show my to-do list")) {
        manageToDo(message);
    } else if (message.includes("what does") && message.includes("mean")) {
        const word = message.replace("what does", "").replace("mean", "").trim();
        getDefinition(word);
    } else if (message.includes("convert")) {
        const words = message.split(" ");
        const amount = parseFloat(words[1]);
        const fromCurrency = words[2].toUpperCase();
        const toCurrency = words[4].toUpperCase();
        convertCurrency(amount, fromCurrency, toCurrency);
    } else if (message.includes("calculate")) {
        const expression = message.replace("calculate", "").trim();
        solveMath(expression);
    } else if (message.includes("search Wikipedia for")) {
        const query = message.replace("search Wikipedia for", "").trim();
        searchWikipedia(query);
    } else {
        let finalText = "This is what I found on the internet regarding " + message.replace("syntara", "");
        speak(finalText);
        window.open(`https://www.google.com/search?q=${message.replace("syntara", "")}`, "_blank");
    }
}
