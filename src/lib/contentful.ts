import { fetchQuestionsByIds } from "./algolia.ts";
import type { QuizStep } from "../Types/QuizeStep.ts";
import type {Question} from "../Types/Question.ts";

const CACHE_KEY = 'quiz_data_cache';
const CACHE_TTL = 1000 * 60 * 60; // 1 година

interface ContentfulLink {
    sys: {
        id: string;
        type: "Link";
        linkType: "Entry";
    };
}

interface ContentfulStepEntry {
    fields: {
        stepNumber: number;
        title: string;
        question?: ContentfulLink[];
    };
    sys: {
        id: string;
    };
}

interface ContentfulResponse {
    items: ContentfulStepEntry[];
}

interface CacheData {
    timestamp: number;
    data: QuizStep[];
}

const SPACE_ID = 'h20fjg5fzer3';
const ACCESS_TOKEN = 'nQTawtIgKGurNajcuxbrjymJLR-S5atY4EGGOyTZF2M';
const CONTENT_TYPE = 'step';

export const fetchQuizSteps = async (): Promise<QuizStep[]> => {
    const cached = localStorage.getItem(CACHE_KEY);

    if (cached) {
        const parsed: CacheData = JSON.parse(cached);
        if (Date.now() - parsed.timestamp < CACHE_TTL) return parsed.data;
    }

    try {
        const url = `https://cdn.contentful.com/spaces/${SPACE_ID}/environments/master/entries?access_token=${ACCESS_TOKEN}&content_type=${CONTENT_TYPE}&order=fields.stepNumber`;

        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const rawData: ContentfulResponse = await response.json();

        const allQuestionIds: string[] = rawData.items.flatMap(item =>
            (item.fields.question || []).map(q => q.sys.id)
        );

        const allFullQuestions: Question[] = await fetchQuestionsByIds(allQuestionIds);

        const questionsMap = new Map<string, Question>(
            allFullQuestions.map(q => [q.algoliaId, q])
        );

        const steps: QuizStep[] = rawData.items.map(item => {
            const stepQuestions = (item.fields.question || [])
                .map(qLink => questionsMap.get(qLink.sys.id))
                .filter((q): q is Question => Boolean(q));

            return {
                stepNumber: item.fields.stepNumber,
                title: item.fields.title,
                questions: stepQuestions
            };
        });

        localStorage.setItem(CACHE_KEY, JSON.stringify({
            timestamp: Date.now(),
            data: steps
        }));

        return steps;

    } catch (e) {
        console.error("Помилка при завантаженні квізу:", e);
        return [];
    }
};
