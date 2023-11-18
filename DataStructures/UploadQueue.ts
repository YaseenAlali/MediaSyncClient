import { Queue } from "./Queue";

class UploadQueue extends Queue<string>{
    constructor(maxSize: number = 50, storage: string[] = []) {
        super(maxSize, storage);
    }
}