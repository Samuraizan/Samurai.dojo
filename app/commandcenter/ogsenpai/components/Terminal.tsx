import { useState, useRef, useEffect, useCallback, type FormEvent, type KeyboardEvent } from 'react';
import styles from './Terminal.module.css';
import { CommandHandler } from '../services/commandHandler';
import { elizaService, type ElizaState } from '../services/elizaService';

// Types
interface TerminalProps {
  prompt?: string;
  initialMessage?: string[];
}

interface TerminalLine {
  id: number;
  content: string;
  type: 'input' | 'output' | 'system' | 'error';
}

interface TerminalCommand {
  input: string;
  timestamp: number;
}

// Constants
const INITIAL_LINES: TerminalLine[] = [
  { id: 0, content: 'OGSenpai Terminal v1.0.0', type: 'system' },
  { id: 1, content: 'Type "help" for available commands.', type: 'system' },
];

const MAX_HISTORY = 100;

const MODEL_OPTIONS = [
  { id: 'openai' as const, label: 'OpenAI' },
  { id: 'deepseek' as const, label: 'DeepSeek' },
  { id: 'eliza' as const, label: 'ELIZA' },
] as const;

export default function Terminal({ 
  prompt = 'ogsenpai>',
  initialMessage = [] 
}: TerminalProps) {
  // State
  const [lines, setLines] = useState<TerminalLine[]>(() => [
    ...INITIAL_LINES,
    ...initialMessage.map((msg, index) => ({
      id: INITIAL_LINES.length + index,
      content: msg,
      type: 'system' as const
    }))
  ]);
  
  const [currentInput, setCurrentInput] = useState('');
  const [commandHistory, setCommandHistory] = useState<TerminalCommand[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [currentModel, setCurrentModel] = useState(elizaService.getCurrentMode());
  
  // Refs
  const terminalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const commandHandlerRef = useRef<CommandHandler>(new CommandHandler());

  // Effects
  useEffect(() => {
    const initializeTerminal = async () => {
      inputRef.current?.focus();
      const response = await commandHandlerRef.current.processCommand('');
      addLine(response.content, response.type);
    };

    initializeTerminal();
  }, []);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [lines]);

  // Event Handlers
  const addLine = useCallback((content: string, type: TerminalLine['type']) => {
    if (content === 'clear') {
      setLines([]);
      return;
    }
    
    setLines(prev => [
      ...prev,
      { id: prev.length, content, type }
    ]);
  }, []);

  const handleCommand = useCallback(async (command: string) => {
    const response = await commandHandlerRef.current.processCommand(command);
    return response;
  }, []);

  const handleSubmit = useCallback(async (e: FormEvent) => {
    e.preventDefault();
    const trimmedInput = currentInput.trim();
    if (!trimmedInput) return;

    // Add command to history
    const newCommand: TerminalCommand = {
      input: trimmedInput,
      timestamp: Date.now()
    };

    setCommandHistory(prev => [newCommand, ...prev].slice(0, MAX_HISTORY));
    setHistoryIndex(-1);
    addLine(`${prompt} ${trimmedInput}`, 'input');

    try {
      const response = await handleCommand(trimmedInput);
      addLine(response.content, response.type);

      if (response.final) {
        setCurrentInput('');
        return;
      }
    } catch (error) {
      addLine(
        `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        'error'
      );
    }

    setCurrentInput('');
  }, [currentInput, prompt, addLine, handleCommand]);

  const handleKeyDown = useCallback((e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowUp' && historyIndex < commandHistory.length - 1) {
      e.preventDefault();
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setCurrentInput(commandHistory[newIndex].input);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setCurrentInput(commandHistory[newIndex].input);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setCurrentInput('');
      }
    }
  }, [historyIndex, commandHistory]);

  const handleModelChange = useCallback(async (model: ElizaState['mode']) => {
    if (model === currentModel) return;
    
    setCurrentModel(model);
    addLine(`Switching to ${model.toUpperCase()} mode...`, 'system');
    await handleCommand(`mode ${model}`);
  }, [currentModel, addLine, handleCommand]);

  return (
    <div className={styles.terminalContainer}>
      <div className={styles.terminalHeader}>
        <div className={styles.terminalControls}>
          <span className={styles.terminalButton} />
          <span className={styles.terminalButton} />
          <span className={styles.terminalButton} />
        </div>
        <div className={styles.terminalTitle}>OGSenpai Terminal</div>
      </div>
      <div className={styles.terminal} ref={terminalRef}>
        {lines.map((line) => (
          <div key={line.id} className={`${styles.terminalLine} ${styles[line.type]}`}>
            {line.content}
          </div>
        ))}
        <form onSubmit={handleSubmit} className={styles.inputForm}>
          <span className={styles.prompt}>{prompt}</span>
          <input
            ref={inputRef}
            type="text"
            value={currentInput}
            onChange={(e) => setCurrentInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className={styles.terminalInput}
            spellCheck="false"
            autoComplete="off"
            autoCapitalize="off"
          />
        </form>
      </div>
      <div className={styles.modelToggleContainer}>
        {MODEL_OPTIONS.map((option) => (
          <button
            key={option.id}
            type="button"
            className={`${styles.modelToggleButton} ${currentModel === option.id ? styles.active : ''}`}
            onClick={() => handleModelChange(option.id)}
            disabled={currentModel === option.id}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
} 