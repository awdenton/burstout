import React, { useState } from 'react';
import _ from 'lodash';
import './App.css';
import { AnswerCard } from './components';
import { categories } from './utils';

export default function App() {
  const [guess, setGuess] = useState("");
  const [exCard, setExCard] = useState({ title: _.sample(categories[4].answers), flipped: false });
  const [cards, setCards] = useState([]);

  const dealCards = () => {
    if (cards[0]) {
      flipCards(false);
    }

    let category = _.sample(categories);

    let newCards = _.chain(category.answers)
      .shuffle()
      .slice(0, 12)
      .map(answer => {
        return { title: answer, flipped: false }
      })
      .value();

    setCards(newCards);
  }

  const flipCards = showFace => {
    let tempCards = _.clone(cards);
    _.forEach(tempCards, card => {
      card.flipped = showFace;
    })
    setCards(tempCards);
  }

  const flipDone = () => {
    let category = _.sample(categories);

    let newCards = _.chain(category.answers)
      .shuffle()
      .slice(0, 12)
      .map(answer => {
        return { title: answer, flipped: false }
      })
      .value();

    setCards(newCards);
  }

  const typingGuess = e => {
    setGuess(e.target.value);
  }

  const submitGuess = e => {
    e.preventDefault();

    let foundMatch = false;
    let tempCards = _.clone(cards);

    for (let i = 0; i < 10; i++) {
      if (tempCards[i].title.toLowerCase() === guess.toLowerCase()) {
        foundMatch = true;
        tempCards[i].flipped = true;
      }
    }

    setGuess("");
    setCards(tempCards);
  }

  return (
    <div className="App">

      <div className="buttons">
        <button onClick={dealCards}>Deal Cards</button>
        <button onClick={flipCards}>Flip Cards</button>
      </div>

      <div>
        <h1>{</h1>
      </div>

      <div>
        <form onSubmit={submitGuess}>
          <input type="text" value={guess} onChange={typingGuess}/>
          <input type="submit" onClick={submitGuess} />
        </form>
      </div>


      <div>
        {_.map(cards, (card, index) => {
          return (
            <AnswerCard cardInfo={card} restFunc={flipDone} key={index} />
          );
        })}
        {/* <AnswerCard cardInfo={exCard} restFunc={flipDone} /> */}
      </div>

    </div>
  );
}