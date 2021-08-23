import React from 'react';
import { useSpring, animated } from 'react-spring';

export default function AnswerCard(props) {

    const flipAnimation = useSpring({
        transform: `rotate3d(0, 1, 0, ${props.cardInfo.flipped ? 180 : 0}deg)`,
        config: { mass: 1, tension: 220, friction: 26 },
        // onRest: props.restFunc
      })

    return (
        <animated.div className={`game-card`} style={flipAnimation}>
            <div className={`game-card-front`}>{props.cardInfo.answer}</div>
            <div className={`game-card-back`}></div>
        </animated.div>
    );
}