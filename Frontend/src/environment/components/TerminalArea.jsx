import { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Terminal as TerminalIcon, Trash2 } from 'lucide-react';

/* eslint-disable no-control-regex */
const cleanTerminalText = (str) => {
  if (typeof str !== 'string') return str;
  // Remove ANSI escape sequences (colors, cursor moves, etc.)
  const ansiRegex = /[\u001b\u009b][[[()#;?]*([0-9]{1,4}(?:;\d{0,4})*)?[0-9A-OR-TZcf-ntqry=><~]/g;
  let cleaned = str.replace(ansiRegex, '');
  // Strip any remaining non‑printable control characters (NUL, SOH, etc.)
  cleaned = cleaned.replace(/[\u0000-\u001F\u007F]+/g, '');
  return cleaned;
};
/* eslint-enable no-control-regex */



const TerminalArea = ({ logs = [], activeTab = "terminal", setActiveTab = () => { }, socket }) => {
  const { interviewId } = useParams();
  const [terminalText, setTerminalText] = useState('*** Initializing Docker Sandbox Terminal Session... ***\n');
  const [inputValue, setInputValue] = useState('');
  const outputEndRef = useRef(null);

  // Auto-scroll terminal to bottom when new logs are added
  useEffect(() => {
    outputEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [terminalText]);

  // Handle WebSocket Terminal session initialization and listening
  useEffect(() => {
    if (!socket || !interviewId) return;

    // Send INIT message to backend to launch Docker exec bash shell
    const initTerminal = () => {
      if (socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify({
          namespace: "TERMINAL",
          event: "INIT",
          payload: { interviewId }
        }));
      }
    };

    if (socket.readyState === WebSocket.OPEN) {
      initTerminal();
    } else {
      socket.addEventListener("open", initTerminal);
    }

    const handleOutput = (e) => {
      const { text } = e.detail || {};
      if (text) {
        setTerminalText(prev => prev + "\n" + cleanTerminalText(text).replace(/\r\n/g, '\n'));
      }
    };

    const handleReady = () => {
      setTerminalText(prev => prev + "\r\n*** Terminal connection established. Ready for input. ***\r\n");
    };

    const handleError = (e) => {
      const { message } = e.detail || {};
      setTerminalText(prev => prev + `\r\n*** ERROR: ${message || 'Failed to connect'} ***\r\n`);
    };

    window.addEventListener("terminal-output", handleOutput);
    window.addEventListener("terminal-ready", handleReady);
    window.addEventListener("terminal-error", handleError);

    return () => {
      socket.removeEventListener("open", initTerminal);
      window.removeEventListener("terminal-output", handleOutput);
      window.removeEventListener("terminal-ready", handleReady);
      window.removeEventListener("terminal-error", handleError);
    };
  }, [socket, interviewId]);

  const handleInputKeyDown = (e) => {
    if (e.key === 'Enter') {
      const command = inputValue.trim();

      // Local client clear command
      if (command === 'clear') {
        setTerminalText('');
        setInputValue('');
        return;
      }

      if (socket && socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify({
          namespace: "TERMINAL",
          event: "INPUT",
          payload: { text: inputValue + "\n" }
        }));
      }
      setInputValue('');
    }
  };

  const handleClearTerminal = () => {
    setTerminalText('');
  };

  return (
    <div className="h-64 bg-[#08080c] border-t border-neutral-800/80 flex flex-col min-h-0 select-none">
      {/* Tab Headers */}
      <div className="h-10 border-b border-neutral-800/80 flex items-center justify-between px-6 bg-[#0a0a0f] flex-shrink-0">
        <div className="flex items-center gap-6 h-full">
          <button
            onClick={() => setActiveTab('terminal')}
            className={`h-full text-[11px] font-semibold uppercase tracking-wider relative transition-colors cursor-pointer
              ${activeTab === 'terminal'
                ? 'text-neutral-100'
                : 'text-neutral-500 hover:text-neutral-300'
              }`}
          >
            Terminal
            {activeTab === 'terminal' && (
              <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-indigo-500" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('output')}
            className={`h-full text-[11px] font-semibold uppercase tracking-wider relative transition-colors cursor-pointer
              ${activeTab === 'output'
                ? 'text-neutral-100'
                : 'text-neutral-500 hover:text-neutral-300'
              }`}
          >
            Output
            {activeTab === 'output' && (
              <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-indigo-500" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('problems')}
            className={`h-full text-[11px] font-semibold uppercase tracking-wider relative transition-colors cursor-pointer
              ${activeTab === 'problems'
                ? 'text-neutral-100'
                : 'text-neutral-500 hover:text-neutral-300'
              }`}
          >
            Problems (0)
            {activeTab === 'problems' && (
              <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-indigo-500" />
            )}
          </button>
        </div>

        {/* Action Controls */}
        {activeTab === 'terminal' && (
          <button
            onClick={handleClearTerminal}
            title="Clear Terminal Console"
            className="p-1 hover:bg-neutral-800/80 rounded transition-colors text-neutral-400 hover:text-neutral-200 cursor-pointer"
          >
            <Trash2 size={13} />
          </button>
        )}
      </div>

      {/* Terminal Content Screen */}
      <div className="flex-1 flex flex-col p-4 bg-[#060609] overflow-hidden">
        {activeTab === 'terminal' && (
          <div className="flex-1 flex flex-col min-h-0">
            {/* Scrollable Terminal Output */}
            <div className="flex-1 overflow-y-auto font-mono text-[13px] text-neutral-300 whitespace-pre-wrap leading-relaxed pr-2 scrollbar-thin select-text">
              {terminalText}
              <div ref={outputEndRef} />
            </div>

            {/* Interactive Shell Stdin Bar */}
            <div className="h-8 border-t border-neutral-900 bg-[#07070b] flex items-center px-3 gap-2 mt-2 rounded flex-shrink-0">
              <span className="text-neutral-500 font-mono text-[12px] select-none">$</span>
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleInputKeyDown}
                className="flex-1 bg-transparent border-none outline-none text-neutral-200 font-mono text-[13px] caret-indigo-500"
                placeholder="Type a command and press Enter..."
              />
              <span className="w-1.5 h-3 bg-indigo-500 animate-pulse flex-shrink-0" />
            </div>
          </div>
        )}

        {activeTab === 'output' && (
          <div className="flex-1 overflow-y-auto font-mono text-[13px] text-neutral-400 pl-4 py-2 select-text whitespace-pre-line">
            {logs && logs.length > 0 ? (
              logs.map((log, i) => <div key={i}>{log}</div>)
            ) : (
              <span className="italic text-neutral-500">[No active build compilation outputs]</span>
            )}
          </div>
        )}

        {activeTab === 'problems' && (
          <div className="flex-1 flex flex-col items-center justify-center text-neutral-500 text-xs italic select-none">
            <TerminalIcon size={24} className="text-neutral-700 mb-2" />
            No problems have been detected in the workspace.
          </div>
        )}
      </div>
    </div>
  );
};

export default TerminalArea;
