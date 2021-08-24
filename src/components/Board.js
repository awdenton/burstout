import React from 'react';
import { useTrail, animated } from 'react-spring';
import _ from 'lodash';
import { AnswerCard } from ".";

export default function Board(props) {

    return (
        <div className="board-div">

            <h1>{props.roundTheme}</h1>

            <div className="cards-frame">
                {_.map(props.roundData, (answer, index) => {
                    return (
                        <AnswerCard cardInfo={answer} key={index} />
                    );
                })}
            </div>

            {props.timerActive ? <h3>{props.timer} Seconds Remaining!</h3> : <h3>Time's up!</h3>}

            <div>
                {_.map(props.misses, (miss, index) => {
                    return (
                        <span className="missed-word" key={index}>{miss}</span>
                    );
                })}
            </div>

        </div>
    );
}