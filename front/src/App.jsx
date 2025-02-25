import './App.css';
import Editor from '@monaco-editor/react';
import { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [code, setCode] = useState({
    cpp: `//start coding here...
    
    #include <iostream>
    using namespace std;
    int main() {
        cout << "Hello, World!" << endl;
        return 0;
    }`,
    javascript: `//start coding here...
        
    function func() {
        console.log("Hello, World!");
    }
    
    func();`,
    java: `//start coding here...
        
    public class Main {
    
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
    }`,
    python: `#start coding here...
print("Hello, World!")
     `,
  });

  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [currentLang, setCurrentLang] = useState('cpp');

  //download code
  const downloadCode = () => {
    if (!code[currentLang]) return;

    // Define file extensions
    const extensions = {
      javascript: "js",
      python: "py",
      cpp: "cpp",
      java: "java",
    };

    const fileExtension = extensions[currentLang] || "txt";

    // Create and trigger download
    const blob = new Blob([code[currentLang]], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `code.${fileExtension}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  // Handle language change
  const handleChange = (event) => {
    const selectedLang = event.target.value;
    setCurrentLang(selectedLang);
  };

  const handleEditorChange = (value) => {
    setCode((prevCode) => ({
      ...prevCode,
      [currentLang]: value,
    }));
  };

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const handleRun = async () => {
    try {
      const response = await axios.post('http://localhost:3000/execute',
        { code: code[currentLang], language: currentLang, input: input + '\n' },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        });
      setOutput(response.data.output);
    } catch (error) {
      setOutput(`Error: ${error.response ? error.response.data.error : error.message}`);
    }
  };
  useEffect(() => {
    // setSend(code[currentLang])
    console.log(currentLang);
  }, [code, currentLang]);
  return (
    <div className="h-screen w-screen bg-black p-4">
      <div className="h-full w-full bg-zinc-900 rounded-lg border border-gray-900 shadow-[0_4px_8px_rgba(255,255,255,0.3)] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center bg-slate-700 p-3 rounded-t-lg">
          <div className="flex items-center space-x-4">
            <label htmlFor="languages" className="text-gray-300 text-sm font-medium">
              Programming Language
            </label>
            <select
              id="languages"
              value={currentLang}
              onChange={handleChange}
              className="w-32 px-2 py-1 bg-gray-700 text-white text-sm border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="cpp">C++</option>
              <option value="javascript">JavaScript</option>
              <option value="java">Java</option>
              <option value="python">Python</option>
            </select>
          </div>
          <button className="px-3 py-2 bg-rose-800 hover:bg-green-700 text-white rounded transition-colors" onClick={downloadCode}>Download Code</button>
          <button
            className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded transition-colors mr-3"
            onClick={handleRun}>
            Run
          </button>

        </div>

        {/* Main Content Area */}
        <div className="flex flex-1 h-[calc(100%-4rem)] overflow-hidden">
          {/* Editor Section - Left Side */}
          <div className="w-2/3 border-r border-gray-700">
            <Editor
              height="100%"
              language={currentLang}
              value={code[currentLang]}
              theme="vs-dark"
              onChange={handleEditorChange}
              options={{
                fontSize: 16,
                minimap: { enabled: true },
                scrollBeyondLastLine: false,
                automaticLayout: true,
                selectOnLineNumbers: true,
                suggestOnTriggerCharacters: true,
                quickSuggestions: { other: true, comments: true, strings: true },
              }}
            />
          </div>

          {/* Input/Output Section - Right Side */}
          <div className="w-1/3 flex flex-col p-4 space-y-4">
            {/* Input Box */}
            <div className="flex-1">
              <h3 className="text-white font-semibold mb-2">Input:</h3>
              <textarea
                className="w-full h-[calc(60%-2rem)] bg-gray-800 text-white border border-gray-700 rounded-md p-3 
                        focus:outline-none focus:ring-2 focus:ring-green-500 resize-none font-mono"
                placeholder="Enter input here"
                value={input}
                onChange={handleInputChange}
                style={{ whiteSpace: 'pre-wrap' }}
              />
            </div>

            {/* Output Box */}
            <div className="flex-1">
              <h3 className="text-white font-semibold mb-2">Output:</h3>
              <div
                className="w-full h-[calc(70%-2rem)] bg-gray-800 text-white border border-gray-700 rounded-md p-3 
                       overflow-auto font-mono"
              >
                <pre className="whitespace-pre-wrap text-left text-sm">{output}</pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
