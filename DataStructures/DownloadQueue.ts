import { Queue } from "./Queue";


class DownloadQueue extends Queue<string>{
    constructor(maxSize: number = 50, storage: string[] = []) {
        super(maxSize, storage);
    }
}
