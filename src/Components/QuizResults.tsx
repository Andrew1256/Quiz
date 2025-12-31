import React from 'react';
import { useSelector } from "react-redux";
import type { RootState } from "../store/Store.ts";
import type { QuizStep } from "../Types/QuizeStep.ts";
import { checkIsCorrect } from "../utils/quizeHelper.ts";

interface QuizResultsProps {
    steps: QuizStep[];
    answers: Record<string, string[]>;
    onRestart: () => void;
}

export const QuizResults: React.FC<QuizResultsProps> = ({ steps, answers, onRestart }) => {
    const { score, totalQuestions } = useSelector((state: RootState) => state.quiz);

    const percentage = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;

    return (
        <div className="max-w-3xl mx-auto p-6 bg-white shadow-xl rounded-lg">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-6">Тест завершено!</h2>

            <div className="mb-8 text-center">
                <div className="inline-block p-6 rounded-full bg-indigo-50 mb-4 border-4 border-indigo-100">
                    <span className="text-4xl font-bold text-indigo-600">{percentage}%</span>
                </div>
                <p className="text-gray-600 text-lg">
                    Ви відповіли правильно на {score} з {totalQuestions} питань.
                </p>
            </div>

            <div className="space-y-8 mb-8">
                <h3 className="text-xl font-semibold text-gray-800 border-b pb-2">Детальний аналіз</h3>

                {steps.map((step) => (
                    <div key={step.stepNumber} className="space-y-4">
                        <h4 className="font-bold text-indigo-800 bg-indigo-50 px-3 py-1 rounded-md inline-block">
                            {step.title}
                        </h4>

                        {step.questions.map((question) => {
                            const userAnswers = answers[question.id] || [];
                            // ВИПРАВЛЕНО: Виклик функції всередині циклу, де доступні дані конкретного питання
                            const isAnswerCorrect = checkIsCorrect(question, userAnswers);

                            // Форматуємо відповіді для відображення
                            const displayUserAnswer = question.type === 'Open'
                                ? userAnswers[0]
                                : [...userAnswers].sort().join(', ');

                            const displayCorrectAnswer = Array.isArray(question.correctAnswer)
                                ? [...question.correctAnswer].sort().join(', ')
                                : question.correctAnswer;

                            return (
                                <div
                                    key={question.id}
                                    className={`border-l-4 pl-4 py-3 rounded-r-lg transition-colors ${
                                        isAnswerCorrect ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'
                                    }`}
                                >
                                    <p className="font-medium text-gray-900">{question.text}</p>

                                    <div className="mt-2 text-sm">
                                        <p className="text-gray-600">
                                            <span className="font-semibold">Ваша відповідь:</span>{' '}
                                            <span className={isAnswerCorrect ? 'text-green-700 font-medium' : 'text-red-700 font-medium'}>
                                                {displayUserAnswer || 'Пропущено'}
                                            </span>
                                        </p>

                                        {!isAnswerCorrect && question.correctAnswer && (
                                            <p className="text-gray-500 mt-1 italic">
                                                <span className="font-semibold not-italic">Правильна відповідь:</span>{' '}
                                                {displayCorrectAnswer}
                                            </p>
                                        )}
                                    </div>

                                    {question.type === 'Open' && isAnswerCorrect && (
                                        <p className="text-[10px] text-green-600 mt-1 italic">
                                            * Зараховано за ключовими словами
                                        </p>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                ))}
            </div>

            <div className="text-center pt-6 border-t border-gray-100">
                <button
                    onClick={onRestart}
                    className="px-10 py-3 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 active:scale-95 transition-all shadow-md"
                >
                    Пройти ще раз
                </button>
            </div>
        </div>
    );
};
