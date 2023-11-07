import { Subject, Subscription, timer } from "rxjs";
import { Word } from "../../models/word.model";

export type OnWordCollectionRefreshedData = { hasUpdate: boolean };
export type OnWordEditedData = { forceUpdate: boolean };

class WordsStorageManager {
    private _onWordAdded = new Subject<boolean>();
    public onWordAdded$ = this._onWordAdded.asObservable();

    private _onWordRemoved = new Subject<boolean>();
    public onWordRemoved$ = this._onWordRemoved.asObservable();

    private _onWordEdited = new Subject<OnWordEditedData>();
    public onWordEdited$ = this._onWordEdited.asObservable();

    private _onWordCollectionRefreshed = new Subject<OnWordCollectionRefreshedData>();
    public onWordCollectionRefreshed$ = this._onWordCollectionRefreshed.asObservable();

    private shortPullingPeriod: number = 1000;
    private _refreshShortPullingSubscription: Subscription | null = null;

    public _words: Word[] = [];

    public get words(): Word[] {
        return this._words.sort((a: Word, b: Word) => {
            return a.id - b.id;
        });
    }

    private hasForceUpdate: boolean = false;

    public initIpcRendererListeners() {
        window.electron.ipcRenderer.on("get-words-channel", (arg: any) => {
            let refreshedCollection = arg as Word[];
            if (this._words.length !== refreshedCollection.length || this.hasForceUpdate) {
                this._words = refreshedCollection;
                this._onWordCollectionRefreshed.next({hasUpdate: true});

                this.hasForceUpdate = false;

                return;
            }

            this._onWordCollectionRefreshed.next({hasUpdate: false});
        })

        window.electron.ipcRenderer.on("add-words-channel", (arg: any) => {
            this.onWordAdded();
        })

        window.electron.ipcRenderer.on("remove-words-channel", (arg: any) => {
            this.onWordRemoved();
        })

        window.electron.ipcRenderer.on("edit-words-channel", (arg: any) => {
            this.onWordEdited();
        })

        this.onWordAdded$.subscribe(() => {
            this.sendRefreshWordsCollection();
        })

        this.onWordRemoved$.subscribe(() => {
            this.sendRefreshWordsCollection();
        })

        this.onWordEdited$.subscribe((data: OnWordEditedData) => {
            this.hasForceUpdate = data.forceUpdate;
            this.sendRefreshWordsCollection();
        })
    }

    public startRefreshShortPulling() {
        this._refreshShortPullingSubscription = timer(0, this.shortPullingPeriod).subscribe((_) => {
            this.sendRefreshWordsCollection();
        });
    }

    public stopRefreshShortPulling() {
        this._refreshShortPullingSubscription?.unsubscribe();
    }

    public sendRefreshWordsCollection() {
        window.electron.ipcRenderer.sendMessage("get-words-channel");
    }

    public sendAddToCollection(originText: string, translationText: string | null) {
        let newWord = new Word({
            id: 0,
            origin: originText,
            translation: translationText,
            guessedRightCount: 0,
            guessedWrongCount: 0,
            createdAt: new Date().toUTCString(),
        });

        window.electron.ipcRenderer.sendMessage("add-words-channel", newWord);
    }

    public sendRemoveFromCollection(idsArray: number[]) {
        window.electron.ipcRenderer.sendMessage("remove-words-channel", idsArray);
    }

    public sendEditCollection(words: Word[]) {
        window.electron.ipcRenderer.sendMessage("edit-words-channel", words);
    }

    private onWordAdded() {
        this._onWordAdded.next(true);
    }

    private onWordRemoved() {
        this._onWordRemoved.next(true);
    }

    private onWordEdited() {
        this._onWordEdited.next({forceUpdate: true});
    }
}

export { WordsStorageManager };
