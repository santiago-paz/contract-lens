'use client';

import React from 'react';
import { ContractNodeData, NodeType, ROOT_TYPES } from '@/types/contract';
import { ContractNode } from './ContractNode';
import { Plus } from 'lucide-react';
import { getTranslations } from '@/lib/translations';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';

interface ContractTreeProps {
  nodes: ContractNodeData[];
  onUpdateNode: (id: string, side: 'left' | 'right', value: string) => void;
  onAddChild: (parentId: string, type: NodeType) => void;
  onAddRootNode: (type: NodeType) => void;
  onDeleteNode: (id: string) => void;
  onToggleExpand: (id: string) => void;
  onReorderNodes: (activeId: string, overId: string) => void;
}

export const ContractTree: React.FC<ContractTreeProps> = ({
  nodes,
  onUpdateNode,
  onAddChild,
  onAddRootNode,
  onDeleteNode,
  onToggleExpand,
  onReorderNodes,
}) => {
  const t = getTranslations();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id && over?.id) {
      onReorderNodes(active.id as string, over.id as string);
    }
  };

  return (
    <DndContext 
      sensors={sensors} 
      collisionDetection={closestCenter} 
      onDragEnd={handleDragEnd}
    >
      <div className="flex flex-col gap-4 pb-20">
        <div className="flex flex-col gap-4">
          <SortableContext 
            items={nodes.map(n => n.id)} 
            strategy={verticalListSortingStrategy}
          >
            {nodes.map((node, idx) => (
              <ContractNode
                key={node.id}
                node={node}
                level={0}
                index={idx}
                onUpdate={onUpdateNode}
                onAddChild={onAddChild}
                onDelete={onDeleteNode}
                onToggleExpand={onToggleExpand}
              />
            ))}
          </SortableContext>
        </div>

        {/* Add Root Node Controls */}
        <div className="mt-8 pt-4 border-t border-dashed border-gray-300">
          <p className="text-sm text-gray-500 mb-3 font-medium">{t.editor.addRootSection}</p>
          <div className="flex flex-wrap gap-2">
            {ROOT_TYPES.map(type => {
              const label = t.editor.nodeTypes[type] || type;
              return (
                <button
                  key={type}
                  onClick={() => onAddRootNode(type)}
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
    </DndContext>
  );
};
