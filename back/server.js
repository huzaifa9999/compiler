const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const execute = require("./routes/execute");
const limiter = require('./middleware/rateLimiter');

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(limiter);
app.use('/', execute);
app.use((err, req, res, next) => {
    console.error("Global error handler:", err);
    res.status(500).json({ error: err.message || "Internal Server Error" });
});
//     const { code, language, input } = req.body;

//     const languageConfig = {
//         cpp: {
//             image: 'gcc:latest',
//             file: 'code.cpp',
//             compileCmd: 'g++ code.cpp -o output && ./output<input.txt',
//         },
//         javascript: {
//             image: 'node:latest',
//             file: 'code.js',
//             compileCmd: 'node code.js <input.txt',
//         },
//         java: {
//             image: 'openjdk:11',
//             file: 'Main.java',
//             compileCmd: 'javac Main.java && java Main<input.txt',
//         }, python: {
//             image: 'python:3.9',
//             file: 'code.py',
//             compileCmd: 'python code.py<input.txt',
//         }
//     };

//     const config = languageConfig[language];
//     if (!config) {
//         return res.status(400).json({ error: 'Unsupported language' });
//     }

//     const { image, file, compileCmd } = config;
//     let container;
//     let isTLE = false;
//     try {
//         container = await docker.createContainer({
//             Image: image,
//             Cmd: ['sh', '-c', `echo "${code.replace(/"/g, '\\"')}" > ${file} && echo "${input.replace(/"/g, '\\"')}" > input.txt && ${compileCmd}`],
//             AttachStdout: true,
//             AttachStderr: true,
//             // AttachStdin: true,
//             Tty: false,
//             HostConfig: {
//                 Memory: 512 * 1024 * 1024, // 512MB limit
//                 CpuShares: 512, // Limit CPU usage
//                 NetworkDisabled: true, // Disable network access
//             },
//         });

//         await container.start();
//         const logs = await container.logs({ stdout: true, stderr: true, follow: true });
//         let output = "";
//         logs.on('data', chunk => output += chunk.toString().replace(/\u0001.*?\u0000/g, '').replace(/\r\n/g, '\n').trim());

//         const timeout = setTimeout(async () => {
//             isTLE = true;
//             try {
//                 await container.stop();

//             }
//             catch (e) {
//                 res.json({ error: e.message });
//                 console.error('container stop error', e.message);
//             }
//         }, 5000);

//         await new Promise(resolve => logs.on('end', resolve));
//         clearTimeout(timeout);
//         if (isTLE) {
//             res.json({ output: 'Time Limit exceeded (TLE)' });
//         }
//         else
//             res.json({ output: output.trim() });

//     } catch (error) {
//         // res.json({ error: error.message });
//         res.status(500).json({ error: error.message });
//     } finally {
//         if (container) {
//             try {

//                 await container.remove();
//             }
//             catch (error) {
//                 console.error('Error during clean', error.message);
//             }
//         }
//     }
// });

app.listen(3000, () => console.log('Compiler backend running on port 3000 go check it'));

