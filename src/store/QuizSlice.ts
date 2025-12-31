import { fetchQuizSteps,} from "../lib/contentful.ts";
import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type {QuizStep} from "../Types/QuizeStep.ts";
import {checkIsCorrect} from "../utils/quizeHelper.ts";


interface QuizState {
    steps: QuizStep[];
    currentStepIndex: number;
    answers: Record<string, string[]>;
    isLoading: boolean;
    isComplete: boolean;
    score: number;
    totalQuestions: number;
    algoliaId: string;
}

const initialState: QuizState = {
    steps: [],
    currentStepIndex: 0,
    answers: {},
    isLoading: false,
    isComplete: false,
    score: 0,
    totalQuestions: 0,
    algoliaId: '',
};

export const loadQuiz = createAsyncThunk('quiz/loadQuiz', async () => {
    const steps = await fetchQuizSteps();
    return steps;
});

const quizSlice = createSlice({
    name: 'quiz',
    initialState,
    reducers: {
        setAnswer: (state, action: PayloadAction<{ questionId: string; answer: string; isMultiple?: boolean }>) => {
            const { questionId, answer, isMultiple } = action.payload;

            if (!state.answers[questionId]) {
                state.answers[questionId] = [];
            }

            if (isMultiple) {
                const index = state.answers[questionId].indexOf(answer);
                if (index > -1) {
                    state.answers[questionId].splice(index, 1);
                } else {
                    state.answers[questionId].push(answer);
                }
            } else {
                state.answers[questionId] = [answer];
            }
        },

        nextStep: (state) => {
            if (state.currentStepIndex < state.steps.length - 1) {
                state.currentStepIndex += 1;
            } else {
                let totalQuestionsCount = 0;
                let correctCount = 0;

                state.steps.forEach(step => {
                    step.questions.forEach(question => {
                        const userAnswers = state.answers[question.id] || [];

                        if (question.correctAnswer) {
                            totalQuestionsCount++;
                            if (checkIsCorrect(question, userAnswers)) {
                                correctCount++;
                            }
                        }
                    });
                });

                state.score = correctCount;
                state.totalQuestions = totalQuestionsCount;
                state.isComplete = true;
            }
        },

        prevStep: (state) => {
            if (state.currentStepIndex > 0) {
                state.currentStepIndex -= 1;
            }
        },
        resetQuiz: (state) => {
            state.currentStepIndex = 0;
            state.answers = {};
            state.isComplete = false;
            state.score = 0;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(loadQuiz.pending, (state) => { state.isLoading = true; })
            .addCase(loadQuiz.fulfilled, (state, action) => {
                state.steps = action.payload;
                state.isLoading = false;
            })
            .addCase(loadQuiz.rejected, (state) => { state.isLoading = false; });
    },
});

export const { setAnswer, nextStep, prevStep, resetQuiz } = quizSlice.actions;
export default quizSlice.reducer;
