'use client';

import { LanguageSelector } from '@/components/LanguageSelector';
import { ContractTree } from '@/components/NodeEditor/ContractTree';
import { exportToDocx } from '@/lib/docx-export';
import { TEST_CONTRACT } from '@/lib/test-data';
import { getTranslations } from '@/lib/translations';
import { ContractNodeData, NodeType } from '@/types/contract';
import { arrayMove } from '@dnd-kit/sortable';
import { Download, FileText } from 'lucide-react';
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

export default function ContractCreator() {
  const t = getTranslations();
  const [leftLanguage, setLeftLanguage] = useState('en');
  const [rightLanguage, setRightLanguage] = useState('es');

  // State lifted from ContractTree
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

  // Helper functions
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

  // Handlers
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

  const handleExport = async () => {
    await exportToDocx(nodes);
  };

  const handleLoadTestData = () => {
    setNodes(TEST_CONTRACT);
  };

  return (
    <div className="max-w-5xl mx-auto w-full space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between pb-6 border-b border-gray-100">
        <div>
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
            <span>Contracts</span>
            <span>/</span>
            <span className="text-gray-900 font-medium">New Contract</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">{t.header.title}</h1>
        </div>

        <div className="flex items-center gap-3">
          {process.env.NEXT_PUBLIC_DEBUG === 'true' && (
            <button
              onClick={handleLoadTestData}
              className="flex items-center gap-2 px-4 py-2 text-amber-700 bg-amber-50 border border-amber-200 rounded-lg hover:bg-amber-100 transition-all text-sm font-medium"
            >
              <span>🐞</span>
              <span>Fill</span>
            </button>
          )}
          <button className="flex items-center gap-2 px-4 py-2 text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:text-gray-900 transition-all text-sm font-medium">
            <FileText className="w-4 h-4" />
            <span>{t.common.preview}</span>
          </button>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-all shadow-sm hover:shadow"
          >
            <Download className="w-4 h-4" />
            <span>{t.common.export}</span>
          </button>
        </div>
      </div>

      {/* Editor Content */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8 min-h-[500px]">
        {/* Column Headers */}
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
      </div>
    </div>
  );
}
