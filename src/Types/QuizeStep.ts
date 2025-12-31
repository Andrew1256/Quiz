import type {Question} from "./Question.ts";

export interface QuizStep {
    stepNumber: number;
    title: string;
    questions: Question[];
}
