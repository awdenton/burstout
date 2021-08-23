import React from 'react';
import _ from 'lodash';
import { AnswerCard } from ".";
import { gameConstants } from '../utils';


export default function Board(props) {

    return (
        <div className="board-div">
            <div className="card-row">
                {_.chain(props.roundData)
                    .slice(0, 5)
                    .map((answer, index) => {
                        return (
                            <AnswerCard cardInfo={answer} key={"row1" + index}/>
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
            <h3>{props.timer} Seconds Remaining!</h3>
        </div>
    );
}