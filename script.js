 const form = document.getElementById("form");
    const input = document.getElementById("input");
    const button = document.getElementById("ask");
    const answer = document.getElementById("answer");
    const voiceBtn = document.getElementById("voice");
    const result = document.createElement('p');
   
    function generateThought(){
        const apiUrl = "https://dummyjson.com/quotes/random"
        fetch(apiUrl)
        .then((resolve) => {
            return resolve.json();
        })
        .then((data) => {
            return data.quote;
        })
        .then((quote) => {
           function response() {
          result.innerHTML = `${quote}`
          answer.appendChild(result);
          speakResponse(quote);
           }
           setTimeout(response,5000);
        })
        .catch((error) => {
        const message = " An error ocuured while generating your thought, please try again";
        console.log(error, message);
        speakResponse(message)
        })
    }
    function getWeather(city){
    const apiKey = `0c5ae8c6484ac3cc93a02260b8721fbb`;
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric
`;
        let temperature;
        let humidity;
        let pressure;
        let weatherDetails;
        fetch(url)
        .then( (resolve) => {
            return resolve.json();
        } )
        .then( (data) => {
            if (data.cod == 404){
                function cityNot(){
                    const cityNotFound = "City not found, please specify a city. For example, 'Weather in Delhi."
                    result.innerHTML = cityNotFound;
                    answer.appendChild(result);
                    speakResponse(cityNotFound);
                }
                setTimeout(cityNot, 5000);
            }
            if (data.cod !== 200) {
                throw new Error(data.message || "City not found!");
            }
           temperature = data.main.temp;
           humidity = data.main.humidity;
           pressure = data.main.pressure;
           weatherDetails = function(){
            const newMessage = `The Temperature in ${city} is ${temperature}°C and humidity is ${humidity}% with the pressure of ${pressure} hpa.`;
            result.innerHTML = newMessage;
            answer.appendChild(result);
            speakResponse(newMessage);
           }
           setTimeout(weatherDetails, 5000);
        } )
        .catch((error) => {
          const message = `An error occured while fetching weather details`;
          console.log(error, message);
        })
    }

    function getJoke(){
        const jApiUrl = ` https://official-joke-api.appspot.com/jokes/random`;
        fetch(jApiUrl)
             .then((resolve) => {
                return resolve.json();
             } )
             .then((data) => {
                const JokeSetup = data.setup;
                const JokePunchline = data.punchline;
                const userMSg = `Your joke is getting ready. hold your belts for a bit.`
                speakResponse(userMSg);
               function yourJoke(){
                const joke = `${JokeSetup} ${JokePunchline}`;
                result.innerHTML = joke;
                answer.appendChild(result);
                speakResponse(joke);
               }
               setTimeout(yourJoke, 5000);
             } )
            .catch( (error) => {
               console.log(error);
           })
    }

  function speakResponse(userInput){
     const speech = new SpeechSynthesisUtterance(userInput);
     speech.lang = "en-US";
     window.speechSynthesis.speak(speech);
  }

  voiceBtn.addEventListener("click", (event)=>{
    if (!window.SpeechRecognition && !window.webkitSpeechRecognition) {
        alert("Your browser didn't support speech recognition, Sorry!");
        return;
    }

     const recognition = new(window.SpeechRecognition || window.webkitSpeechRecognition)();
     recognition.lang = "en-US";
     recognition.start();

     recognition.addEventListener("result", (event) => {
       const transcript = event.results[0][0].transcript;
       input.value = transcript;
       const response = getResponse(transcript.toLowerCase());
       result.innerHTML = response;
       answer.appendChild(result);
       speakResponse(response);
       input.value = "";
     })
  })

    function getResponse(userInput){
        let response = "";
        if (userInput.includes("hello")){
            response = "Hello! How can I assist you?";
        }
        else if (userInput.includes("time")){
            response = `The Current time is ${new Date().toLocaleTimeString()} `
        }
        else if (userInput.includes("joke")){
            getJoke();
        }
        else if (userInput.includes("name")) {
            response = "Hello! My Name is Raghvi";
        }
        else if (userInput.includes("founded")) {
            response = "I am Raghvi, an AI assistant brought to life by none other than Vishal Singh Kushwaha, a passionate programmer, researcher, and web developer. He is not just my creator but also my mentor, constantly improving my capabilities and expanding my knowledge.";
            function message(){
                const founderMsg = "Do you want to know more about him ? If yes, then ask me tell me more about your father";
                result.innerHTML = `${founderMsg}`;
                answer.appendChild(result);
                speakResponse(founderMsg);
            }
            setTimeout(message, 18000);
        }
        else if (userInput.includes("tell me more about your father")) {
            function reply() {
                const replyMSg = `   
Vishal Singh Kushwaha is an 18-year-old tech enthusiast pursuing a Bachelor of Computer Applications (BCA). His expertise spans multiple programming languages, including C, JavaScript, Java, and SQL, and he has a keen interest in data structures, algorithms, web development, and artificial intelligence.
Unlike many of his peers, Vishal finds programming easy because of his strong foundations. He has a logical and structured approach to problem-solving, making him an excellent programmer.`
              result.innerHTML = `${replyMSg}`
              answer.appendChild(result);
              speakResponse(replyMSg);
            }
            setTimeout(reply, 4000);
        }
        else if (userInput.includes("how are you")) {
            response = "I'm fine, how about you?";
        }
        else if (userInput.includes("weather")) {
                const match = userInput.match(/weather in (.+?)[.?!]?$/i); // returns a array
                console.log(match);
                console.log(match[1]);
                getWeather(match[1]);
                const message = "Fetching weather details. please wait.";
                speakResponse(message);
                result.innerHTML = message;
                answer.appendChild(result);
            if(match == null){
                response = "Unable to fetch Weather details, No match found";
            }
        }
        else if(userInput.includes("thought")){
             const message = "Generating your thought, please wait";
             speakResponse(message);
             generateThought();
        }
        else if(userInput.includes("thank you")){
            const message = "It was my pleasure.";
            speakResponse(message);
            result.innerText = message;
            answer.appendChild(result);
        }
        else{
            response = "Sorry Currently I'm on a Development Phase! I didn't Understand Many Terms";
        }
        return response;
    }
    form.addEventListener("submit", (event) => {
        event.preventDefault();
        const userInput = input.value.toLowerCase();
        const response = getResponse(userInput);
        result.innerHTML = response;
        answer.appendChild(result);
        input.value = "";
        // answer.removeChild(result);
    })
