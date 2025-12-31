import React from 'react';

interface ProgressBarProps {
    currentStep: number;
    totalSteps: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ currentStep, totalSteps }) => {
    const progress = Math.min(100, Math.max(0, ((currentStep + 1) / totalSteps) * 100));

    return (
        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-6">
            <div
                className="bg-indigo-600 h-2.5 rounded-full transition-all duration-300 ease-in-out"
                style={{ width: `${progress}%` }}
            ></div>
            <div className="text-xs text-gray-500 mt-1 text-right">
                Step {currentStep + 1} of {totalSteps}
            </div>
        </div>
    );
};
