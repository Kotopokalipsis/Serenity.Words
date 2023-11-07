import { Component, ReactNode } from "react";
import { Word } from "../../../../models/word.model";
import WordTableRow from "./WordTableRow";
import { ServiceStorage } from "../../../services/service-storage.service";
import { OnWordCollectionRefreshedData } from "../../../services/words-storage-manager.service";

type WordsState = {
    dataIsLoaded: boolean;
    words: Word[];
    wordsWithoutTranslation: Word[];
    totalWords: number;
};
type WordsCollections = { wordsWithoutTranslation: Word[]; words: Word[]; totalWords: number };

class Words extends Component<{}, WordsState> {
    constructor(props: any) {
        super(props);

        let wordsCollections = this.getWordsCollections();

        this.state = {
            words: wordsCollections.words,
            wordsWithoutTranslation: wordsCollections.wordsWithoutTranslation,
            totalWords: wordsCollections.totalWords,
            dataIsLoaded: false,
        };

        this.onWordsRefreshedSubscription = this.onWordsRefreshedSubscription.bind(this);
        this.onWordsRefreshedSubscription();
    }

    onWordsRefreshedSubscription() {
        ServiceStorage.wordsStorageManager!.onWordCollectionRefreshed$.subscribe(
            async (data: OnWordCollectionRefreshedData) => {
                if (!ServiceStorage.wordsStorageManager || data.hasUpdate === false) return;

                let wordsCollections = this.getWordsCollections();
                this.setState({
                    words: wordsCollections.words,
                    wordsWithoutTranslation: wordsCollections.wordsWithoutTranslation,
                    dataIsLoaded: true,
                    totalWords: wordsCollections.totalWords,
                });
            },
        );
    }

    private getWordsCollections(): WordsCollections {
        let allWords = ServiceStorage.wordsStorageManager!.words;
        let wordsWithoutTranslation = allWords.filter((i) => !i.translation);
        let words = allWords.filter((i) => !wordsWithoutTranslation.includes(i));

        return {
            wordsWithoutTranslation: wordsWithoutTranslation,
            words: words,
            totalWords: allWords.length,
        };
    }

    render(): ReactNode {
        const { totalWords, words, wordsWithoutTranslation } = this.state;

        return (
            <main className="h-full overflow-y-auto">
                <div className="container px-6 mx-auto grid">
                    <div className="grid gap-6 mt-8 mb-8 md:grid-cols-2 xl:grid-cols-3">
                        <div className="flex items-center p-4 bg-white rounded-lg shadow-xs dark:bg-gray-800">
                            <div className="p-2 mr-4">
                                <span className="text-2xl">&#129395;</span>
                            </div>
                            <div>
                                <p className="mb-2 text-sm font-medium text-gray-600 dark:text-gray-400">
                                    Total words
                                </p>
                                <p className="text-lg font-semibold text-gray-700 dark:text-gray-200">
                                    {totalWords}
                                </p>
                            </div>
                        </div>
                        <div className="flex flex-col p-4 bg-white rounded-lg shadow-xs dark:bg-gray-800">
                            <div>
                                <p className="text-lg font-medium text-gray-600 dark:text-gray-400">
                                    How to add word from clipboard?
                                </p>
                            </div>
                            <div>
                                <p className="text-md font-medium text-gray-600 dark:text-gray-400">
                                    1. Copy word to clipboard
                                </p>
                            </div>
                            <div>
                                <p className="text-md font-medium text-gray-600 dark:text-gray-400">
                                    2. Press <span>Ctrl + B</span> (or "Command" for Mac) &#128526;
                                </p>
                            </div>

                        </div>
                    </div>
                    {wordsWithoutTranslation.length === 0 ? null : (
                        <div className="w-full overflow-hidden rounded-lg shadow-xs mb-4">
                            <h4 className="my-6 text-2xl font-semibold text-gray-700 dark:text-gray-200">
                                Words without translation:
                            </h4>
                            <div className="w-full overflow-x-auto border-2 border-red-500 rounded-lg">
                                <table className="w-full whitespace-no-wrap">
                                    <thead>
                                        <tr className="text-xs font-semibold tracking-wide text-left text-gray-500 uppercase border-b dark:border-gray-700 bg-gray-50 dark:text-gray-400 dark:bg-gray-800">
                                            <th className="px-4 py-3">Word</th>
                                            <th className="px-4 py-3">Translation</th>
                                            <th className="px-4 py-3">Guessed Right</th>
                                            <th className="px-4 py-3">Guessed Wrong</th>
                                            <th className="px-4 py-3">Created At</th>
                                            <th className="px-4 py-3">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y dark:divide-gray-700 dark:bg-gray-800">
                                        {wordsWithoutTranslation.map((word) => {
                                            return <WordTableRow key={word.id} word={word} />;
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                    <div className="w-full overflow-hidden rounded-lg shadow-xs">
                        <h2 className="my-6 text-2xl font-semibold text-gray-700 dark:text-gray-200">
                            Translated words:
                        </h2>
                        <div className="w-full overflow-x-auto">
                            <table className="w-full whitespace-no-wrap">
                                <thead>
                                    <tr className="text-xs font-semibold tracking-wide text-left text-gray-500 uppercase border-b dark:border-gray-700 bg-gray-50 dark:text-gray-400 dark:bg-gray-800">
                                        <th className="px-4 py-3">Word</th>
                                        <th className="px-4 py-3">Translation</th>
                                        <th className="px-4 py-3">Guessed Right</th>
                                        <th className="px-4 py-3">Guessed Wrong</th>
                                        <th className="px-4 py-3">Created At</th>
                                        <th className="px-4 py-3">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y dark:divide-gray-700 dark:bg-gray-800">
                                    {words.map((word) => {
                                        return <WordTableRow key={word.id} word={word} />;
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </main>
        );
    }
}

export default Words;
