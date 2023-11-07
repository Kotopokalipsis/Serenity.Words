class Word {
    id!: number;
    origin!: string;
    translation!: string | null;
    guessedRightCount!: number;
    guessedWrongCount!: number;
    createdAt!: string;

    constructor(obj?: Word) {
        if (obj) {
            Object.assign(this, obj);
        }
    }
}

export { Word };
