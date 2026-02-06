'use client';

import { Copy } from 'lucide-react';
import { ErrorPopup } from './components/ErrorPopup';
import { ParsedContent } from './components/ParsedContent';
import { PlaygroundHeader } from './components/PlaygroundHeader';
import { Sidebar } from './components/Sidebar';
import { EmptyState, StreamingState } from './components/States';
import { usePlayground } from './components/usePlayground';

export default function PlaygroundPage() {
  const {
    file,
    systemPrompt,
    setSystemPrompt,
    model,
    setModel,
    temperature,
    setTemperature,
    isLoading,
    result,
    activeTab,
    setActiveTab,
    hydrateStatus,
    errorPopup,
    handleFileChange,
    handleExecute,
    handleHydrate,
    closeErrorPopup,
    // Streaming state
    streamPhase,
    streamMessage,
    reasoning,
    classification,
    hasAcknowledgedReasoning,
    handleContinueAfterReasoning,
  } = usePlayground();

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  // Show streaming UI when actively processing (not idle, not done, not error)
  const isStreaming =
    isLoading &&
    streamPhase !== 'idle' &&
    streamPhase !== 'done' &&
    streamPhase !== 'error';

  // After stream ends: keep showing reasoning panel until user clicks "Next"
  const showReasoningPanelAfterDone = result && !hasAcknowledgedReasoning;

  return (
    <div className="min-h-screen bg-white font-mono text-sm flex bg-noise relative overflow-hidden">
      {/* Error Popup */}
      <ErrorPopup
        isOpen={!!errorPopup?.isOpen}
        message={errorPopup?.message || ''}
        details={errorPopup?.details}
        onClose={closeErrorPopup}
      />

      {/* Grid Background */}
      <div className="absolute inset-0 bg-grid-pattern opacity-30 pointer-events-none z-0"></div>

      {/* Sidebar Controls */}
      <Sidebar
        file={file}
        onFileChange={handleFileChange}
        systemPrompt={systemPrompt}
        setSystemPrompt={setSystemPrompt}
        model={model}
        setModel={setModel}
        temperature={temperature}
        setTemperature={setTemperature}
        isLoading={isLoading}
        onExecute={handleExecute}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative z-10">
        {/* Top Bar / Metrics */}
        <PlaygroundHeader
          result={result}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onHydrate={handleHydrate}
          hydrateStatus={hydrateStatus}
        />

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-8 relative">
          {!result && !isLoading && <EmptyState />}

          {(isStreaming || showReasoningPanelAfterDone) && (
            <StreamingState
              phase={showReasoningPanelAfterDone ? 'done' : streamPhase}
              message={streamMessage}
              reasoning={reasoning}
              classification={classification}
              onContinue={showReasoningPanelAfterDone ? handleContinueAfterReasoning : undefined}
            />
          )}

          {result && hasAcknowledgedReasoning && (
            <div className="max-w-6xl mx-auto pb-12">
              {activeTab === 'parsed' && <ParsedContent parsed={result.parsed} contractType={result.classification} />}

              {activeTab === 'raw' && (
                <div className="bg-white p-8 border border-gray-200 shadow-sm rounded-sm h-full overflow-y-auto relative">
                  <div className="text-[10px] font-bold text-gray-400 uppercase mb-4">
                    Raw Text Extraction
                  </div>
                  <pre className="whitespace-pre-wrap text-xs text-gray-600 leading-relaxed font-mono">
                    {result.rawText}
                  </pre>
                </div>
              )}

              {activeTab === 'json' && (
                <div className="bg-[#1a1a1a] p-8 border border-gray-800 shadow-sm rounded-sm h-full overflow-y-auto relative group">
                  <button
                    onClick={() => copyToClipboard(JSON.stringify(result, null, 2))}
                    className="absolute top-4 right-4 p-2 bg-gray-800 text-gray-400 rounded-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-700 hover:text-white"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                  <pre className="text-xs text-green-400 font-mono">
                    {JSON.stringify(result, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
