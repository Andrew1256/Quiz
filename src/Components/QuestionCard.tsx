import React from 'react';
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../store/Store.ts";
import { setAnswer } from "../store/QuizSlice.ts";
import type {Question} from "../Types/Question.ts";

interface QuestionCardProps {
    question: Question;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({ question }) => {
    const { answers } = useSelector((state: RootState) => state.quiz);
    const dispatch = useDispatch();

    const selectedAnswers = answers[question.id] || [];

    const singleValue = selectedAnswers[0] || '';

    return (
        <div className="mb-6 p-4 border border-gray-200 rounded-lg bg-white shadow-sm">
            <h3 className="text-lg font-medium text-gray-900 mb-3">{question.text}</h3>

            {/* RADIO */}
            {question.type === 'Radio' && question.options && (
                <div className="space-y-2">
                    {question.options.map((option) => (
                        <label key={option} className="flex items-center space-x-3 cursor-pointer p-2 hover:bg-gray-50 rounded">
                            <input
                                type="radio"
                                name={question.id}
                                value={option}
                                checked={singleValue === option}
                                onChange={() => dispatch(setAnswer({
                                    questionId: question.id,
                                    answer: option,
                                    isMultiple: false
                                }))}
                                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                            />
                            <span className="text-gray-700">{option}</span>
                        </label>
                    ))}
                </div>
            )}

            {/* CHECKBOX */}
            {question.type === 'Checkbox' && question.options && (
                <div className="space-y-2">
                    {question.options.map((option) => (
                        <label key={option} className="flex items-center space-x-3 cursor-pointer p-2 hover:bg-gray-50 rounded">
                            <input
                                type="checkbox"
                                checked={selectedAnswers.includes(option)}
                                onChange={() => dispatch(setAnswer({
                                    questionId: question.id,
                                    answer: option,
                                    isMultiple: true
                                }))}
                                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                            />
                            <span className="text-gray-700">{option}</span>
                        </label>
                    ))}
                </div>
            )}

            {/* SCALE */}
            {question.type === 'Scale' && (
                <div className="flex items-center justify-between space-x-2 mt-4">
                    {[1, 2, 3, 4, 5].map((num) => (
                        <button
                            key={num}
                            onClick={() => dispatch(setAnswer({
                                questionId: question.id,
                                answer: num.toString(),
                                isMultiple: false
                            }))}
                            className={`flex-1 py-3 text-sm font-medium rounded-md border transition-colors
                                ${singleValue === num.toString()
                                ? 'bg-indigo-600 text-white border-indigo-600'
                                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}
                        >
                            {num}
                        </button>
                    ))}
                </div>
            )}

            {question.type === 'Open' && (
                <textarea
                    value={singleValue}
                    onChange={(e) => dispatch(setAnswer({
                        questionId: question.id,
                        answer: e.target.value,
                        isMultiple: false
                    }))}
                    className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    rows={4}
                    placeholder="Type your answer here..."
                />
            )}
        </div>
    );
};
