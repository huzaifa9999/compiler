import './App.css';
import Editor from '@monaco-editor/react';
import { useState, useEffect } from 'react';

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
    python:`#start coding here...
     print("Hello, World!")
     `,
  });

  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [currentLang, setCurrentLang] = useState('cpp');

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

  const handleRun = () => {
    setOutput(`Output: ${input}`);
  };
    useEffect(() => {
    console.log(code[currentLang]);
  }, [input,code,currentLang]);
  return (
    <div className="h-screen w-screen bg-black flex justify-center items-center">
      <div className="h-[95vh] w-[95vw] bg-zinc-900 rounded-lg border border-gray-900 shadow-[0_4px_8px_rgba(255,255,255,0.3)] p-4">
        {/* Header */}
        <div className="flex justify-between items-center bg-slate-700 p-3 rounded-t-lg">
          <div className="text-lg font-bold text-white">
            <div className="w-full max-w-xs mx-auto flex">
              <label htmlFor="languages" className="block text-gray-300 text-sm font-medium mb-1">
                Programming Language
              </label>
              <select
                id="languages"
                value={currentLang}
                onChange={handleChange}
                className="block w-[50%] px-1 py-1 bg-gray-700 text-white text-sm border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="cpp">C++</option>
                <option value="javascript">JavaScript</option>
                <option value="java">Java</option>
                <option value="python">Python</option>
              </select>
            </div>
          </div>
          <div className="flex space-x-1">
            <button className="px-4 py-1 bg-green-600 hover:bg-green-700 text-white rounded" onClick={handleRun}>
              Run
            </button>
          </div>
        </div>

        {/* Code Editor */}
        <div className="h-80 border border-gray-600 rounded-b-lg shadow-inner border-t-2">
          <Editor
            height="100%"
            language={currentLang} 
            value={code[currentLang]} 
            theme="vs-dark"
            onChange={handleEditorChange}
          />
        </div>

        <div className="flex mt-4 space-x-4">
          {/* Input */}
          <div className="flex-1">
            <h3 className="text-white font-semibold mb-2">Input:</h3>
            <textarea
              className="w-full h-24 bg-gray-800 text-white border border-gray-700 rounded p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Enter input here"
              value={input}
              onChange={handleInputChange}
            ></textarea>
          </div>

          {/* Output */}
          <div className="flex-1">
            <h3 className="text-white font-semibold mb-2">Output:</h3>
            <div className="w-full h-24 bg-gray-800 text-white border border-gray-700 rounded p-2">
              <pre className="whitespace-pre-wrap">{output}</pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
