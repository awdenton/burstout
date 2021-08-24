import React, { useState, useEffect } from 'react';
import { useTransition, animated } from 'react-spring';
import _ from 'lodash';
import './App.css';
import { Board, AnswerCard } from './components';
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
        setGuess("");
        setGameToggleLabel("Random Category");
      }
    }
  });

  const cardTransition = useTransition(cards, {
    from: { opacity: 0, scale: 0 },
    enter: item => async (next) => {
      await next({opacity: 1, scale: 1, delay: item.delay })
    },
    leave: { opacity: 0, scale: 0 },
    config: {mass: 5, tension: 400, friction: 75},
    onRest: () => console.log('rested')
  });

  const toggleGame = () => {
    let gameBool = activeGame;
    let timerBool = timerActive;

    if (!gameBool) {
      setActiveGame(!gameBool)
      dealGame();
      setGameToggleLabel("End Game");
    } else if (gameBool && timerBool) {
      flipCards();
      setGuess("");
      setTimerActive(!timerBool);
      setGameToggleLabel("Random Category");
    } else if (gameBool && !timerBool) {
      setCards([]);
      setActiveGame(!gameBool);
      setGameToggleLabel("Start");
    }
  }

  const dealGame = () => {
    let newCat = _.sample(categories);

    setCards(_.chain(newCat.answers)
      .shuffle()
      .slice(0, gameConstants.numberOfCards)
      .map((entry, index) => { return { answer: entry, flipped: false, delay:(index*100)} })
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

      <button onClick={toggleGame} className="game-toggle">{gameToggleLabel}</button>

      <form onSubmit={submitGuess}>
        <input type="text" value={guess} onChange={typingGuess} disabled={!timerActive} />
      </form>

      <div className="board-frame">

        <h1>{roundTheme}</h1>

        <div className="cards-frame">
          {cardTransition((style, item) => {
            return item ? <animated.div className="card-anim" style={style}><AnswerCard cardInfo={item} /></animated.div> : ""
          })}
        </div>

        {timerActive ? <h3>{timer} Seconds Remaining!</h3> : <h3>Time's up!</h3>}

        <div>
          {_.map(misses, (miss, index) => {
            return (
              <span className="missed-word" key={index}>{miss}</span>
            );
          })}
        </div>

      </div>

    </div>
  );
}