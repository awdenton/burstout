// import React, { useState, useEffect } from 'react';
// import { useTransition, animated } from 'react-spring';
// import _ from 'lodash';
// import { gameConstants } from '../utils';

// /*
//     need to get 
//         themePickerActive
//         timerActive
//         timerMessage
// */

// export default function Timer(props) {
//     // props.timerActive
//     // props.timerMessage
//     // props.isVisible (tied to themePickerActive)

//     const [isVisisble, setIsVisible] = useState(props.isVisible);

//     useEffect(() => {
//         if (props.timerActive) {
//           if (props.timer > 0) {
//             setTimeout(() => setTimer(props.timer - 1), 1000)
//           } else {
//             setTimerActive(false);
//           }
//         }
//       });

//     const bannerTransition = useTransition(props.isVisible, {
//         from: { opacity: 0, scale: 0 },
//         enter: { opacity: 1, scale: 1 },
//         leave: { opacity: 0, scale: 0 },
//       });
    

//     return ( 
//         <div className="banner">
//           {bannerTransition((style, item) => {
//             return item ? <animated.div style={style}>{timerActive ? `${timer} Seconds Remaining!` : `${timerMessage}`}</animated.div> : ""
//           })}
//         </div>
//     );
// }

