'use client';

import React, { useState } from 'react';
import { ContractNodeData, NodeType, NODE_TYPES, ROOT_TYPES } from '@/types/contract';
import { ContractNode } from './ContractNode';
import { Plus } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

export const ContractTree: React.FC = () => {
  const [nodes, setNodes] = useState<ContractNodeData[]>([
    {
      id: 'root-title',
      type: 'title',
      contentLeft: 'CONTRATO DE SERVICIOS',
      contentRight: 'SERVICE AGREEMENT',
      children: [],
      isExpanded: true,
    },
    {
      id: 'root-intro',
      type: 'intro',
      contentLeft: 'Entre Alpha Solutions Ltd. (el "Proveedor") y...',
      contentRight: 'Between Alpha Solutions Ltd. (the "Provider") and...',
      children: [],
      isExpanded: true,
    },
    {
      id: 'clause-1',
      type: 'clause',
      contentLeft: 'OBJETO DEL CONTRATO',
      contentRight: 'PURPOSE OF THE AGREEMENT',
      children: [],
      isExpanded: true,
    }
  ]);

  // Helper: Update a node deep in the tree
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

  // Helper: Add a child to a specific node
  const addChildToNode = (currentNodes: ContractNodeData[], parentId: string, newChild: ContractNodeData): ContractNodeData[] => {
    return currentNodes.map(node => {
      if (node.id === parentId) {
        return { 
          ...node, 
          children: [...node.children, newChild],
          isExpanded: true // Auto-expand when adding child
        };
      }
      if (node.children.length > 0) {
        return { ...node, children: addChildToNode(node.children, parentId, newChild) };
      }
      return node;
    });
  };

  // Helper: Delete a node
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
    if (confirm('¿Estás seguro de eliminar este nodo y sus hijos?')) {
      setNodes(prev => deleteNodeFromTree(prev, id));
    }
  };

  const handleToggleExpand = (id: string) => {
    setNodes(prev => updateNodeInTree(prev, id, (node) => ({
      ...node,
      isExpanded: !node.isExpanded
    })));
  };

  return (
    <div className="flex flex-col gap-4 pb-20">
      <div className="flex flex-col gap-4">
        {nodes.map((node, idx) => (
          <ContractNode
            key={node.id}
            node={node}
            level={0}
            index={idx}
            onUpdate={handleUpdateContent}
            onAddChild={handleAddChild}
            onDelete={handleDelete}
            onToggleExpand={handleToggleExpand}
          />
        ))}
      </div>

      {/* Add Root Node Controls */}
      <div className="mt-8 pt-4 border-t border-dashed border-gray-300">
        <p className="text-sm text-gray-500 mb-3 font-medium">Añadir nueva sección principal:</p>
        <div className="flex flex-wrap gap-2">
          {ROOT_TYPES.map(type => {
            const label = NODE_TYPES.find(t => t.type === type)?.label || type;
            return (
              <button
                key={type}
                onClick={() => handleAddRootNode(type)}
                className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-md hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50 transition-all text-sm font-medium text-gray-600 shadow-sm"
              >
                <Plus className="w-4 h-4" />
                {label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
