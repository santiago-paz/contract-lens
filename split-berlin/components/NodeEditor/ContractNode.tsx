import React from 'react';
import { ContractNodeData, NODE_TYPES, NodeType, ALLOWED_CHILDREN } from '@/types/contract';
import { ChevronRight, ChevronDown, Plus, Trash2, GripVertical, Type } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSortable, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { getTranslations } from '@/lib/translations';

interface ContractNodeProps {
  node: ContractNodeData;
  level: number;
  index: number;
  parentType?: NodeType;
  onUpdate: (id: string, side: 'left' | 'right', value: string) => void;
  onAddChild: (parentId: string, type: NodeType) => void;
  onDelete: (id: string) => void;
  onToggleExpand: (id: string) => void;
}

export const ContractNode: React.FC<ContractNodeProps> = ({
  node,
  level,
  index,
  parentType,
  onUpdate,
  onAddChild,
  onDelete,
  onToggleExpand,
}) => {
  const t = getTranslations();
  const [isHovered, setIsHovered] = React.useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: node.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const getTypeLabel = (type: NodeType) => {
    return t.editor.nodeTypes[type] || type;
  };

  const getIndentColor = (lvl: number) => {
    const colors = ['border-l-blue-500', 'border-l-indigo-500', 'border-l-purple-500', 'border-l-pink-500'];
    return colors[lvl % colors.length];
  };

  const allowedChildren = ALLOWED_CHILDREN[node.type] || [];

  // Helper to get visual numbering hint (simplified)
  const getNumberingHint = () => {
    switch (node.type) {
      case 'clause': return `${index + 1}.`;
      case 'subclause': return `${index + 1}.`; // We don't have parent index easily here without passing it down, keeping simple for now
      case 'item': return `(${String.fromCharCode(97 + index)})`; // a, b, c...
      case 'subitem': return `(${['i', 'ii', 'iii', 'iv', 'v'][index] || index + 1})`;
      default: return '';
    }
  };

  return (
    <div ref={setNodeRef} style={style} className="flex flex-col w-full">
      {/* Node Row */}
      <div
        className={cn(
          "group relative flex items-start gap-2 p-3 rounded-lg border border-transparent hover:border-gray-200 hover:bg-gray-50 transition-all",
          level > 0 && "ml-6 border-l-2 " + getIndentColor(level),
          isDragging && "bg-blue-50 border-blue-200 z-10"
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Controls Column */}
        <div className="flex flex-col items-center gap-1 mt-1 text-gray-400">
          <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing p-0.5 hover:bg-gray-200 rounded">
            <GripVertical className="w-4 h-4" />
          </div>
          <button onClick={() => onToggleExpand(node.id)}>
            {node.children.length > 0 ? (
              node.isExpanded ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )
            ) : (
              <div className="w-4 h-4" /> // Spacer
            )}
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 flex flex-col gap-2 w-full">
          {/* Header / Meta */}
          <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
            <div className="flex items-center gap-2 bg-gray-100 px-2 py-0.5 rounded">
              <Type className="w-3 h-3" />
              <span className="font-medium uppercase">{getTypeLabel(node.type)}</span>
              {getNumberingHint() && <span className="font-bold text-gray-700 ml-1">{getNumberingHint()}</span>}
            </div>
            
            {/* Action Buttons (Visible on Hover) */}
            <div className={cn("flex items-center gap-2 transition-opacity", isHovered ? "opacity-100" : "opacity-0")}>
              <div className="flex items-center bg-white border rounded shadow-sm overflow-hidden">
                {/* Dynamic Add Buttons based on Allowed Children */}
                {allowedChildren.map(childType => (
                  <button
                    key={childType}
                    onClick={() => onAddChild(node.id, childType)}
                    className="flex items-center gap-1 p-1 px-2 hover:bg-blue-50 text-blue-600 border-r text-xs font-medium"
                    title={`${t.editor.addNode} ${getTypeLabel(childType)}`}
                  >
                    <Plus className="w-3 h-3" />
                    {getTypeLabel(childType)}
                  </button>
                ))}
                
                <button
                  onClick={() => onDelete(node.id)}
                  className="p-1 hover:bg-red-50 text-red-600 px-2"
                  title={t.editor.deleteNode}
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>

          {/* Editors */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <textarea
                value={node.contentLeft}
                onChange={(e) => onUpdate(node.id, 'left', e.target.value)}
                placeholder={`${t.editor.contentPlaceholder} (${getTypeLabel(node.type)})`}
                className="w-full min-h-[60px] p-2 text-sm border rounded-md focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none resize-y bg-white"
                rows={Math.max(2, node.contentLeft.split('\n').length)}
              />
            </div>
            <div className="relative">
              <textarea
                value={node.contentRight}
                onChange={(e) => onUpdate(node.id, 'right', e.target.value)}
                placeholder={`${t.editor.translationPlaceholder} (${getTypeLabel(node.type)})`}
                className="w-full min-h-[60px] p-2 text-sm border rounded-md focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 outline-none resize-y bg-gray-50/50"
                rows={Math.max(2, node.contentRight.split('\n').length)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Children */}
      {node.isExpanded && node.children.length > 0 && (
        <SortableContext items={node.children.map(c => c.id)} strategy={verticalListSortingStrategy}>
          <div className="flex flex-col gap-2 mt-2">
            {node.children.map((child, idx) => (
              <ContractNode
                key={child.id}
                node={child}
                level={level + 1}
                index={idx}
                parentType={node.type}
                onUpdate={onUpdate}
                onAddChild={onAddChild}
                onDelete={onDelete}
                onToggleExpand={onToggleExpand}
              />
            ))}
          </div>
        </SortableContext>
      )}
    </div>
  );
};
