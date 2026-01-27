'use client';

import { LanguageSelector } from '@/components/LanguageSelector';
import { ContractTree } from '@/components/NodeEditor/ContractTree';
import { exportToDocx } from '@/lib/docx-export';
import { TEST_CONTRACT } from '@/lib/test-data';
import { getTranslations } from '@/lib/translations';
import { ContractNodeData, NodeType } from '@/types/contract';
import { arrayMove } from '@dnd-kit/sortable';
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { UploadStep } from './wizard/UploadStep';
import { AnalysisStep } from './wizard/AnalysisStep';
import { TypeSelectionStep } from './wizard/TypeSelectionStep';
import { EditorLayout } from './wizard/EditorLayout';
import { ContractAnalysis } from '@/types/contract-analysis';

type WizardStep = 'upload' | 'analyzing' | 'type-selection' | 'editor';

export default function ContractCreator() {
  const t = getTranslations();
  
  // Wizard State
  const [step, setStep] = useState<WizardStep>('upload');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [selectedType, setSelectedType] = useState<string>('');
  const [analysisResult, setAnalysisResult] = useState<ContractAnalysis | null>(null);

  // Editor State
  const [leftLanguage, setLeftLanguage] = useState('en');
  const [rightLanguage, setRightLanguage] = useState('es');
  const [nodes, setNodes] = useState<ContractNodeData[]>([
    {
      id: 'root-title',
      type: 'title',
      contentLeft: '',
      contentRight: '',
      children: [],
      isExpanded: true,
    },
    {
      id: 'root-intro',
      type: 'intro',
      contentLeft: '',
      contentRight: '',
      children: [],
      isExpanded: true,
    },
    {
      id: 'clause-1',
      type: 'clause',
      contentLeft: '',
      contentRight: '',
      children: [],
      isExpanded: true,
    }
  ]);

  // Wizard Handlers
  const handleFileSelect = (file: File) => {
    setUploadedFile(file);
    setStep('analyzing');
    // Reset previous analysis
    setAnalysisResult(null);
  };

  const handleAnalysisComplete = (data: ContractAnalysis) => {
    setAnalysisResult(data);
    setStep('type-selection');
  };

  const handleTypeSelect = (type: string) => {
    setSelectedType(type);
    setStep('editor');
    // Here we could load a template based on the type
  };

  const handleBackToDashboard = () => {
    // Navigate back or reset
    if (confirm('Are you sure you want to cancel the process?')) {
        setStep('upload');
        setUploadedFile(null);
        setSelectedType('');
    }
  };

  // Editor Handlers
  const updateNodeInTree = (
    currentNodes: ContractNodeData[],
    id: string,
    updater: (node: ContractNodeData) => ContractNodeData
  ): ContractNodeData[] => {
    return currentNodes.map(node => {
      if (node.id === id) {
        return updater(node);
      }
      if (node.children.length > 0) {
        return { ...node, children: updateNodeInTree(node.children, id, updater) };
      }
      return node;
    });
  };

  const addChildToNode = (currentNodes: ContractNodeData[], parentId: string, newChild: ContractNodeData): ContractNodeData[] => {
    return currentNodes.map(node => {
      if (node.id === parentId) {
        return {
          ...node,
          children: [...node.children, newChild],
          isExpanded: true
        };
      }
      if (node.children.length > 0) {
        return { ...node, children: addChildToNode(node.children, parentId, newChild) };
      }
      return node;
    });
  };

  const deleteNodeFromTree = (currentNodes: ContractNodeData[], id: string): ContractNodeData[] => {
    return currentNodes
      .filter(node => node.id !== id)
      .map(node => ({ ...node, children: deleteNodeFromTree(node.children, id) }));
  };

  const handleUpdateContent = (id: string, side: 'left' | 'right', value: string) => {
    setNodes(prev => updateNodeInTree(prev, id, (node) => ({
      ...node,
      [side === 'left' ? 'contentLeft' : 'contentRight']: value
    })));
  };

  const handleAddChild = (parentId: string, type: NodeType) => {
    const newNode: ContractNodeData = {
      id: uuidv4(),
      type,
      contentLeft: '',
      contentRight: '',
      children: [],
      isExpanded: true,
    };
    setNodes(prev => addChildToNode(prev, parentId, newNode));
  };

  const handleAddRootNode = (type: NodeType) => {
    const newNode: ContractNodeData = {
      id: uuidv4(),
      type,
      contentLeft: '',
      contentRight: '',
      children: [],
      isExpanded: true,
    };
    setNodes(prev => [...prev, newNode]);
  };

  const handleDelete = (id: string) => {
    if (confirm(t.common.confirmDelete)) {
      setNodes(prev => deleteNodeFromTree(prev, id));
    }
  };

  const handleToggleExpand = (id: string) => {
    setNodes(prev => updateNodeInTree(prev, id, (node) => ({
      ...node,
      isExpanded: !node.isExpanded
    })));
  };

  const handleReorderNodes = (activeId: string, overId: string) => {
    setNodes((prevNodes) => {
      const reorderNodes = (nodes: ContractNodeData[]): ContractNodeData[] => {
        const activeIndex = nodes.findIndex((n) => n.id === activeId);
        const overIndex = nodes.findIndex((n) => n.id === overId);

        if (activeIndex !== -1 && overIndex !== -1) {
          return arrayMove(nodes, activeIndex, overIndex);
        }

        return nodes.map((node) => ({
          ...node,
          children: reorderNodes(node.children),
        }));
      };

      return reorderNodes(prevNodes);
    });
  };

  // Render Logic
  if (step === 'upload') {
    return <UploadStep onFileSelect={handleFileSelect} />;
  }

  if (step === 'analyzing' && uploadedFile) {
    return (
        <AnalysisStep 
            file={uploadedFile} 
            onComplete={handleAnalysisComplete}
            onCancel={() => setStep('upload')}
        />
    );
  }

  if (step === 'type-selection') {
    return (
        <TypeSelectionStep 
            onSelect={handleTypeSelect}
            onBack={() => setStep('analyzing')}
            suggestedType={analysisResult?.contractType}
        />
    );
  }

  return (
    <EditorLayout 
        fileName={uploadedFile?.name || 'New Contract'} 
        contractType={selectedType}
        onBack={handleBackToDashboard}
        uploadedFile={uploadedFile}
        initialData={analysisResult}
    >
        {/* Editor Content */}
        <div className="space-y-8">
            {/* Column Headers for Languages */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-8 px-14">
                <div className="flex items-start gap-3">
                    <span className="w-2 h-2 rounded-full bg-blue-500 mt-2"></span>
                    <div className="flex-1">
                        <LanguageSelector
                            value={leftLanguage}
                            onChange={setLeftLanguage}
                            side="left"
                        />
                    </div>
                </div>
                <div className="flex items-start gap-3">
                    <span className="w-2 h-2 rounded-full bg-indigo-500 mt-2"></span>
                    <div className="flex-1">
                        <LanguageSelector
                            value={rightLanguage}
                            onChange={setRightLanguage}
                            side="right"
                        />
                    </div>
                </div>
            </div>

            {/* Tree Editor */}
            <ContractTree
                nodes={nodes}
                onUpdateNode={handleUpdateContent}
                onAddChild={handleAddChild}
                onAddRootNode={handleAddRootNode}
                onDeleteNode={handleDelete}
                onToggleExpand={handleToggleExpand}
                onReorderNodes={handleReorderNodes}
            />
            
            {process.env.NEXT_PUBLIC_DEBUG === 'true' && (
                 <div className="mt-8 pt-8 border-t border-gray-100 flex justify-end">
                    <button
                        onClick={() => setNodes(TEST_CONTRACT)}
                        className="text-amber-600 text-sm hover:underline"
                    >
                        Load Test Data
                    </button>
                 </div>
            )}
        </div>
    </EditorLayout>
  );
}
