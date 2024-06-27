import { createReadStream } from 'fs'

export class StreamLineReader {
    filePath: string

    constructor(filePath: string)
    {
        this.filePath = filePath
    }

    readLinesSync<T>(
        lineCallback: (line: string, value: T) => Promise<void>, 
        bufferStartCallback: () => Promise<T>,
        bufferEndCallback: (value: T, linesProcessed: number) => Promise<void>,
        endCallback: (linesProcessed: number) => Promise<void>
    ) {
        const reader = createReadStream(this.filePath)
        let linesProcessed = 0
        let partLine: string | undefined

        reader.on('open', () => {
            console.log('Started bulk insert into RavenDB')
        })

        reader.on('data', async (buffer: Buffer) => {
            reader.pause()

            const startResult = await bufferStartCallback()

            const bufferString = buffer.toString()
            const bufferLines = bufferString.split('\n')

            if (partLine != undefined) {
                bufferLines[0] = partLine + bufferLines[0] // add part line to first line if exists
            }
                

            if (bufferString.at(-1) != '\n')
                partLine = bufferLines.pop()
            else 
                partLine = bufferLines.pop() // In that case the last line would be = undefined

            for (let i=0; i<bufferLines.length; i++)
            {
                await lineCallback(bufferLines[i], startResult)
            }
            linesProcessed += bufferLines.length

            await bufferEndCallback(startResult, linesProcessed)
            reader.resume()
        })

        reader.on('end', () => {
            console.log('lines processed: ', linesProcessed)
            endCallback(linesProcessed)
        })

        reader.on('error', (error: Error) => {
            console.log('Error!!!')
            console.log('cause: ', error.cause)
            console.log('message: ', error.message)
            console.log('name: ', error.name)
        })
    }
}