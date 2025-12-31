import React, { useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../store/Store.ts";
import { loadQuiz, nextStep, prevStep, resetQuiz } from "../store/QuizSlice.ts";
import { ProgressBar } from "../Components/ProgressBar.tsx";
import { QuizStep } from "../Components/QuizStep.tsx";
import { QuizResults } from "../Components/QuizResults.tsx";

export const QuizPage: React.FC = () => {
    const dispatch = useDispatch();

    const { steps, currentStepIndex, isLoading, isComplete, answers } = useSelector(
        (state: RootState) => state.quiz
    );

    useEffect(() => {
        dispatch(loadQuiz() as any);
    }, [dispatch]);

    // Обробники натискання
    const handleNext = () => dispatch(nextStep());
    const handlePrev = () => dispatch(prevStep());
    const handleReset = () => dispatch(resetQuiz());

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    if (steps.length === 0) return <div className="text-center p-8">No quiz data available.</div>;

    if (isComplete) {
        return <QuizResults steps={steps} answers={answers} onRestart={handleReset} />;
    }

    const currentStep = steps[currentStepIndex];
    const isLastStep = currentStepIndex === steps.length - 1;
    const isFirstStep = currentStepIndex === 0;

    // Перевірка валідації полів
    const canProceed = currentStep.questions.every(q => {
        const answer = answers[q.id];
        if (!answer) return false;
        if (Array.isArray(answer)) return answer.length > 0;
        return String(answer).trim().length > 0;
    });

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4">
            <div className="max-w-3xl mx-auto">
                <ProgressBar currentStep={currentStepIndex} totalSteps={steps.length} />

                <div className="bg-white shadow-xl rounded-lg overflow-hidden border border-gray-200">
                    <div className="p-10">
                        <QuizStep step={currentStep} />

                        <div className="mt-8 flex justify-between items-center pt-6 border-t border-gray-200">
                            {/* Кнопка "Попередній" */}
                            <button
                                onClick={handlePrev} // ВИПРАВЛЕНО
                                disabled={isFirstStep}
                                className={`px-6 py-2 border rounded-md text-sm font-medium transition-colors ${
                                    isFirstStep
                                        ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                                }`}
                            >
                                Попередній
                            </button>

                            {/* Кнопка "Наступний" або "Відправити" */}
                            <button
                                onClick={handleNext}
                                disabled={!canProceed}
                                className={`px-8 py-2 rounded-md shadow-sm text-sm font-medium text-white transition-all ${
                                    !canProceed
                                        ? 'bg-indigo-300 cursor-not-allowed'
                                        : 'bg-indigo-600 hover:bg-indigo-700 active:scale-95'
                                }`}
                            >
                                {isLastStep ? 'Відправити' : 'Наступний'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
