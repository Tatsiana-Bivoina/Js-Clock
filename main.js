import {playList} from './playList.js';
const dateBlock = document.querySelector('.date');
const locationBlock = document.querySelector('.location');
let currentDate = null;
let seconds = '';
let minutes = '';
let hours = '';
let date = '';
let time = '';

// Clock
let timerId = setTimeout(function tick() {
  currentDate = new Date();
  let options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  date = currentDate.toLocaleDateString('ru-RU', options);
  time = currentDate.toLocaleTimeString('ru-RU', { hour12: false });
  createDate();
  setClock();
  timerId = setTimeout(tick, 1000);
}, 1000);

const createDate = () => {
  if(document.querySelector('p')) {
    document.querySelector('p').remove();
    let p = document.createElement('p');
    p.innerHTML = `${time} ${date}`;
    dateBlock.appendChild(p);
  } else {
    let p = document.createElement('p');
    p.innerHTML = `${time} ${date}`;
    dateBlock.appendChild(p);
  }
}

const setClock = () => {
  let hourHand = document.querySelector('.hour-hand');
  let minutesHand = document.querySelector('.min-hand');
  let secondsHand = document.querySelector('.second-hand');
  seconds = currentDate.getSeconds();
  minutes = currentDate.getMinutes();
  hours = currentDate.getHours();
  if(hours.toString() == '00') {
    hourHand.setAttribute('style', 'transform: rotate(90 deg)');
  } else {
    hourHand.setAttribute('style', `transform: rotate(${(hours * 60 + minutes)*0.5 + 90}deg)`);
  }

  if(minutes < 60) {
    minutesHand.setAttribute('style', `transform: rotate(${minutes*6 + 90}deg)`);
  } else minutesHand.setAttribute('style', 'transform: rotate(90 deg)');

  if(seconds < 60) {
    secondsHand.setAttribute('style', `transform: rotate(${seconds*6 + 90}deg)`);
  } else secondsHand.setAttribute('style', 'transform: rotate(90 deg)');
}

// Weather widget
const inputCity = document.querySelector('#input-city');
const weatherIcon = document.querySelector('.weather-icon');
const temperature = document.querySelector('.temperature');
const weatherDescription = document.querySelector('.weather-description');
const windSpeed = document.querySelector('.wind-speed');
const humidity = document.querySelector('.humidity');
let currentLocation = '';

const getCity = () => {
  const inputCity = document.querySelector('#input-city');
  inputCity.setAttribute('value', localStorage.getItem('city'));
  
  if(localStorage.hasOwnProperty('city') === false) {
    localStorage.setItem('city', 'Минск');
    inputCity.setAttribute('value', 'Минск');
    currentLocation = localStorage.getItem('city');
  } else if(localStorage.getItem('city') != inputCity.value) {
    localStorage.setItem('city', inputCity.value);
    inputCity.setAttribute('value', inputCity.value);
    currentLocation = localStorage.getItem('city');
  } else {
    localStorage.setItem('city', inputCity.value);
    inputCity.setAttribute('value', inputCity.value);
    currentLocation = localStorage.getItem('city');
  }
}

