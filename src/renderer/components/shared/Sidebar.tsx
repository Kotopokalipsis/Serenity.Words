import { Component, ReactNode } from "react";
import AddWordsForm from "./AddWordsForm";
import { Plus, X } from 'react-feather';

type SidebarState = { isClickedAddWords: boolean };

class Sidebar extends Component<{}, SidebarState> {
    constructor(props: any) {
        super(props);

        this.state = {
            isClickedAddWords: false,
        };

        this.addClicked = this.addClicked.bind(this);
    }

    addClicked() {
        this.setState(prevState => ({ isClickedAddWords: !prevState.isClickedAddWords }));
    }

    render(): ReactNode {
        return (
            <aside className="z-20 hidden w-64 overflow-y-auto bg-white dark:bg-gray-800 md:block flex-shrink-0">
                <div className="py-4 text-gray-500 dark:text-gray-400">
                    <div className="ml-6 flex items-center text-lg font-bold text-gray-800 dark:text-gray-200">
                        <img className="h-12 w-12 mr-2" src="serenity-words-icon.svg" alt="" />
                        <span>Serenity.Words</span>
                    </div>
                    <ul className="mt-6">
                        <li className="relative px-6 py-3">
                            <span
                                className="absolute inset-y-0 left-0 w-1 bg-purple-600 rounded-tr-lg rounded-br-lg"
                                aria-hidden="true"
                            ></span>
                            <a
                                className="inline-flex items-center w-full text-sm font-semibold text-gray-800 transition-colors duration-150 hover:text-gray-800 dark:hover:text-gray-200 dark:text-gray-100"
                                href="index.html"
                            >
                                <svg
                                    className="w-5 h-5"
                                    aria-hidden="true"
                                    fill="none"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
                                </svg>
                                <span className="ml-4">Words</span>
                            </a>
                        </li>
                    </ul>
                    <div className="px-6 my-6">
                        <button
                            className="flex items-center justify-between w-full px-4 py-2 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-purple-700 border border-transparent rounded-lg active:bg-purple-700 hover:bg-purple-800"
                            onClick={(event: React.MouseEvent<HTMLElement>) => { this.addClicked() }}
                        >
                            Add words
                            <span className="ml-2" aria-hidden="true">
                                { !this.state.isClickedAddWords ? (<Plus size={18}/>) : (<X size={18}/>) }
                            </span>
                        </button>
                    </div>
                    { this.state.isClickedAddWords
                        ?
                        <div className="px-6 my-6">
                            <AddWordsForm/>
                        </div>
                        : null
                    }
                </div>
            </aside>
        );
    }
}

export default Sidebar;
