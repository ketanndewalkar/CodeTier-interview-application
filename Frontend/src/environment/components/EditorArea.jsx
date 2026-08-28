import { useState, useEffect, useRef } from 'react';
import {
  Terminal as TerminalIcon,
  Play,
  Square,
  LogOut,
  Check,
  ChevronDown,
  X,
  Eye
} from 'lucide-react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import { fetchWorkspaceFile, updateWorkspaceFile } from '../functions/explorer.function';
import { useWorkspaceStore } from '../../store/workspace.store';
import toast from 'react-hot-toast';

const getEditorLanguage = (filename) => {
  if (!filename) return 'javascript';
  if (filename.endsWith('.js') || filename.endsWith('.jsx')) return 'javascript';
  if (filename.endsWith('.ts') || filename.endsWith('.tsx')) return 'typescript';
  if (filename.endsWith('.html')) return 'html';
  if (filename.endsWith('.css')) return 'css';
  if (filename.endsWith('.json')) return 'json';
  if (filename.endsWith('.md')) return 'markdown';
  return 'plaintext';
};

const EditorArea = ({ activeFile, onSelectFile, onRunCode }) => {
  const { interviewId } = useParams();
  const environmentInfo = useWorkspaceStore(state => state.environmentInfo);

  const [openTabs, setOpenTabs] = useState(activeFile ? [activeFile] : []);
  const [seconds, setSeconds] = useState(2535); // 00:42:15 in seconds
  const [language, setLanguage] = useState('JAVASCRIPT');
  const [editorContent, setEditorContent] = useState('');
  const [saveStatus, setSaveStatus] = useState('Saved');

  const saveTimeoutRef = useRef(null);
  const prevFileRef = useRef(activeFile);
  const editorContentRef = useRef(editorContent);
  const isRemoteUpdateRef = useRef(false);

  // Sync editorContentRef with state
  useEffect(() => {
    editorContentRef.current = editorContent;
  }, [editorContent]);

  // Fetch the active file content
  const { data: fileData, isLoading: isFileLoading } = useQuery({
    queryKey: ['file', interviewId, activeFile],
    queryFn: () => fetchWorkspaceFile(interviewId, activeFile),
    enabled: !!activeFile && activeFile !== 'preview' && !activeFile.includes('untitled') && !activeFile.includes('new-folder')
  });

  // Save/Update file content mutation
  const { mutate: saveFile } = useMutation({
    mutationFn: ({ path, content }) => updateWorkspaceFile(interviewId, path, content),
    onSuccess: () => {
      setSaveStatus('Saved');
    },
    onError: (err) => {
      console.error(err);
      setSaveStatus('Error saving');
      toast.error('Failed to save file changes');
    }
  });

  // Handle auto-saving on text change
  const handleEditorChange = (value) => {
    const isRemote = isRemoteUpdateRef.current || (fileData && value === fileData.content);
    isRemoteUpdateRef.current = false;

    setEditorContent(value || '');

    if (isRemote) {
      setSaveStatus('Saved');
      return;
    }

    setSaveStatus('Saving...');

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(() => {
      saveFile({ path: activeFile, content: value || '' });
    }, 1000);
  };

  // Sync loaded file content to editor input
  useEffect(() => {
    if (fileData) {
      Promise.resolve().then(() => {
        isRemoteUpdateRef.current = true;
        setEditorContent(fileData.content || '');
        setSaveStatus('Saved');
      });
    }
  }, [fileData]);

  // Sync active file changes
  useEffect(() => {
    if (activeFile) {
      Promise.resolve().then(() => {
        // Add to open tabs if not already present
        setOpenTabs((prev) => {
          if (!prev.includes(activeFile)) {
            return [...prev, activeFile];
          }
          return prev;
        });

        // Derive language name for visual tag
        const ext = activeFile.substring(activeFile.lastIndexOf('.') + 1).toUpperCase();
        setLanguage(ext === 'JS' || ext === 'JSX' ? 'JAVASCRIPT' : ext);
      });

      // Save previous file immediately if there are pending edits
      if (prevFileRef.current && prevFileRef.current !== activeFile) {
        if (saveTimeoutRef.current) {
          clearTimeout(saveTimeoutRef.current);
          saveFile({ path: prevFileRef.current, content: editorContentRef.current });
        }
      }
      prevFileRef.current = activeFile;
    }
  }, [activeFile, saveFile]);

  // Cleanup on unmount - save any pending unsaved changes
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
        saveFile({ path: prevFileRef.current, content: editorContentRef.current });
      }
    };
  }, [saveFile]);

  // Real-time counting timer for Recording
  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimer = (totalSeconds) => {
    const hrs = Math.floor(totalSeconds / 3600).toString().padStart(2, '0');
    const mins = Math.floor((totalSeconds % 3600) / 60).toString().padStart(2, '0');
    const secs = (totalSeconds % 60).toString().padStart(2, '0');
    return `${hrs}:${mins}:${secs}`;
  };

  const handleTabClose = (fileName, e) => {
    e.stopPropagation();

    // If closing file has pending unsaved changes, save it immediately
    if (fileName === activeFile && saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
      saveFile({ path: fileName, content: editorContent });
    }

    const updatedTabs = openTabs.filter(t => t !== fileName);
    setOpenTabs(updatedTabs);

    // Switch to another tab if closing the active one
    if (activeFile === fileName) {
      if (updatedTabs.length > 0) {
        onSelectFile(updatedTabs[updatedTabs.length - 1]);
      } else {
        onSelectFile(null);
      }
    }
  };

  const handleSelectTab = (fileName) => {
    onSelectFile(fileName);
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-[#0e0d15] text-neutral-200">
      {/* 1. Main Workspace Top Header Bar */}
      <div className="h-12 border-b border-neutral-800/80 flex items-center justify-between px-4 bg-[#0a0a0f] flex-shrink-0 select-none">
        <div className="flex items-center gap-2.5">
          <img src="/logo.png" alt="CodeTier" className="h-6 w-auto object-contain select-none" />
          <span className="text-sm font-semibold tracking-wide text-neutral-100"></span>
        </div>

        {/* Center / Right controls */}
        <div className="flex items-center gap-4">
          {/* Recording Timer */}
          <div className="flex items-center gap-2 bg-[#ff5252]/10 border border-[#ff5252]/20 px-3 py-1 rounded-full text-xs font-semibold text-[#ff5252]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#ff5252] animate-ping" />
            <span className="font-mono tracking-wider">Rec: {formatTimer(seconds)}</span>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 text-xs font-medium bg-[#1a1924] hover:bg-[#252335] text-neutral-300 hover:text-white px-3 py-1.5 rounded-lg border border-neutral-800/80 transition-all cursor-pointer">
              <Square size={12} className="fill-neutral-400 text-neutral-400 group-hover:text-white" />
              Stop
            </button>
            <button className="flex items-center gap-1.5 text-xs font-medium bg-[#1a1924] hover:bg-[#2e1d23] text-rose-400 hover:text-rose-300 px-3 py-1.5 rounded-lg border border-[#f43f5e]/10 transition-all cursor-pointer">
              <LogOut size={12} />
              Exit
            </button>
          </div>
        </div>
      </div>

      {/* 2. Tabs Sub-Header Bar */}
      <div className="h-11 border-b border-neutral-800/80 flex items-center justify-between bg-[#0a0a0f] flex-shrink-0 select-none px-1">
        {/* Editor Tabs list */}
        <div className="flex items-end h-full overflow-x-auto scrollbar-none max-w-lg">
          {openTabs.map((tab) => {
            const isActive = activeFile === tab;
            const tabName = tab.substring(tab.lastIndexOf('/') + 1);
            return (
              <div
                key={tab}
                onClick={() => handleSelectTab(tab)}
                className={`h-full flex items-center gap-2 px-4 border-r border-neutral-800/60 cursor-pointer text-xs transition-colors select-none group relative
                  ${isActive
                    ? 'bg-[#0e0d15] text-neutral-100 font-medium'
                    : 'text-neutral-500 hover:text-neutral-300 bg-neutral-950/20'
                  }`}
              >
                {/* Visual file tag */}
                {tab === 'preview' ? (
                  <Eye size={12} className="text-indigo-400" />
                ) : (
                  <span className={`w-3.5 h-3.5 flex items-center justify-center text-[9px] font-bold rounded
                    ${tab.endsWith('.jsx') || tab.endsWith('.js') ? 'text-yellow-500 bg-yellow-500/10' : ''}
                    ${tab.endsWith('.json') ? 'text-teal-400 bg-teal-400/10' : ''}
                    ${tab.endsWith('.md') ? 'text-sky-400 bg-sky-400/10' : ''}
                  `}>
                    {tab.substring(tab.lastIndexOf('.') + 1).toUpperCase()}
                  </span>
                )}

                <span className="tracking-wide">{tab === 'preview' ? 'App Preview' : tabName}</span>

                {/* Close Button */}
                <button
                  onClick={(e) => handleTabClose(tab, e)}
                  className="text-neutral-500 hover:text-neutral-200 transition-colors p-0.5 rounded hover:bg-neutral-800/80 opacity-0 group-hover:opacity-100"
                >
                  <X size={10} />
                </button>

                {/* Active bottom line */}
                {isActive && (
                  <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-indigo-500" />
                )}
              </div>
            );
          })}
        </div>

        {/* Tab Controls (Saved, Language, Run, Preview) */}
        <div className="flex items-center gap-3 px-3 flex-shrink-0">
          {/* Preview Button */}
          {environmentInfo?.info?.url && (
            <button
              onClick={() => handleSelectTab('preview')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md border text-[11px] font-bold uppercase tracking-wider transition-all cursor-pointer
                ${activeFile === 'preview'
                  ? 'bg-indigo-600 hover:bg-indigo-700 text-white border-indigo-500 shadow-md shadow-indigo-950/20'
                  : 'bg-[#14131b] hover:bg-[#1a1924] text-neutral-400 hover:text-neutral-200 border-neutral-800/80'
                }`}
              title="Open Live Preview"
            >
              <Eye size={12} />
              Preview
            </button>
          )}

          <div className="flex items-center gap-1 text-[11px] text-neutral-500 font-medium select-none">
            {saveStatus === 'Saving...' ? (
              <span className="w-2.5 h-2.5 rounded-full border border-neutral-600 border-t-indigo-400 animate-spin mr-1" />
            ) : (
              <Check size={12} className="text-indigo-400" />
            )}
            <span>{saveStatus}</span>
          </div>

          {/* Language dropdown */}
          <div className="relative">
            <button className="flex items-center gap-1.5 px-3 py-1 bg-[#14131b] hover:bg-[#1a1924] text-[11px] font-bold text-neutral-400 hover:text-neutral-200 border border-neutral-800/80 rounded-md transition-all cursor-pointer uppercase tracking-wider">
              {language}
              <ChevronDown size={10} />
            </button>
          </div>

          {/* Play/Run Button */}
          <button
            disabled={!activeFile || activeFile === 'preview'}
            onClick={() => activeFile && onRunCode(activeFile)}
            className="flex items-center gap-1.5 bg-[#fa5252] hover:bg-[#e03131] active:scale-95 disabled:opacity-40 disabled:pointer-events-none text-white font-bold text-[11px] uppercase tracking-wider px-4 py-1.5 rounded-md shadow-md shadow-rose-900/10 transition-all cursor-pointer"
          >
            <Play size={12} className="fill-white text-white" />
            Run
          </button>
        </div>
      </div>

      {/* 3. Monaco Text Editor Area or App Preview Iframe */}
      <div className="flex-1 flex overflow-hidden bg-[#0c0b11]">
        {!activeFile ? (
          <div className="flex-1 flex flex-col items-center justify-center text-neutral-500 select-none">
            <TerminalIcon size={40} className="text-neutral-700 mb-3" />
            <span className="text-sm font-medium">No File Open</span>
            <span className="text-xs text-neutral-600 mt-1">Select a file from the explorer sidebar to start coding</span>
          </div>
        ) : activeFile === 'preview' ? (
          <div className="flex-1 h-full w-full flex flex-col bg-[#000000]">
            {/* Simple Address bar */}
            <div className="h-8 border-b border-neutral-800 bg-[#09080e] flex items-center px-4 gap-2 text-xs text-neutral-400">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
              <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
              <div className="flex-1 bg-neutral-900 border border-neutral-800 px-3 py-0.5 rounded text-[11px] text-neutral-300 font-mono select-all overflow-hidden text-ellipsis whitespace-nowrap">
                {environmentInfo?.info?.url || 'http://localhost'}
              </div>
            </div>
            <iframe
              src={environmentInfo?.info?.url}
              title="Application Preview"
              className="flex-1 w-full border-none bg-white"
            />
          </div>
        ) : isFileLoading ? (
          <div className="flex-1 flex flex-col items-center justify-center text-neutral-500 select-none">
            <span className="w-8 h-8 rounded-full border-2 border-indigo-500/20 border-t-indigo-500 animate-spin mb-2" />
            <span className="text-xs">Loading file content...</span>
          </div>
        ) : (
          <div className="flex-1 h-full w-full py-2">
            <Editor
              height="100%"
              language={getEditorLanguage(activeFile)}
              theme="blackTheme"
              value={editorContent}
              onChange={handleEditorChange}
              beforeMount={(monaco) => {
                monaco.editor.defineTheme('blackTheme', {
                  base: 'vs-dark',
                  inherit: true,
                  rules: [],
                  colors: {
                    'editor.background': '#000000',
                  }
                });
              }}
              options={{
                fontSize: 13,
                fontFamily: "JetBrains Mono, Fira Code, Menlo, Monaco, Consolas, Courier New, monospace",
                minimap: { enabled: false },
                automaticLayout: true,
                scrollbar: {
                  vertical: 'visible',
                  horizontal: 'visible'
                },
                padding: { top: 12 }
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default EditorArea;
