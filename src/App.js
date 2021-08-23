import React, { useState } from 'react';
import _ from 'lodash';
import './App.css';
import { Board } from './components';
import { categories } from './utils';

export default function App() {
  const [activeGame, setActiveGame] = useState(false);
  const [guess, setGuess] = useState("");
  const [roundTheme, setRoundTheme] = useState("");
  const [cards, setCards] = useState([]);

  const toggleGame = () => {
    let tempBool = !activeGame;
    setActiveGame(tempBool);

    if (tempBool) {
      dealGame();
    } else {
      setRoundTheme("");
      setCards([]);
    }
  }

  const dealGame = () => {
    let newCat = _.sample(categories);

    setCards(_.chain(newCat.answers)
      .shuffle()
      .slice(0, 12)
      .map(entry => { return { answer: entry, flipped: false } })
      .value()
    );

    setRoundTheme(newCat.theme);
  }

  // const flipDone = () => {
  //   let category = _.sample(categories);

  //   let newCards = _.chain(category.answers)
  //     .shuffle()
  //     .slice(0, 12)
  //     .map(answer => {
  //       return { title: answer, flipped: false }
  //     })
  //     .value();

  //   setCards(newCards);
  // }

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
          <input type="text" value={guess} onChange={typingGuess} />
          <input type="submit" onClick={submitGuess} />
        </form>
      </div>

      <div>
        <h1>{roundTheme}</h1>
      </div>

      <div>
        {activeGame ? <Board roundData={cards} /> : "No game"}
      </div>

    </div>
  );
}