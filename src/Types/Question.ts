export interface Question {
    id: string;
    text: string;
    type: string;
    options?: string[];
    correctAnswer?: string;
    algoliaId: string;
}
