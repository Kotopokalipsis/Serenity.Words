import { WordsStorageManager } from "./words-storage-manager.service";

class ServiceStorage {
    public static wordsStorageManager: WordsStorageManager | null = null;
}

export { ServiceStorage };
