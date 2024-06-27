import { createReadStream } from 'fs';
export class BulkInsertFromReadStreamOperation {
    reader;
    bulkInsert;
    events;
    constructor(filePath, bulkInsertOperation) {
        this.reader = createReadStream(filePath);
        this.bulkInsert = bulkInsertOperation;
        this.events = {
            'line': () => {
                throw new Error('Listen to line to bulk insert.');
            },
            'end': () => {
                console.log('Bulk operation ended.');
            }
        };
    }
    bulkInsertSync() {
        let linesProcessed = 0;
        let linesStored = 0;
        let partLine;
        let finishedProcessingLines = false;
        this.bulkInsert.on('progress', async (stats) => {
            linesStored = stats.progress.documentsProcessed;
            console.log('recived progress: ', linesStored);
            console.log('lines processed: ', linesProcessed);
            console.log('Total: ', stats.progress.total);
            console.log('Batch count: ', stats.progress.batchCount);
            if (linesStored > 0 && linesStored == linesProcessed) {
                if (finishedProcessingLines) {
                    // await this.bulkInsert.finish()
                    this.events.end(stats.progress.documentsProcessed);
                }
                else
                    this.reader.resume();
            }
        });
        this.reader.on('open', () => {
            console.log('Started bulk insert into RavenDB');
        });
        this.reader.on('data', async (buffer) => {
            this.reader.pause();
            const { bufferLines, newPartLine } = this.bufferToLines(buffer, partLine);
            partLine = newPartLine;
            for (let i = 0; i < bufferLines.length; i++) {
                const { entity, id } = this.events.line(bufferLines[i]);
                await this.bulkInsert.store(entity, id);
            }
            linesProcessed += bufferLines.length;
        });
        this.reader.on('end', () => {
            finishedProcessingLines = true;
            console.log('END lines processed: ', linesProcessed);
        });
        this.reader.on('error', (error) => {
            console.log('Error!!!');
            console.log('cause: ', error.cause);
            console.log('message: ', error.message);
            console.log('name: ', error.name);
        });
    }
    bufferToLines(buffer, partLine) {
        const bufferString = buffer.toString();
        const bufferLines = bufferString.split('\n');
        if (partLine != undefined) {
            bufferLines[0] = partLine + bufferLines[0]; // add part line to first line if exists
        }
        return {
            bufferLines: bufferLines,
            newPartLine: bufferLines.pop() // last line will allways be eighther empty or not full
        };
    }
    onLine(callback) {
        this.events.line = callback;
    }
    onEnd(callback) {
        this.events.end = callback;
    }
    fakeStoreLine(line) {
        const user = JSON.parse(line).firstName;
        // console.log('START Store: ', user)
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // console.log('END Store: ', user)
                resolve();
            }, 1);
        });
    }
    fakeWaitForBulkInsert(linesProcessed) {
        console.log('WAIT For bulk insert, lines processed: ', linesProcessed);
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                console.log('END WAIT For bulk insert, lines proccessed ', linesProcessed);
                resolve();
            }, 5000);
        });
    }
}
