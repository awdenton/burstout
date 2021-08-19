import React, { useState, useEffect } from 'react';
import {AnimateOnChange, animations } from 'react-animation';

export default function AnswerCard(props) {
    const [isFlipped, setIsFlipped] = useState(props.answer.found);

    useEffect(() => {
        setIsFlipped(props.answer.found);
    }, [props.answer.found]);

    return (
        <div className={`game-card ${isFlipped ? "flipped" : ""}`}>
            <div className={`game-card-front`}>{props.answer.title}</div>
            <div className={`game-card-back`}></div>
        </div>
    );
}