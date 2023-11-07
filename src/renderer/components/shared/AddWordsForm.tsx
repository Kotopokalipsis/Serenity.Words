import { Component, ReactNode } from "react";
import { Check } from 'react-feather';
import { ServiceStorage } from "../../services/service-storage.service";

type AddWordsFormState = { originText: string, translationText: string, errorText: string };

const emptyErrorText = "Fields can not be empty";

class AddWordsForm extends Component<{}, AddWordsFormState> {
    constructor(props: any) {
        super(props);

        this.state = {
            originText: "",
            translationText: "",
            errorText: "",
        };

        this.addWord = this.addWord.bind(this);
    }

    async addWord() {
        if (this.state.originText === "" || this.state.translationText === "") {
            this.setState(prevState => ({ errorText: emptyErrorText }));
            return;
        }

        ServiceStorage.wordsStorageManager!.sendAddToCollection(this.state.originText, this.state.translationText);

        this.setState(prevState => ({ originText: "", translationText: "", errorText: "" }));
    }

    render(): ReactNode {
        return (
            <div className="mt-2">
                <div className="px-4 py-3 mb-2 bg-white rounded-lg shadow-md dark:bg-gray-700">
                    <label className="block text-sm">
                        <input
                            value={this.state.originText}
                            className="block w-full p-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input"
                            placeholder="Type origin word"
                            onChange={ (event) => this.setState(prevState => ({ originText: event.target.value, translationText: prevState.translationText })) }
                        />
                    </label>
                </div>
                <div className="px-4 py-3 mb-2 bg-white rounded-lg shadow-md dark:bg-gray-700">
                    <label className="block text-sm">
                        <input
                            value={this.state.translationText}
                            className="block w-full p-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input"
                            placeholder="Type translation word"
                            onChange={ (event) => this.setState(prevState => ({ originText: prevState.originText, translationText: event.target.value })) }
                        />
                    </label>
                </div>
                {
                    this.state.errorText !== ""
                        ?
                            (
                                <div className="flex justify-center mb-2">
                                    <span className="text-xs text-red-600 dark:text-red-400">
                                        {this.state.errorText}
                                    </span>
                                </div>
                            )
                        : null
                }
                <div className="flex flex-col flex-wrap mb-8 space-y-4">
                    <button
                        className="flex items-center justify-between px-4 py-2 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-purple-800 border border-transparent rounded-lg active:bg-purple-400 hover:bg-purple-500"
                        onClick={ (event: React.MouseEvent<HTMLElement>) => { this.addWord() } }
                    >
                        <span className="mr-2">Add</span>
                        <Check className="flex-col" size={18}/>
                    </button>
                </div>
            </div>
        );
    }
}

export default AddWordsForm;
