import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Explorer } from './components/Explorer';
import EditorArea from './components/EditorArea';
import TerminalArea from './components/TerminalArea';
import VideoFeedSidebar from './components/VideoFeedSidebar';
import useEnvironment from './hooks/useEnvironment';

const EnvironmentLayout = () => {
  useEnvironment();
  const { socket } = useOutletContext();

  const [activeFile, setActiveFile] = useState('src/App.jsx');
  const [terminalLogs, setTerminalLogs] = useState([
    'candidate@interview:~/sandbox$ npm run dev',
    '>> vite v6.0.0 ready in 235ms',
    '>> local: http://localhost:5173/',
  ]);
  const [activeTerminalTab, setActiveTerminalTab] = useState('terminal');

  const handleRunCode = (filename) => {
    setTerminalLogs(prev => [
      ...prev,
      `candidate@interview:~/sandbox$ node ${filename}`,
      `>> Running test suite for ${filename}...`,
      filename === 'solution.js' ? '✓ findDuplicate([2, 1, 3, 5, 3, 2]) outputs 3' : '✓ Module compiled and executed successfully.',
      'SUCCESS: All tests passed.'
    ]);
  };

  return (
    <div className="w-screen h-screen bg-[#07070b] text-neutral-200 flex flex-row overflow-hidden font-sans">
      {/* Left panel: Directory Tree Explorer */}
      <div className="w-60 h-full flex-shrink-0 border-r border-neutral-800/80 overflow-hidden flex flex-col">
        <Explorer
          activeFile={activeFile}
          onFileSelect={setActiveFile}
        />
      </div>

      {/* Middle panel: Code Editor and Terminal panels */}
      <div className="flex-1 flex flex-col min-w-0 h-full">
        {/* Code Editor */}
        <EditorArea
          activeFile={activeFile}
          onSelectFile={setActiveFile}
          onRunCode={handleRunCode}
        />

        {/* Terminal panel */}
        <TerminalArea
          logs={terminalLogs}
          activeTab={activeTerminalTab}
          setActiveTab={setActiveTerminalTab}
          socket={socket}
        />
      </div>

      {/* Right panel: Webcams feed slots & Chat container */}
      <VideoFeedSidebar />
    </div>
  );
};

export default EnvironmentLayout;