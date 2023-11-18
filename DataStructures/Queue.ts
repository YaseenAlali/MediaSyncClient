export class Queue<T> {
    storage: T[];
    maxSize: number;

    constructor(maxSize: number = 50, storage: T[] = []) {
        this.maxSize = maxSize;
        this.storage = storage;
    }

    /**
     * Clears the entire queue.
     * @memberof Queue
     */
    clearQueue(): void {
        this.storage = [];
    }

    /**
     * Returns the current size of the queue.
     * @memberof Queue
     * @returns {number} The size of the queue.
     */
    size(): number {
        return this.storage.length;
    }

    /**
     * Returns the element at the front of the queue without removing it.
     * @memberof Queue
     * @returns {T} The element at the front of the queue.
     */
    peek(): T | undefined {
        return this.storage[this.storage.length - 1];
    }

    /**
     * Removes and returns the element at the front of the queue.
     * @memberof Queue
     * @returns {T | undefined} The element at the front of the queue, or undefined if the queue is empty.
     */
    dequeue(): T | undefined {
        return this.storage.shift();
    }

    /**
     * Adds an element to the back of the queue.
     * @memberof Queue
     * @param {T} element - The element to be added to the queue.
     * @returns {void}
     */
    enqueue(element: T): void {
        if (this.size() < this.maxSize) {
            this.storage.push(element);
        } else {
            throw new Error('Queue is full. Cannot enqueue.');
        }
    }
}

