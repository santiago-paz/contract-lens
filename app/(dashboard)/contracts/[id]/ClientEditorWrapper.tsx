'use client';

import { EditorLayout } from '@/app/(dashboard)/contract-creator/wizard/EditorLayout';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export function ClientEditorWrapper({ contract, initialData, alerts = [], tasks = [] }: { contract: any, initialData: any, alerts?: any[], tasks?: any[] }) {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    // Fetch the file from the API
    async function fetchFile() {
      try {
        const response = await fetch(`/api/contracts/${contract.id}/file`);
        if (!response.ok) throw new Error('Failed to fetch file');
        
        const blob = await response.blob();
        
        // Determine mime type based on extension
        const ext = contract.fileName?.split('.').pop()?.toLowerCase();
        let mimeType = 'application/octet-stream';
        if (ext === 'pdf') mimeType = 'application/pdf';
        if (ext === 'docx') mimeType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
        
        const fileObj = new File([blob], contract.fileName || 'document', { type: mimeType });
        setFile(fileObj);
      } catch (error) {
        console.error('Error fetching file:', error);
      }
    }

    if (contract.id) {
        fetchFile();
    }
  }, [contract.id, contract.fileName]);

  return (
    <EditorLayout 
      fileName={contract.fileName || contract.title}
      contractType={contract.type}
      onBack={() => router.push('/dashboard')}
      uploadedFile={file}
      initialData={initialData}
      contractId={contract.id}
      alerts={alerts}
      tasks={tasks}
    >
      <div className="p-8 prose max-w-none">
         {/* Display content if available (fallback if file preview fails or is not supported) */}
         {contract.content ? (
           <div className="whitespace-pre-wrap font-mono text-sm">
             {contract.content}
           </div>
         ) : (
           <p className="text-gray-400 italic">No document content available.</p>
         )}
      </div>
    </EditorLayout>
  );
}
