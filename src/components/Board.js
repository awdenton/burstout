import React from 'react';
import { useTransition, useSpringRef, animated } from 'react-spring';
import _ from 'lodash';
import { AnswerCard } from ".";


export default function Board(props) {

    const boardTranApi = useSpringRef();
    const boardTransition = useTransition(props.roundData, {
        ref: boardTranApi,
        from: { opacity: 0 },
        enter: { opacity: 1 },
        leave: { opacity: 0 },
    });

    return (
        <div>
            <div className="card-row">
                {_.chain(props.roundData)
                    .slice(0, 4)
                    .map((answer, index) => {
                        return (
                            {boardTransition(() => (
                            <animated.div className="fade-box" key={"row1" + index}>
                            <AnswerCard cardInfo={answer} />
                            </animated.div>
                            ))}
                        );
                    })
                    .value()}
            </div>
            <div className="card-row">
                {_.chain(props.roundData)
                    .slice(4, 8)
                    .map((answer, index) => {
                        return (
                            <AnswerCard cardInfo={answer} key={"row2" + index} />
                        );
                    })
                    .value()}
            </div>
            <div className="card-row">
                {_.chain(props.roundData)
                    .slice(8)
                    .map((answer, index) => {
                        return (
                            <AnswerCard cardInfo={answer} key={"row3" + index} />
                        );
                    })
                    .value()}
            </div>
        </div>
    );
}