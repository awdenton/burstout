import React, { useState, useEffect } from 'react';
import _ from 'lodash';
import Countdown from 'react-countdown';
import './App.css';
import { Board, Misses, Timer } from './components';
import { categories } from './utils';

export default function App() {
  const [guess, setGuess] = useState("");
  const [theme, setTheme] = useState("Start a New Game");
  const [answers, setAnswers] = useState({});
  const [misses, setMisses] = useState([]);
  const [bonus, setBonus] = useState(0);
  const [score, setScore] = useState(0);
  const [canGuess, setCanGuess] = useState(false);
  const [timerStart, setTimerStart] = useState(Date.now())

  const newGame = () => {
    let randCat = _.sample(categories);

    let newAnswers = _.chain(randCat.answers)
      .shuffle()
      .slice(0, 12)
      .value();

    let answersData = _.map(newAnswers, ans => {
      return { title: ans, found: false };
    })

    setTheme(randCat.theme);
    setAnswers(answersData);
    setMisses([]);
    setBonus(randCat.bonus);
    setScore(0);
    setCanGuess(true);
    setGuess("");
    setTimerStart(Date.now() + 120000);
  }

  const handleGuess = e => {
    setGuess(e.target.value);
  }

  const submitGuess = (e) => {
    e.preventDefault();

    let match = false;
    let tempAns = answers.slice();

    for (let i = 0; i < 10; i++) {
      if (tempAns[i].title.toLowerCase() === guess.toLowerCase()) {
        match = true;
        tempAns[i].found = true;
        (i === bonus) ? setScore(score + 3) : setScore(score + 1)
      }
    }

    if (!match) {
      let missedCopy = misses.slice();
      missedCopy.push(guess);
      setMisses(missedCopy);
    }

    setGuess("");
    setAnswers(tempAns);
  }

  const timeOut = () => {
    setTheme("TIMES UP! TRY AGAIN!");
    setCanGuess(false);

    let tempAns = answers.slice();
    _.forEach(tempAns, ans => {
      ans.found = true;
    })

    setAnswers(tempAns);
  }

  return (
    <div className="App">

      <div className="header">
        <h1 id="title">BURSTOUT</h1>
        <button id="start-button" onClick={newGame}>New Game</button>
        <h3 id="theme-banner">{theme}</h3>
        <Timer date={timerStart} timeOut={timeOut} />

        <form id="guess-box" onSubmit={submitGuess}>
          <input placeholder="Guess!" value={guess} onChange={handleGuess} disabled={!canGuess} />
          <input type="submit" value="Guess" />
        </form>

        <div>{`Score: ${score}`}</div>
      </div>


      <Board answers={answers} />

      <Misses misses={misses} />

    </div>
  );
}