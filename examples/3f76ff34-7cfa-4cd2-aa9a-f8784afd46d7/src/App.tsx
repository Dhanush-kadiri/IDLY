import React, { useState } from 'react';
import { KeyRound, ArrowRight } from 'lucide-react';

function App() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  const encryptName = (text: string) => {
    return text
      .split('')
      .map(char => char.charCodeAt(0))
      .join('');
  };

  const handleEncrypt = () => {
    const encrypted = encryptName(input);
    setOutput(encrypted);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="flex items-center gap-2 mb-6">
          <KeyRound className="w-6 h-6 text-indigo-600" />
          <h1 className="text-2xl font-bold text-gray-800">ASCII 加密工具</h1>
        </div>

        <div className="space-y-6">
          <div>
            <label htmlFor="input" className="block text-sm font-medium text-gray-700 mb-2">
              输入文字
            </label>
            <input
              id="input"
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
              placeholder="请输入要加密的文字..."
            />
          </div>

          <button
            onClick={handleEncrypt}
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
          >
            加密 <ArrowRight className="w-4 h-4" />
          </button>

          {output && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                加密结果
              </label>
              <div className="w-full px-4 py-3 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-lg font-mono break-all">{output}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;