'use client';
import { useState } from 'react';

interface CloudinaryUploadProps {
  onUpload: (result: any) => void;
  onError: (error: string) => void;
}

export default function CloudinaryUpload({ onUpload, onError }: CloudinaryUploadProps) {
  const [uploading, setUploading] = useState(false);

  // File input handler
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploading(true);
      
      try {
        // Create a temporary URL for the file
        const tempUrl = URL.createObjectURL(file);
        
        // Store the file for later upload
        onUpload({
          event: 'success',
          info: {
            secure_url: tempUrl,
            public_id: `local-${Date.now()}`,
            file: file, // Pass the file object
          }
        });
        setUploading(false);
      } catch (error) {
        setUploading(false);
        onError('Upload failed');
      }
    }
  };

  return (
    <div>
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        disabled={uploading}
        className="w-full p-3 border-2 border-blue-300 rounded-lg bg-white text-blue-800 font-riscada text-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 disabled:opacity-50"
      />
      {uploading && (
        <div className="mt-2 text-sm text-blue-600 font-riscada">
          Processing image...
        </div>
      )}
    </div>
  );
} 