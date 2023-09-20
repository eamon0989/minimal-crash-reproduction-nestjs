# Minimal crash reproduction:

This repo serves as a minimal reproduction of an issue that allows someone to craft a malicious request that causes busboy to throw an unhandled error that crashes the server.

Run `yarn` to install dependencies.

Run `yarn run start` to start the server.

I've added 2 separate ways to reproduce the issue:

1. From the root folder, open another terminal tab and run the command `cat crash-file-request.raw | nc localhost 3000`.
The app should crash with the following output:
```
yarn run start
yarn run v1.22.19
$ nest start
[Nest] 6980  - 09/20/2023, 5:09:36 PM     LOG [NestFactory] Starting Nest application...
[Nest] 6980  - 09/20/2023, 5:09:36 PM     LOG [InstanceLoader] AppModule dependencies initialized +9ms
[Nest] 6980  - 09/20/2023, 5:09:36 PM     LOG [RoutesResolver] AppController {/}: +9ms
[Nest] 6980  - 09/20/2023, 5:09:36 PM     LOG [RouterExplorer] Mapped {/, GET} route +2ms
[Nest] 6980  - 09/20/2023, 5:09:36 PM     LOG [RouterExplorer] Mapped {/upload, POST} route +0ms
[Nest] 6980  - 09/20/2023, 5:09:36 PM     LOG [NestApplication] Nest application successfully started +1ms

/Users/eamon/work/minimum-reproduction-crash/node_modules/busboy/lib/types/multipart.js:588
      return cb(new Error('Unexpected end of form'));
                ^
Error: Unexpected end of form
    at Multipart._final (/Users/eamon/work/minimum-reproduction-crash/node_modules/busboy/lib/types/multipart.js:588:17)
    at callFinal (node:internal/streams/writable:698:12)
    at prefinish (node:internal/streams/writable:710:7)
    at finishMaybe (node:internal/streams/writable:720:5)
    at Multipart.Writable.end (node:internal/streams/writable:634:5)
    at IncomingMessage.onend (node:internal/streams/readable:705:10)
    at Object.onceWrapper (node:events:628:28)
    at IncomingMessage.emit (node:events:514:28)
    at endReadableNT (node:internal/streams/readable:1359:12)
    at processTicksAndRejections (node:internal/process/task_queues:82:21)
error Command failed with exit code 1.
info Visit https://yarnpkg.com/en/docs/cli/run for documentation about this command.
```

2. Run `node malformed-request.mjs` from the terminal.
The app should crash with the same output as point 1 above.

## Notes:

I have not been able to reproduce this issue using `curl` or `postman`. My guess as to why is that as they are higher level tools, they somehow ensure that the request is properly formatted. But as `nc` and `http:node` are lower level, they allow malformed requests to be sent.

I originally ran into this issue when pen-testing our application. I think https://github.com/nestjs/nest/issues/9489 may be the same issue, but it was closed as it didn't include any way to reproduce the issue.