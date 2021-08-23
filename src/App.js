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

  const [timer, setTimer] = useState(0);

  useEffect(() => {
    if(activeGame) {
      if(timer > 0) {
        setTimeout(() => setTimer(timer-1), 1000)
      }
    }
  })

  const boardTransition = useTransition(activeGame, {
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 }
  });

  const toggleGame = () => {
    let tempBool = !activeGame;
    setActiveGame(tempBool);

    if (tempBool) {
      dealGame();
    } else {
      setRoundTheme("Burst Out");
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

    setRoundTheme(newCat.theme);
    setTimer(gameConstants.gameLength)
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
    }

    setGuess("");
  }

  return (
    <div className="App">

      <div className="buttons">
        <button onClick={toggleGame}>Toggle Game</button>
      </div>

      <div>
        <form onSubmit={submitGuess}>
          <input type="text" value={guess} onChange={typingGuess} disabled={!activeGame}/>
          <input type="submit" onClick={submitGuess} />
        </form>
      </div>

      <div>
        <h1>{roundTheme}</h1>
      </div>

      <div className="board-frame">
        {boardTransition((style, item) => {
          return item ? <animated.div style={style}><Board roundData={cards} timer={timer}/></animated.div> : ""
        })}
      </div>

    </div>
  );
}