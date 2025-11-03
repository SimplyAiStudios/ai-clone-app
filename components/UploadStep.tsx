import React, { useCallback, useMemo, ChangeEvent, useState } from 'react';
import { UploadIcon } from './icons/UploadIcon';
import { XCircleIcon } from './icons/XCircleIcon';

interface UploadStepProps {
  files: File[];
  onFilesSelect: (files: File[]) => void;
  onProceed: () => void;
  error: string | null;
}

const UploadStep: React.FC<UploadStepProps> = ({ files, onFilesSelect, onProceed, error }) => {
  const [uploadMessage, setUploadMessage] = useState<string | null>(null);

  const handleFileChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setUploadMessage(null); // Reset message on new upload
    
    if (event.target.files && files.length < 10) {
      const newFiles = Array.from(event.target.files);
      const remainingSlots = 10 - files.length;
      const filesToAdd = newFiles.slice(0, remainingSlots);

      if (newFiles.length > remainingSlots && remainingSlots > 0) {
        setUploadMessage(`Maximum of 10 images reached. Only the first ${remainingSlots} ${remainingSlots === 1 ? 'file was' : 'files were'} added.`);
      }

      onFilesSelect([...files, ...filesToAdd]);
    }
    // Clear the input's value to allow re-selecting the same file(s)
    event.target.value = '';
  }, [files, onFilesSelect]);


  const removeFile = useCallback((index: number) => {
    const newFiles = files.filter((_, i) => i !== index);
    onFilesSelect(newFiles);
    setUploadMessage(null); // Clear message when making space
  }, [files, onFilesSelect]);

  const isValid = useMemo(() => files.length >= 5 && files.length <= 10, [files.length]);

  return (
    <div className="w-full animate-fade-in-slow">
      <div className="bg-brand-dark-2/80 backdrop-blur-sm border border-brand-purple/20 rounded-2xl p-6 sm:p-8 shadow-2xl shadow-brand-purple/10 text-center">
        <h2 className="text-xl sm:text-2xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-white to-brand-purple">Upload 5 to 10 Photos of Yourself</h2>
        <p className="text-gray-400 mb-6">For best results, use a variety of angles, lighting, and expressions.</p>

        <div className="grid grid-cols-3 sm:grid-cols-5 gap-4 mb-6 min-h-[100px]">
          {files.map((file, index) => (
            <div key={index} className="relative aspect-square group">
              <img src={URL.createObjectURL(file)} alt={`upload-preview-${index}`} className="w-full h-full object-cover rounded-lg border-2 border-brand-purple/50" />
              <button
                onClick={() => removeFile(index)}
                className="absolute -top-2 -right-2 bg-gray-800 rounded-full text-gray-300 hover:text-white hover:bg-brand-purple transition-all opacity-70 group-hover:opacity-100"
              >
                <XCircleIcon className="w-6 h-6" />
              </button>
            </div>
          ))}
          {files.length < 10 && (
            <label className="flex flex-col items-center justify-center aspect-square border-2 border-dashed border-brand-purple/50 rounded-lg cursor-pointer hover:border-brand-purple hover:bg-brand-dark-2/50 transition-colors">
              <UploadIcon className="w-8 h-8 text-brand-purple/70 mb-1" />
              <span className="text-sm text-gray-400">Add more</span>
              <input type="file" multiple accept="image/jpeg, image/png" className="hidden" onChange={handleFileChange} />
            </label>
          )}
        </div>

        <div className="min-h-[4rem] flex flex-col justify-center items-center mb-4">
          {error && <p className="text-red-400 mb-2">{error}</p>}
          {uploadMessage && <p className="text-amber-400 mb-2">{uploadMessage}</p>}
          <p className={`text-gray-400 text-sm transition-all ${files.length === 10 ? 'text-brand-purple font-bold scale-110' : ''}`}>
            {files.length} / 10 images selected {files.length === 10 && "(Maximum reached)"}
          </p>
        </div>

        <button
          onClick={onProceed}
          disabled={!isValid}
          className="w-full sm:w-auto px-10 py-4 font-bold text-lg rounded-full transition-all duration-300
                     bg-gradient-to-r from-brand-indigo to-brand-purple
                     hover:shadow-lg hover:shadow-brand-purple/50
                     disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
        >
          Create
        </button>
      </div>
    </div>
  );
};

export default UploadStep;