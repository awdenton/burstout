import React from 'react';
import _ from 'lodash';

export default function Misses(props) {


    return (
        <div className="missed-guesses">
            {
                _.map(props.misses, miss => {
                    return (
                        <p className="miss">{miss}</p>
                    );
                })
            }       
        </div>
    );
}