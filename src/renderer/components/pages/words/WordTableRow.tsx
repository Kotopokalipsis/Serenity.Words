import { Component, ReactNode } from "react";
import { Word } from "../../../../models/word.model";
import { Trash, Edit2, Check, X } from "react-feather";
import { ServiceStorage } from "../../../services/service-storage.service";
import moment from "moment";

type WordTableRowProp = { word: Word };
type WordTableRowState = {
    word: Word;
    wordBeforeEdit: Word;
    isEditRow: boolean;
    editOriginErrorText: string;
    editTranslationErrorText: string;
};

const emptyErrorText = "Field can not be empty";

class WordTableRow extends Component<WordTableRowProp, WordTableRowState> {
    constructor(props: WordTableRowProp) {
        super(props);

        this.state = {
            word: props.word,
            wordBeforeEdit: props.word,
            isEditRow: false,
            editOriginErrorText: "",
            editTranslationErrorText: "",
        };

        this.onClickRemoveWord = this.onClickRemoveWord.bind(this);
        this.onClickEditWord = this.onClickEditWord.bind(this);
        this.onClickConfirmEditWord = this.onClickConfirmEditWord.bind(this);
        this.onClickCancelEditWord = this.onClickCancelEditWord.bind(this);
    }

    onClickRemoveWord(id: number) {
        ServiceStorage.wordsStorageManager?.sendRemoveFromCollection([id]);
    }

    onClickEditWord(id: number) {
        let wordBeforeEdit = { ...this.state.word };
        this.setState((prevState) => ({ isEditRow: true, wordBeforeEdit: wordBeforeEdit }));
    }

    onClickConfirmEditWord() {
        let originIsEmpty = false;
        let translationIsEmpty = false;
        if (!this.state.word.origin || this.state.word.origin === "") {
            this.setState((prevState) => ({ editOriginErrorText: emptyErrorText }));
            originIsEmpty = true;
        }

        if (!this.state.word.translation || this.state.word.translation === "") {
            this.setState((prevState) => ({ editTranslationErrorText: emptyErrorText }));
            translationIsEmpty = true;
        }

        if (originIsEmpty || translationIsEmpty) return;

        ServiceStorage.wordsStorageManager?.sendEditCollection([this.state.word]);
        this.setState((prevState) => ({ isEditRow: false }));
    }

    onClickCancelEditWord() {
        this.setState((prevState) => ({
            isEditRow: false,
            word: this.state.wordBeforeEdit,
            editOriginErrorText: "",
            editTranslationErrorText: "",
        }));
    }

    render(): ReactNode {
        return (
            <tr className="text-gray-700 dark:text-gray-400">
                <td className="px-4 py-3">
                    {!this.state.isEditRow ? (
                        <div className="flex items-center text-sm py-4">
                            <div>
                                <p className="font-semibold">{this.state.word.origin}</p>
                            </div>
                        </div>
                    ) : (
                        <div className="px-4 py-3 bg-white rounded-lg shadow-md dark:bg-gray-700">
                            <label className="block text-sm">
                                <input
                                    value={this.state.word.origin}
                                    className="block w-full text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input"
                                    placeholder={
                                        this.state.editOriginErrorText !== "" &&
                                        this.state.isEditRow
                                            ? this.state.editOriginErrorText
                                            : "Type origin word"
                                    }
                                    onChange={(event) => {
                                        let word = this.state.word;
                                        word.origin = event.target.value;
                                        this.setState((prevState) => ({ word: word }));
                                    }}
                                />
                            </label>
                        </div>
                    )}
                </td>
                <td className="px-4 py-3 text-sm">
                    {!this.state.isEditRow ? (
                        <div className="flex items-center text-sm py-4">
                            <div>
                                <p>{this.state.word.translation}</p>
                            </div>
                        </div>
                    ) : (
                        <div className="px-4 py-3 bg-white rounded-lg shadow-md dark:bg-gray-700">
                            <label className="block text-sm">
                                <input
                                    value={
                                        this.state.word.translation
                                            ? this.state.word.translation
                                            : ""
                                    }
                                    className="block w-full text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input"
                                    placeholder={
                                        this.state.editTranslationErrorText !== "" &&
                                        this.state.isEditRow
                                            ? this.state.editTranslationErrorText
                                            : "Type translation word"
                                    }
                                    onChange={(event) => {
                                        let word = this.state.word;
                                        word.translation = event.target.value;
                                        this.setState((prevState) => ({ word: word }));
                                    }}
                                />
                            </label>
                        </div>
                    )}
                </td>
                <td className="px-4 py-3 text-xs">
                    <span className="px-2 py-1 font-semibold leading-tight text-green-700 bg-green-100 rounded-full dark:bg-green-700 dark:text-green-100">
                        {this.state.word.guessedRightCount}
                    </span>
                </td>
                <td className="px-4 py-3 text-xs">
                    <span className="px-2 py-1 font-semibold leading-tight text-green-700 bg-red-100 rounded-full dark:bg-red-900 dark:text-green-100">
                        {this.state.word.guessedWrongCount}
                    </span>
                </td>
                <td className="px-4 py-3 text-sm">
                    {moment(this.state.word.createdAt).format("DD.M.YYYY hh:mm")}
                </td>
                <td className="px-4 py-3">
                    {!this.state.isEditRow ? (
                        <button
                            className="float-left flex items-center justify-between p-2 mr-2 text-sm font-medium leading-5 text-white transition-colors duration-150 border border-transparent rounded-lg active:bg-purple-400 hover:bg-purple-500"
                            onClick={(event: React.MouseEvent<HTMLElement>) => {
                                this.onClickEditWord(this.state.word.id);
                            }}
                        >
                            <Edit2 className="flex-col" size={18} />
                        </button>
                    ) : (
                        <button
                            className="float-left flex items-center justify-between p-2 mr-2 text-sm font-medium leading-5 text-white transition-colors duration-150 border border-transparent rounded-lg active:bg-purple-400 hover:bg-purple-500"
                            onClick={(event: React.MouseEvent<HTMLElement>) => {
                                this.onClickConfirmEditWord();
                            }}
                        >
                            <Check className="flex-col" size={18} />
                        </button>
                    )}
                    {!this.state.isEditRow ? (
                        <button
                            className="flex items-center justify-between p-2 text-sm font-medium leading-5 text-white transition-colors duration-150 border border-transparent rounded-lg active:bg-red-600 hover:bg-red-700"
                            onClick={(event: React.MouseEvent<HTMLElement>) => {
                                this.onClickRemoveWord(this.state.word.id);
                            }}
                        >
                            <Trash className="flex-col" size={18} />
                        </button>
                    ) : (
                        <button
                            className="float-left flex items-center justify-between p-2 mr-2 text-sm font-medium leading-5 text-white transition-colors duration-150 border border-transparent rounded-lg active:bg-purple-400 hover:bg-purple-500"
                            onClick={(event: React.MouseEvent<HTMLElement>) => {
                                this.onClickCancelEditWord();
                            }}
                        >
                            <X className="flex-col" size={18} />
                        </button>
                    )}
                </td>
            </tr>
        );
    }
}

export default WordTableRow;
