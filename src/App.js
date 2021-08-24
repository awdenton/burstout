import React, { useState, useEffect } from 'react';
import _ from 'lodash';
import { useTransition, animated } from 'react-spring';
import './App.css';
import { Board } from './components';
import { categories, gameConstants } from './utils';

export default function App() {

  const [activeGame, setActiveGame] = useState(false);
  const [guess, setGuess] = useState("");
  const [roundTheme, setRoundTheme] = useState("Burst Out");
  const [cards, setCards] = useState([]);
  const [misses, setMisses] = useState([]);

  const [gameToggleLabel, setGameToggleLabel] = useState("Start");

  const [timer, setTimer] = useState(0);
  const [timerActive, setTimerActive] = useState(false);

  useEffect(() => {
    if (timerActive) {
      if (timer > 0) {
        setTimeout(() => setTimer(timer - 1), 1000)
      } else {
        flipCards();
        setTimerActive(false);
        setGameToggleLabel("Random Category");
      }
    }
  });

  const boardTransition = useTransition(activeGame, {
    from: { opacity: 0, scale: 0 },
    enter: { opacity: 1, scale: 1 },
    leave: { opacity: 0, scale: 0 }
  });

  const toggleGame = () => {
    let gameBool = activeGame;
    let timerBool = timerActive;

    if (!gameBool) {
      setActiveGame(!gameBool)
      dealGame();
      setGameToggleLabel("End Game");
    } else if (gameBool && !timerBool) {
      setActiveGame(!gameBool);
      setGameToggleLabel("Start");
    } else if (gameBool && timerBool) {
      flipCards();
      setTimerActive(!timerBool);
      setGameToggleLabel("Random Category");
    }
  }

  const dealGame = () => {
    let newCat = _.sample(categories);  

    setCards(_.chain(newCat.answers)
      .shuffle()
      .slice(0, gameConstants.numberOfCards)
      .map(entry => { return { answer: entry, flipped: false } })
      .value()
    );

    setMisses([]);
    setRoundTheme(newCat.theme);
    setTimer(gameConstants.gameLength)
    setTimerActive(true);
  }

  const typingGuess = e => {
    setGuess(e.target.value);
  }

  const submitGuess = e => {
    e.preventDefault();

    let foundMatch = false;
    let tempCards = _.clone(cards);

    for (let i = 0; i < tempCards.length; i++) {
      if (tempCards[i].answer.toLowerCase() === guess.toLowerCase()) {
        foundMatch = true;
        tempCards[i].flipped = true;
      }
    }

    if (foundMatch) {
      setCards(tempCards);
    } else {
      let missCopy = _.clone(misses);
      missCopy.push(guess);
      setMisses(missCopy);
    }

    setGuess("");
  }

  const flipCards = () => {
    let tempCards = _.clone(cards);

    _.forEach(tempCards, card => {
      card.flipped = true;
    });

    setCards(tempCards);
  }

  return (
    <div className="App">

      <div className="buttons">
        <button onClick={toggleGame}>{gameToggleLabel}</button>
      </div>

      <div>
        <form onSubmit={submitGuess}>
          <input type="text" value={guess} onChange={typingGuess} disabled={!timerActive} />
          <input type="submit" onClick={submitGuess} />
        </form>
      </div>

      <div className="board-frame">
        {boardTransition((style, item) => {
          return item ? <animated.div style={style}><Board roundData={cards} roundTheme={roundTheme} timer={timer} timerActive={timerActive} misses={misses}/></animated.div> : ""
        })}
      </div>

    </div>
  );
}