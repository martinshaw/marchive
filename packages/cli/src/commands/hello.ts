import commander from 'commander';
import logger from 'logger';

import 'database';
import { Capture, SourceDomain } from 'database';

const hello = new commander.Command('hello');

hello
    .description('Hello world')
    .action(async () => {
        console.log('Hello world');

        const sourceDomain = await SourceDomain.create({
            name: 'Example',
            url: 'https://www.example.com/',
        });

        console.log(sourceDomain);
    });

export default hello;