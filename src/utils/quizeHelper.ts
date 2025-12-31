import type {Question} from "../Types/Question.ts";

export const checkIsCorrect = (question: Question, userAnswers: string[]): boolean => {
    const correctAnswer = question.correctAnswer;

    if (!correctAnswer) return true;

    const correctKeywords = (Array.isArray(correctAnswer)
        ? correctAnswer
        : String(correctAnswer).split(',').map(s => s.trim()))
        .map(s => s.toLowerCase());

    if (question.type === 'Open') {
        const userText = userAnswers[0]?.toLowerCase() || "";
        const matchedKeywords = correctKeywords.filter(keyword =>
            userText.includes(keyword)
        );

        return matchedKeywords.length > (correctKeywords.length / 2);
    } else {
        const userArraySorted = [...userAnswers]
            .map(s => String(s).trim().toLowerCase())
            .sort();

        const correctSorted = [...correctKeywords].sort();

        return (
            correctSorted.length === userArraySorted.length &&
            correctSorted.every((val, index) => val === userArraySorted[index])
        );
    }
};