async function getWeather() {  
  getCity();
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${currentLocation}&lang=ru&appid=27e5db49ec1318a15709b132fbf036e2&units=metric`;
  const res = await fetch(url);
  await res.json().then((data) => {
    weatherIcon.className = 'weather-icon owf';
    weatherIcon.classList.add(`owf-${data.weather[0].id}`);
    temperature.textContent = `${Math.round(data.main.temp)}°C`;
    weatherDescription.textContent = data.weather[0].description;
    windSpeed.textContent = `Скорость ветра: ${Math.round(data.wind.speed)}м/с`;
    humidity.textContent = `Влажность воздуха: ${data.main.humidity}%`;
  }).catch(err => {
    let p = document.createElement('p');
    p.className = 'error-message';
    p.innerText = 'Введите корректное название города';
    inputCity.before(p);
    setTimeout(() => p.remove(), 3000);
    weatherIcon.className = 'weather-icon owf';
    temperature.textContent = '';
    weatherDescription.textContent = '';
    windSpeed.textContent = '';
    humidity.textContent = '';
  });
}
getWeather();

inputCity.addEventListener('change', getWeather);

// Audio Player
const btnPlay = document.querySelector('.play');
const btnPrev = document.querySelector('.play-prev');
const btnNext = document.querySelector('.play-next');
const playItems = document.querySelectorAll('.play-item');
let isPlay = false;
let playNum = 0;
const audio = new Audio();

function playAudio() {
  audio.src = playList[playNum].src;
  audio.currentTime = 0;
  audio.play();
}

function toggleBtn() {
  if(!isPlay) {
    btnPlay.classList.toggle('pause');
    playAudio();
    isPlay = true;
  } else {
    btnPlay.classList.toggle('pause');
    audio.pause();
    isPlay = false;
  }
}

function playNext() {
  playItems[playNum].classList.remove('item-active');
  playNum++;
  if(playNum == playList.length) {
    playNum = 0;
  }
  playItems[playNum].classList.add('item-active');
  btnPlay.classList.add('pause');
  isPlay = true;
  playAudio();
}

function playPrev() {
  playItems[playNum].classList.remove('item-active');
  playNum--;
  if(playNum < 0) {
    playNum = playList.length-1;
  }
  playItems[playNum].classList.add('item-active');
  btnPlay.classList.add('pause');
  isPlay = true;
  playAudio();
}


btnPlay.addEventListener('click', toggleBtn);
btnPrev.addEventListener('click', playPrev);
btnNext.addEventListener('click', playNext);
audio.addEventListener('ended', () => {
  playItems[playNum].classList.remove('item-active');
  playNum++;
  if(playNum == playList.length) {
    playNum = 0;
  }
  playItems[playNum].classList.add('item-active');
  audio.src = playList[playNum].src;
  audio.play();
});

// Time to rest
const btnRelax = document.querySelector('.button-relax');
const coverElem = document.querySelector('.cover');
const relaxSection = document.querySelector('.relax-section');
const closeIcon = document.querySelector('.close-icon');
const seaSounds = new Audio('./assets/audio/sea-sounds.mp3');
const tryAgain = document.querySelector('.try-again');
const timer = document.querySelector('.timer')
let secondsRemaining = 120;

btnRelax.addEventListener('click', () => {
  document.body.classList.add('lock');
  coverElem.classList.remove('hidden');
  relaxSection.classList.remove('hidden');
  relaxSection.addEventListener('mousemove', reset);
  seaSounds.play();
  displayTime();
  startTimer();
  setTimeout(setOpacity, 1500);
})

const closeRelaxContainer = () => {
  secondsRemaining = 120;
  coverElem.removeEventListener('click', closeRelaxContainer);
  closeIcon.removeEventListener('click', closeRelaxContainer);
  document.body.classList.remove('lock');
  coverElem.classList.add('hidden');
  relaxSection.classList.add('hidden');
  seaSounds.pause();
}

const displayTime = () => {
  let minutes = Math.floor(secondsRemaining / 60);
  let seconds = secondsRemaining - (minutes * 60);
  if(seconds < 10) {
    seconds = "0" + seconds;
  }
  let time = minutes + ":" + seconds;
  timer.innerHTML = `${time}`;
}

const startTimer = () => {
  let relaxTimer = setTimeout(function tick() {
    secondsRemaining--;
    if(secondsRemaining < 0) {
      clearTimeout(relaxTimer);
      closeRelaxContainer();
      return;
    }
    displayTime();
    relaxTimer = setTimeout(tick, 1000);
  }, 1000);
  coverElem.addEventListener('click',() => {
    closeRelaxContainer();
    clearTimeout(relaxTimer);
  });
  closeIcon.addEventListener('click',() => {
    closeRelaxContainer();
    clearTimeout(relaxTimer);
  });
}

const reset = () => {
  secondsRemaining = 120;
  timer.animate([{ color: '#d43131' }, { color: '#07193c' }], {
    duration: 1500,
  });
  displayTime();
  setOpacity();
}

const setOpacity = () => {
  let opacity = 1;
  setTimeout(function changeOpacity() {
    if(opacity < 0) return;
    tryAgain.setAttribute('style', `opacity: ${opacity}`);
    opacity = (opacity - 0.1).toFixed(1);
    setTimeout(changeOpacity, 120);
  }, 120);
};
