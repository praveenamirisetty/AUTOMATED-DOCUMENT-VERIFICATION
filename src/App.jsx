import React, { useState } from 'react';
import Dashboard from './Dashboard';

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [currentPage, setCurrentPage] = useState('upload'); // 'upload' or 'dashboard'
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      alert('Please select a file to upload');
      return;
    }
    
    setIsUploading(true);
    
    try {
      // Create FormData to send the file
      const formData = new FormData();
      formData.append('document', selectedFile);
      
      // Simulate upload process (replace with actual API call)
      console.log('Uploading file:', selectedFile.name);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // For demo purposes, we'll simulate a successful upload
      // In real application, you would use:
      /*
      const response = await fetch('http://localhost:5000/upload', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error('Upload failed');
      }
      */
      
      alert(`File "${selectedFile.name}" uploaded successfully!`);
      
      // Navigate to dashboard after successful upload
      setCurrentPage('dashboard');
      
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Error uploading file. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleBackToUpload = () => {
    setCurrentPage('upload');
    setSelectedFile(null);
  };

  // Render Dashboard if currentPage is 'dashboard'
  if (currentPage === 'dashboard') {
    return (
      <div className="min-h-screen bg-gray-100 p-6">
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">
          Document Verification Dashboard
        </h1>
        <Dashboard onBack={handleBackToUpload} />
      </div>
    );
  }

  // Render Upload Page
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden p-8">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Next-Gen Document Verification
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Upload scanned images or PDFs of your documents. Our system checks authenticity 
            in seconds using advanced image recognition, clarity, and keyword analysis.
          </p>
        </div>

        <div className="mb-12">
          <form onSubmit={handleSubmit} className="text-center">
            <div 
              className={`border-2 border-dashed rounded-2xl p-10 transition-all duration-300 mb-6
                ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-gray-50'} 
                ${selectedFile ? 'border-green-500 bg-green-50' : ''}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <div className="flex flex-col items-center justify-center space-y-4">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                  </svg>
                </div>
                
                <div className="text-center">
                  <p className="font-medium text-gray-700">
                    {selectedFile ? selectedFile.name : 'Drag & drop your file here'}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    {selectedFile ? 
                      `Size: ${(selectedFile.size / 1024 / 1024).toFixed(2)} MB` : 
                      'or click to browse files (PDF, PNG, JPG, JPEG, GIF)'
                    }
                  </p>
                </div>
                
                <label className="cursor-pointer">
                  <span className="px-5 py-2.5 bg-blue-600 text-white font-medium rounded-lg text-sm hover:bg-blue-700 transition-colors inline-block">
                    Browse files
                  </span>
                  <input 
                    type="file" 
                    className="hidden" 
                    onChange={handleFileChange} 
                    accept=".pdf,.png,.jpg,.jpeg,.gif" 
                    required 
                  />
                </label>
              </div>
            </div>
            
            <button 
              type="submit" 
              disabled={!selectedFile || isUploading}
              className={`px-8 py-3 font-medium rounded-lg text-white transition-all duration-300 flex items-center justify-center mx-auto
                ${selectedFile && !isUploading ? 
                  'bg-blue-600 hover:bg-blue-700 shadow-lg transform hover:scale-105' : 
                  'bg-gray-400 cursor-not-allowed'}
                ${isUploading ? 'bg-blue-400' : ''}`}
            >
              {isUploading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Uploading...
                </>
              ) : (
                'Verify Document'
              )}
            </button>
          </form>
        </div>

        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">How it works</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Text Extraction</h3>
              <p className="text-gray-600">Advanced OCR technology extracts text from your documents</p>
            </div>
            
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"></path>
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Quality Analysis</h3>
              <p className="text-gray-600">Checks image clarity and document quality</p>
            </div>
            
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Authenticity Verification</h3>
              <p className="text-gray-600">Analyzes content for authenticity markers</p>
            </div>
            
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Instant Results</h3>
              <p className="text-gray-600">Get verification results in seconds</p>
            </div>
          </div>
        </div>

        <div className="text-center text-gray-500 border-t border-gray-200 pt-8">
          <p>Supported formats: PDF, PNG, JPG, JPEG, GIF</p>
        </div>
      </div>
    </div>
  );
}

export default App;