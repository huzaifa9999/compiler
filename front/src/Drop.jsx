import  { useState } from 'react';

const Drop
 = () => {
  const [selectedOption, setSelectedOption] = useState("cpp");

  const handleChange = (event) => {
    setSelectedOption(event.target.value);
  };

  return (
    <div className="w-full max-w-xs mx-auto flex ">
    <label htmlFor="languages" className="block text-gray-300 text-sm font-medium mb-1">
       Programming Language
    </label>
    <select
      id="languages"
      value={selectedOption}
      onChange={handleChange}
      className="block w-[50%] px-1 py-1 bg-gray-700 text-white text-sm border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
    >
      <option value="cpp">C++</option>
      <option value="js">JavaScript</option>
      <option value="java">Java</option>
    </select>
  </div>
  );
};

export default Drop
;
