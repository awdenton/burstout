import React from 'react';
import { useSpring, animated } from 'react-spring';
import _ from 'lodash';
import { AnswerCard } from ".";
import { gameConstants } from '../utils';


export default function Board(props) {

    const missPopIn = useSpring({
        from: { opacity: 0 },
        to: { opacity: 1 },
        config: { mass: 1, tension: 200, friction: 26 }
    })

    return (
        <div className="board-div">
            <h1>{props.roundTheme}</h1>
            <div className="card-row">
                {_.chain(props.roundData)
                    .slice(0, 5)
                    .map((answer, index) => {
                        return (
                            <AnswerCard cardInfo={answer} key={"row1" + index} />
                        )
                    })
                    .value()}
            </div>
            <div className="card-row">
                {_.chain(props.roundData)
                    .slice(5, 10)
                    .map((answer, index) => {
                        return (
                            <AnswerCard cardInfo={answer} key={"row2" + index} />
                        );
                    })
                    .value()}
            </div>
            <div className="card-row">
                {_.chain(props.roundData)
                    .slice(10)
                    .map((answer, index) => {
                        return (
                            <AnswerCard cardInfo={answer} key={"row3" + index} />
                        );
                    })
                    .value()}
            </div>
            {props.timerActive ? <h3>{props.timer} Seconds Remaining!</h3> : <h3>Time's up!</h3>}
            <animated.div>
                {_.map(props.misses, (miss, index) => {
                    return (
                        <span className="missed-word" style={missPopIn} key={index}>{miss}</span>
                    );
                })}
            </animated.div>
        </div>
    );
}