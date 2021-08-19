import React, { useState, useEffect, useRef } from 'react';
import Countdown from 'react-countdown';

export default function Timer(props) {
    const [timerStart, setTimerStart] = useState(props.date);

    const renderer = ({minutes, seconds}) => <span>{minutes}:{seconds}</span>
    const timerApi = useRef();

    useEffect(() => {
        setTimerStart(props.date);
        timerApi.current.start();
    }, [props.date]);

    return (
        <Countdown
            date={timerStart}
            ref={timerApi}
            onComplete={props.timeOut}
            renderer={renderer} >
                
        </Countdown>
    );
}