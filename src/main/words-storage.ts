import { clipboard, globalShortcut, ipcMain, Notification } from "electron";
import * as fs from 'fs';
import { Word } from "../models/word.model";

class WordsStorage {
    private readonly firstIndex = 1;
    private readonly path: string = "words.json";

    private readonly notificationTitle: string = "Serenity.Words";
    private readonly notificationBody: string = "Added new word: ";

    private isRegisterClipboardReadShortcut: boolean = false;

    public async init() {
        this.initIpcListeners();

        //init words.json if it didn't create
        await this.readWordsAsync();

        this.registerClipboardReadShortcut();
    }

    public initIpcListeners() {
        ipcMain.on("get-words-channel", async (event, arg) => {
            const words = await this.readWordsAsync();
            event.reply("get-words-channel", words);
        });

        ipcMain.on("add-words-channel", async (event, arg) => {
            await this.writeWordsAsync(arg);
            event.reply("add-words-channel");
        });

        ipcMain.on("remove-words-channel", async (event, arg) => {
            await this.removeWordsAsync(arg);
            event.reply("remove-words-channel");
        });

        ipcMain.on("edit-words-channel", async (event, arg) => {
            await this.editWordsAsync(arg);
            event.reply("edit-words-channel");
        });
    }

    private registerClipboardReadShortcut() {
        this.isRegisterClipboardReadShortcut = globalShortcut.register('CommandOrControl+B', async () => {
            const originText = clipboard.readText();

            let newWord = new Word({
                id: 0,
                origin: originText,
                translation: null,
                guessedRightCount: 0,
                guessedWrongCount: 0,
                createdAt: new Date().toUTCString(),
            });

            await this.writeWordsAsync(newWord);

            new Notification({ title: this.notificationTitle, body: `${this.notificationBody}${originText}` }).show()
        })
    }

    private async readWordsAsync(): Promise<Word[]> {
        try {
            const buffer = fs.readFileSync(this.path);
            const json = buffer.toString();

            if (json === '') return [];

            return JSON.parse(json) as Word[];
        } catch(error) {
            await fs.promises.writeFile(this.path, JSON.stringify([]));
            return [];
        }
    }

    private async writeWordsAsync(newWord: Word): Promise<boolean> {
        try {
            let wordsObjects = await this.readWordsAsync();

            if (wordsObjects.length === 0) {
                newWord.id = this.firstIndex;
                wordsObjects.push(newWord);

                let resultJson = JSON.stringify(wordsObjects);
                await fs.promises.writeFile(this.path, resultJson);

                return true;
            }

            let ids = wordsObjects.map(i => i.id);
            let lastId = Math.max(...ids);
            newWord.id = lastId + 1;

            wordsObjects.push(newWord)

            let resultJson = JSON.stringify(wordsObjects);
            await fs.promises.writeFile(this.path, resultJson);

            return true;
        } catch(ex) {
            console.log(ex);
            return false;
        }
    }

    private async removeWordsAsync(idsArray: number[]): Promise<boolean> {
        try {
            let words = await this.readWordsAsync();
            let filteredWords = words.filter((i) => !idsArray.includes(i.id));

            let resultJson = JSON.stringify(filteredWords);
            await fs.promises.writeFile(this.path, resultJson);

            return true;
        } catch(ex) {
            console.log(ex);
            return false;
        }
    }

    private async editWordsAsync(updatedWords: Word[]): Promise<boolean> {
        try {
            let allWordsCollection = await this.readWordsAsync();
            let idsToUpdate = updatedWords.map(i => i.id);
            let notTouchedWordsCollection = allWordsCollection.filter((i) => !idsToUpdate.includes(i.id));

            notTouchedWordsCollection.push(...updatedWords);

            let resultJson = JSON.stringify(notTouchedWordsCollection);
            await fs.promises.writeFile(this.path, resultJson);

            return true;
        } catch(ex) {
            console.log(ex);
            return false;
        }
    }
}

export { WordsStorage };
