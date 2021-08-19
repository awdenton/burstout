import React from 'react';
import _ from 'lodash';
import { AnswerCard } from ".";


export default function Board(props) {
    return (
        <div>
            <div className="card-row">
                {_.chain(props.answers)
                    .slice(0, 4)
                    .map((answer, index) => {
                        return (
                            <AnswerCard answer={answer} key={"1"+index} />
                        );
                    })
                    .value()}
            </div>
            <div className="card-row">
                {_.chain(props.answers)
                    .slice(4, 8)
                    .map((answer, index) => {
                        return (
                            <AnswerCard answer={answer} key={"2"+index} />
                        );
                    })
                    .value()}
            </div>
            <div className="card-row">
                {_.chain(props.answers)
                    .slice(8)
                    .map((answer, index) => {
                        return (
                            <AnswerCard answer={answer} key={"3"+index} />
                        );
                    })
                    .value()}
            </div>
        </div>
    );
}