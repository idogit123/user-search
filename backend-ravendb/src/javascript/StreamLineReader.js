import { createReadStream } from 'fs';
export class StreamLineReader {
    filePath;
    constructor(filePath) {
        this.filePath = filePath;
    }
    readLinesSync(lineCallback, bufferStartCallback, bufferEndCallback, endCallback) {
        const reader = createReadStream(this.filePath);
        let linesProcessed = 0;
        let partLine;
        reader.on('open', () => {
            console.log('Started bulk insert into RavenDB');
        });
        reader.on('data', async (buffer) => {
            reader.pause();
            const startResult = await bufferStartCallback();
            const bufferString = buffer.toString();
            const bufferLines = bufferString.split('\n');
            if (partLine != undefined) {
                bufferLines[0] = partLine + bufferLines[0]; // add part line to first line if exists
            }
            if (bufferString.at(-1) != '\n')
                partLine = bufferLines.pop();
            else
                partLine = bufferLines.pop(); // In that case the last line would be = undefined
            for (let i = 0; i < bufferLines.length; i++) {
                await lineCallback(bufferLines[i], startResult);
            }
            linesProcessed += bufferLines.length;
            await bufferEndCallback(startResult, linesProcessed);
            reader.resume();
        });
        reader.on('end', () => {
            console.log('lines processed: ', linesProcessed);
            endCallback(linesProcessed);
        });
        reader.on('error', (error) => {
            console.log('Error!!!');
            console.log('cause: ', error.cause);
            console.log('message: ', error.message);
            console.log('name: ', error.name);
        });
    }
}
