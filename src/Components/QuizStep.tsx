import React from 'react';
import {type QuizStep as QuizStepType} from "../Types/QuizeStep.ts";
import { QuestionCard } from './QuestionCard';

interface QuizStepProps {
    step: QuizStepType;
}

export const QuizStep: React.FC<QuizStepProps> = ({ step }) => {
    return (
        <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">{step.title}</h2>
            <div className="space-y-6">
                {step.questions.map((question) => (
                    <QuestionCard key={question.id} question={question} />
                ))}
            </div>
        </div>
    );
};
