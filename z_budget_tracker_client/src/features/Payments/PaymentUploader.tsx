import { useState, type ChangeEvent } from 'react';

type UploadStatus = 'idle' | 'uploading' | 'success' | 'error';

export default function FileUploader() {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<UploadStatus>('idle');

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      setStatus('idle');
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setStatus('uploading');
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/fileupload`, {
        method: 'POST',
        body: formData,
        // Do not manually set the Content-Type header; the browser sets it automatically with the multipart boundary
      });

      if (response.ok) {
        setStatus('success');
      } else {
        setStatus('error');
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.log('error', error);
      setStatus('error');
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />

      {file && (
        <div>
          <p>
            Selected: {file.name} ({(file.size / 1024).toFixed(2)} KB)
          </p>
          <button onClick={handleUpload} disabled={status === 'uploading'}>
            {status === 'uploading' ? 'Uploading...' : 'Upload File'}
          </button>
        </div>
      )}

      {status === 'success' && <p>File uploaded successfully!</p>}
      {status === 'error' && <p>Upload failed. Please try again.</p>}
    </div>
  );
}
