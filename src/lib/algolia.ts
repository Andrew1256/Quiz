import { algoliasearch } from "algoliasearch";

const APP_ID = 'NMX1ZZUZLU';
const API_KEY = 'c84fe6b90b93d304bad4191ce2d8d5b1';

const client = algoliasearch(APP_ID, API_KEY);
export const fetchQuestionsByIds = async (ids: string[]): Promise<any[]> => {

    if (!ids || ids.length === 0) {
        console.error("❌ Помилка: Масив IDs порожній або undefined!");
        return [];
    }

    try {
        const { results } = await client.getObjects({
            requests: ids.map(id => ({
                indexName: 'question',
                objectID: id
            }))
        });


        return results
            .filter((hit: any) => hit && !hit.error && hit.fields)
            .map((hit: any) => {
                const f = hit.fields;

                return {
                    id: f?.id?.['en-US'] ?? hit.objectID,
                    text: f?.question?.['en-US'] || '',
                    type: f?.type?.['en-US'] || 'Radio',
                    options: f?.answers?.['en-US']?.options || [],
                    correctAnswer: f?.correctAnswers?.['en-US']?.value || '',
                    algoliaId: hit.objectID
                };
            });
    } catch (error) {
        console.error("🔥 Критична помилка в fetchQuestionsByIds:", error);
        return [];
    }
};
