'use client';

import { Trash2, Edit } from 'lucide-react';
import { deleteContract } from '@/app/actions/delete-contract';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export function ContractActions({ contractId }: { contractId: string }) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleEdit = () => {
    router.push(`/contracts/${contractId}`);
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this contract? This action cannot be undone.')) {
      return;
    }

    setIsDeleting(true);
    try {
      const result = await deleteContract(contractId);
      if (result.success) {
        // Refresh handled by server action revalidatePath, but router.refresh ensures client update
        router.refresh(); 
      } else {
        alert('Failed to delete: ' + result.error);
      }
    } catch (error) {
      alert('An error occurred');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex items-center gap-2 justify-end">
      <button 
        onClick={handleEdit}
        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" 
        title="Edit Contract"
      >
        <Edit className="w-4 h-4" />
      </button>
      <button 
        onClick={handleDelete}
        disabled={isDeleting}
        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50" 
        title="Delete Contract"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
}
