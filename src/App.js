import React, { useState, useEffect } from 'react';
import { useTransition, animated } from 'react-spring';
import _ from 'lodash';
import './App.scss';
import { AnswerCard } from './components';
import { categories, gameConstants } from './utils';

export default function App() {
  let restResponse = 0;

  const [gameActive, setGameActive] = useState(false);
  const [guess, setGuess] = useState("");
  const [roundTheme, setRoundTheme] = useState("Random");
  const [cards, setCards] = useState([]);
  const [misses, setMisses] = useState([]);

  const [gameToggleLabel, setGameToggleLabel] = useState("Start");
  const [gameToggleActive, setGameToggleActive] = useState(true);
  const [themePickerActive, setThemePickerActive] = useState(true);

  const [timer, setTimer] = useState(gameConstants.gameLength);
  const [timerMessage, setTimerMessage] = useState('');
  const [timerActive, setTimerActive] = useState(false);

  // Contorls the timer
  useEffect(() => {
    if (timerActive) {
      if (timer > 0) {
        setTimeout(() => setTimer(timer - 1), 1000)
      } else {
        setTimerMessage("Time's Up!")
        setTimerActive(false);
        flipCards();
        setGuess("");
        setGameToggleLabel("Pick New Category");
      }
    }
  });

  // When all cards finish animating, take action based on gameActive
  const animComplete = () => {
    if (++restResponse === gameConstants.numberOfCards) {
      if (!gameActive) {
        setTimerActive(true);
        setGameToggleLabel("End Game");
        setMisses([]);
        setGameToggleActive(true)
        setGameActive(true);
      } else {
        setGameActive(false);
        setGameToggleLabel("Start");
        setGameToggleActive(true)
      }
    }
  }

  // React-Spring Transition to make cards pop in/out
  const cardTransition = useTransition(cards, {
    from: { opacity: 0, scale: 0 },
    enter: item => async (next) => {
      await next({ opacity: 1, scale: 1, delay: item.delay })
    },
    leave: { opacity: 0, scale: 0 },
    config: { mass: 5, tension: 400, friction: 75 },
    onRest: animComplete
  });

  const bannerTransition = useTransition(!themePickerActive, {
    from: { opacity: 0, scale: 0 },
    enter: { opacity: 1, scale: 1 },
    leave: { opacity: 0, scale: 0 },
  });

  const missTransition = useTransition(misses, {
    from: { opacity: 0, scale: 10, transform: `rotate3d(0, 1, 1, 360deg)` },
    enter: { opacity: 1, scale: 1, transform: `rotate3d(0, 0, 0, 0deg)` },
    leave: { opacity: 0, scale: 0 },
    config: { mass: 2, tension: 300, friction: 30 }
  });

  // There is one button in the game, what it does changes based on gameActive/timerActive
  const toggleGame = () => {
    if (!gameActive) {
      setGameToggleActive(false);
      setThemePickerActive(false);
      setTimer(gameConstants.gameLength)
      setTimerMessage(`Get Ready!`)
      dealGame();
    } else if (gameActive && timerActive) {
      flipCards();
      setGuess("");
      setTimerActive(false);
      setTimerMessage("Time's up!");
      setGameToggleLabel("Pick New Category");
    } else if (gameActive && !timerActive) {
      setGameToggleActive(false);
      setThemePickerActive(true);
      setMisses([]);
      setCards([]);
    }
  }

  // Sets up the next round. setCards here triggers the cardTransition animation, when it completes
  // the theme is revelead and the timer starts
  const dealGame = () => {
    let newCat = {};

    roundTheme === "Random" ? newCat = _.sample(categories) : newCat = _.find(categories, { theme: roundTheme })

    setCards(_.chain(newCat.answers)
      .shuffle()
      .slice(0, gameConstants.numberOfCards)
      .map((entry, index) => { return { answer: entry, flipped: false, found: false, delay: (index * 100) } })
      .value()
    );

    setRoundTheme(newCat.theme);
  }
  const handleThemeChoice = (e) => {
    setRoundTheme(e.target.value);
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
        tempCards[i].found = true;
      }
    }

    if (foundMatch) {
      setCards(tempCards);
      checkWin();
    } else {
      let missCopy = _.slice(misses);
      missCopy.push(guess);
      console.log(missCopy);
      setMisses(missCopy);
    }

    setGuess("");
  }

  const checkWin = () => {
    let unFlipped = _.filter(cards, { flipped: false });

    if (!unFlipped[0]) {
      setTimerActive(false);
      setTimerMessage("You Win!");
    }
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


      <div className="title banner">BURST-OUT!</div>


      <div className="theme-picker">
        <select onChange={handleThemeChoice} disabled={!themePickerActive}>
          <option value='Random'>Random</option>
          {_.map(categories, (cat, index) => {
            return (
              <option value={cat.theme} key={index}>{cat.theme}</option>
            );
          })}
        </select>
      </div>

      <div className="game-toggle">
        <button onClick={toggleGame} disabled={!gameToggleActive} >{gameToggleLabel}</button>
      </div>

      <form onSubmit={submitGuess}>
        <input type="text" value={guess} onChange={typingGuess} disabled={!timerActive} />
      </form>


      <div className="board-frame">

        <div className="banner">
          {bannerTransition((style, item) => {
            return item ? <animated.div style={style}>{roundTheme}</animated.div> : ""
          })}
        </div>

        <div className="cards-frame">
          {cardTransition((style, item) => {
            return item ? <animated.div className="card-anim" style={style}><AnswerCard cardInfo={item} /></animated.div> : ""
          })}
        </div>


        {/* <Timer timer={timer} active={timerActive} message={timerMessage} isVisible={!themePickerActive} onFinish={() => {}} */}
        <div className="banner">
          {bannerTransition((style, item) => {
            return item ? <animated.div style={style}>{timerActive ? `${timer} Seconds Remaining!` : `${timerMessage}`}</animated.div> : ""
          })}
        </div>

        <div className="misses">

          {missTransition((style, item) => {
            return item ? <animated.div style={style} className="missed-word">{item}</animated.div> : ""
          })}
        </div>

      </div>


    </div>
  );
}