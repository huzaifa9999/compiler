const express = require('express');
const Docker = require('dockerode');
const bodyParser = require('body-parser');
const cors = require('cors');

const docker = new Docker();  // Make sure Docker is running
const app = express();
app.use(cors());
app.use(bodyParser.json());
app.get('/', (req, res) => {
    res.send('Welcome to the online compiler!, we are testing and almost done');
});


app.post('/execute', async (req, res) => {
    const { code, language, input } = req.body;

    const languageConfig = {
        cpp: {
            image: 'gcc:latest', 
            file: 'code.cpp',
            compileCmd: 'g++ code.cpp -o output && ./output<input.txt',
        },
        javascript: {
            image: 'node:latest',
            file: 'code.js',
            compileCmd: 'node code.js <input.txt',
        },
        java: {
            image: 'openjdk:11',
            file: 'Main.java',
            compileCmd: 'javac Main.java && java Main<input.txt',
        }, python: {
            image: 'python:3.9',
            file: 'code.py',
            compileCmd: 'python code.py<input.txt',
        }
    };

    const config = languageConfig[language];
    if (!config) {
        return res.status(400).json({ error: 'Unsupported language' });
    }

    const { image, file, compileCmd } = config;
    let container;
    try {
        container = await docker.createContainer({
            Image: image,
            Cmd: ['sh', '-c', `echo "${code.replace(/"/g, '\\"')}" > ${file} && echo "${input.replace(/"/g, '\\"')}" > input.txt && ${compileCmd}`],
            AttachStdout: true,
            AttachStderr: true,
            AttachStdin:true,
            Tty:false
        });

        await container.start();
        const logs = await container.logs({ stdout: true, stderr: true,AttachStdin:true, follow: true });
        let output ="";
        let errorout = "";
        
        logs.on('data', chunk => output += chunk.toString().replace(/\u0001.*?\u0000/g, '')
        .replace(/\r\n/g, '\n').trim());
        await new Promise(resolve => logs.on('end', resolve));
        res.json({ output: output.trim() });
        console.log(output.trim());
    } catch (error) {
        res.json({ error: error.message });
        res.status(500).json({ error: error.message });
    } finally {
        if (container) {
            try {

                await container.remove();
            }
            catch (error) {
                console.error('Error during clean', error.message);
            }
        }
    }
});

app.listen(3000, () => console.log('Compiler backend running on port 3000 go check it'));
// const express = require('express');
// const Docker = require('dockerode');
// const bodyParser = require('body-parser');
// const cors = require('cors');

// const docker = new Docker();
// const app = express();
// app.use(cors());
// app.use(bodyParser.json());

// app.get('/', (req, res) => {
//     res.send('Welcome to the online compiler!');
// });

// app.post('/execute', async (req, res) => {
//     const { code, language, input } = req.body;

//     const languageConfig = {
//         cpp: {
//             image: 'gcc:latest',
//             file: 'code.cpp',
//             compileCmd: 'g++ code.cpp -o output && ./output < input.txt',
//         },
//         javascript: {
//             image: 'node:latest',
//             file: 'code.js',
//             compileCmd: 'node code.js',
//         },
//         java: {
//             image: 'openjdk:11',
//             file: 'Main.java',
//             compileCmd: 'javac Main.java && java Main < input.txt',
//         },
//     };

//     const config = languageConfig[language];
//     if (!config) {
//         return res.status(400).json({ error: 'Unsupported language' });
//     }

//     const { image, file, compileCmd } = config;
//     let container;
//     try {
//         container = await docker.createContainer({
//             Image: image,
//             Tty: false,
//             AttachStdout: true,
//             AttachStderr: true,
//             Cmd: ['sh', '-c', `echo "${code.replace(/"/g, '\\"')}" > ${file} && echo "${input.replace(/"/g, '\\"')}" > input.txt && ${compileCmd}`],
//         });

//         await container.start();
//         const logs = await container.logs({ stdout: true, stderr: true, follow: true });
//         let output = '';
//         logs.on('data', chunk => output += chunk.toString('utf-8'));

//         await new Promise(resolve => logs.on('end', resolve));
//         res.json({ output: output.trim() });
//         console.log(output);
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     } finally {
//         if (container) {
//             try {
//                 await container.remove();
//             } catch (cleanupError) {
//                 console.error('Error cleaning up container:', cleanupError.message);
//             }
//         }
//     }
// });

// app.listen(3000, () => console.log('Compiler backend running on port 3000'));
