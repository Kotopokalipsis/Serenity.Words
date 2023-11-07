import Sidebar from "./components/shared/Sidebar";
import SearchBar from "./components/shared/SearchBar";
import Words from "./components/pages/words/Words.page";

function App() {
    return (
        <div className="App">
            <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
                <Sidebar />
                <div className="flex flex-col flex-1 w-full">
                    <SearchBar />
                    <Words />
                </div>
            </div>
        </div>
    );
}

export default App;