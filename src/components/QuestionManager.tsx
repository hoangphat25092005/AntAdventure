import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';
import axios from 'axios';
import { provinces as provinceData } from '../data/provinceData';

const QuestionManager: React.FC = () => {
    const navigate = useNavigate();
    const [isAdmin, setIsAdmin] = useState(true);
    const [activeTab, setActiveTab] = useState<'manage' | 'import'>('manage');
    
    // Import file states
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<any[]>([]);
    const [questions, setQuestions] = useState<any[]>([]);
    const [importing, setImporting] = useState(false);
    const [importStatus, setImportStatus] = useState<string>('');
    const [error, setError] = useState('');
    const [provinceFilter, setProvinceFilter] = useState<string>('');
    const [provinces, setProvinces] = useState<string[]>([]);
    const [wipeOption, setWipeOption] = useState<'keep'|'wipe'|'replace'>('replace');

    // Original import button states
    const [isImporting, setIsImporting] = useState(false);
    const [importError, setImportError] = useState<string | null>(null);
    const [importSuccess, setImportSuccess] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    
    useEffect(() => {
        checkAdminStatus();
    }, []);

    const checkAdminStatus = async () => {
        try {
            const response = await fetch('http://localhost:3001/api/users/checkAdmin', {
                credentials: 'include'
            });
            if (response.ok) {
                setIsAdmin(true);
            } else {
                setIsAdmin(false);
                navigate('/'); // Redirect non-admin users
            }
        } catch (err) {
            console.error('Admin check failed:', err);
            navigate('/');
        }
    };

    // Function to convert letter key (A, B, C, D) to numeric index (0, 1, 2, 3)
    const keyToIndex = (key: string) => {
        switch (key) {
            case 'A': return 0;
            case 'B': return 1;
            case 'C': return 2;
            case 'D': return 3;
            default: return 0; // Default to first option if key is invalid
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setError('');
        setPreview([]);
        setQuestions([]);
        setProvinces([]);
        setImportStatus('');
        
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
            processExcel(e.target.files[0]);
        }
    };

    const processExcel = (file: File) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = e.target?.result;
                if (!data) {
                    setError('Failed to read file data');
                    return;
                }
                
                const workbook = XLSX.read(data, { type: 'binary' });
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];
                const json = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: "" });
                
                // Take first rows for preview
                setPreview(json.slice(0, 15));
                
                // Parse questions
                const parsedQuestions = parseQuestions(json);
                setQuestions(parsedQuestions);
                
                // Extract unique province names
                const uniqueProvinces = Array.from(new Set(parsedQuestions.map(q => q.provinceName))).sort();
                setProvinces(uniqueProvinces);
                
            } catch (error) {
                console.error('Error reading Excel file:', error);
                setError('Error reading Excel file. Please check the format.');
            }
        };
        reader.readAsBinaryString(file);
    };

    const parseQuestions = (data: any[]) => {
        const questions = [];
        let currentProvince = null;
        let isHeaderRow = true;
        
        for (let rowIndex = 0; rowIndex < data.length; rowIndex++) {
            const row = data[rowIndex];
            
            // Skip empty rows
            if (!row.some((cell: string) => cell !== '')) {
                continue;
            }   
            
            // Check if this is the header row with column names
            if (isHeaderRow) {
                isHeaderRow = false;
                continue; // Skip the header row with column identifiers
            }
            
            // Check if this is a province row (should have text in column B and empty in columns A, C-G)
            if (row[0] !== '' && (row[1] === '' || !row[1]) && !row[2] && !row[3] && !row[4] && !row[5]) {
                currentProvince = row[0].trim();
                continue;
            }
            
            // If we have a province set and this is a question row (has a number in first column)
            if (currentProvince && row[0] && !isNaN(parseInt(row[0]))) {
                // Question text is in column 1
                const questionText = row[1];
                if (!questionText) continue; // Skip if no question text
                
                // Options A, B, C, D are in columns 2-5
                const options = [
                    row[2] || '', // Option A
                    row[3] || '', // Option B
                    row[4] || '', // Option C
                    row[5] || ''  // Option D
                ];
                
                // Get the correct answer key from column 6
                const correctAnswerKey = row[6] || 'A';
                const correctAnswerIndex = keyToIndex(correctAnswerKey);
                
                // Image URL is in column 7
                const imageUrl = row[7] ? row[7].toString().trim() : '';
                
                questions.push({
                    provinceName: currentProvince,
                    question: questionText,
                    options: options,
                    correctAnswer: correctAnswerIndex,
                    ...(imageUrl && imageUrl.startsWith('http') ? { image: imageUrl } : {})
                });
            }
        }
        
        return questions;
    };

    const handleImport = async () => {
        if (questions.length === 0) {
            setError('No valid questions to import');
            return;
        }
        
        setImporting(true);
        setImportStatus('Starting import...');
        setError('');
        
        try {
            const questionsToImport = provinceFilter ? 
                questions.filter(q => q.provinceName === provinceFilter) : 
                questions;
            
            if (questionsToImport.length === 0) {
                setError(`No questions found for province "${provinceFilter}"`);
                setImporting(false);
                return;
            }
            
            // First, handle wiping if needed
            if (wipeOption === 'wipe') {
                setImportStatus('Wiping all existing questions...');
                await axios.delete('http://localhost:3001/api/questions/wipe', { withCredentials: true });
            } else if (wipeOption === 'replace' && provinceFilter) {
                setImportStatus(`Wiping existing questions for province "${provinceFilter}"...`);
                await axios.delete(`http://localhost:3001/api/questions/wipe/${encodeURIComponent(provinceFilter)}`, 
                    { withCredentials: true });
            }
            
            // Process in batches of 10 questions to avoid timeouts
            let successCount = 0;
            let errorCount = 0;
            const batchSize = 10;
            
            for (let i = 0; i < questionsToImport.length; i += batchSize) {
                const batch = questionsToImport.slice(i, i + batchSize);
                setImportStatus(`Importing questions ${i + 1} to ${Math.min(i + batchSize, questionsToImport.length)} of ${questionsToImport.length}...`);
                
                try {
                    const response = await axios.post('http://localhost:3001/api/questions/bulkImport', 
                        { questions: batch },
                        { withCredentials: true }
                    );
                    
                    if (response.data && response.data.inserted) {
                        successCount += response.data.inserted;
                        setImportStatus(`Imported ${successCount} questions so far...`);
                    }
                } catch (error) {
                    console.error('Error importing batch:', error);
                    errorCount += batch.length;
                }
                
                // Small delay between batches
                await new Promise(resolve => setTimeout(resolve, 300));
            }
            
            setImportStatus(`Import completed. ${successCount} questions imported successfully. ${errorCount > 0 ? `${errorCount} questions failed.` : ''}`);
            setTimeout(() => {
                window.location.reload(); // Refresh to show updated questions
            }, 3000);
        } catch (error) {
            console.error('Error during import process:', error);
            setError('Error during import process. Please try again.');
        } finally {
            setImporting(false);
        }
    };
    
    // Original file upload method (for backward compatibility)
    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) {
            return;
        }
        
        setIsImporting(true);
        setImportError(null);
        setImportSuccess(null);
        
        const file = e.target.files[0];
        const formData = new FormData();
        formData.append('excelFile', file);
        
        try {
            const response = await fetch('http://localhost:3001/api/questions/bulk-import', {
                method: 'POST',
                credentials: 'include',
                body: formData
            });
            
            const data = await response.json();
            
            if (response.ok) {
                setImportSuccess(`Successfully imported ${data.imported} questions.`);
                // Refresh the question manager to show new questions
                window.location.reload();
            } else {
                setImportError(data.message || 'Failed to import questions');
            }
        } catch (err) {
            setImportError('Network error. Please try again.');
            console.error('Import error:', err);
        } finally {
            setIsImporting(false);
            // Clear the file input
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };
    
    if (!isAdmin) {
        return <div className="flex items-center justify-center h-screen">Access denied</div>;
    }

    return (
        <div className="flex flex-col min-h-screen">
            <div className="text-white shadow-md bg-cyan-500">
                <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="flex justify-center">
                        <button 
                            onClick={() => setActiveTab('manage')}
                            className={`py-4 px-6 font-medium ${activeTab === 'manage' ? 'border-b-4 border-white' : 'opacity-80'}`}
                        >
                            Manage Questions
                        </button>
                        <button 
                            onClick={() => setActiveTab('import')}
                            className={`py-4 px-6 font-medium ${activeTab === 'import' ? 'border-b-4 border-white' : 'opacity-80'}`}
                        >
                            Import from Excel
                        </button>
                    </div>
                </div>
            </div>
            
            <div className="flex-grow p-4 bg-cyan-500 md:p-8">
                {activeTab === 'manage' && (
                    <div>
                        <div className="px-4 mx-auto max-w-7xl sm:px-6 md:px-8">
                            <h1 className="mb-6 text-3xl font-bold text-white">Question Management</h1>
                        </div>
                        <div className="px-4 mx-auto max-w-7xl sm:px-6 md:px-8">
                            <QuestionManager />
                        </div>
                    </div>
                )}
                
                {activeTab === 'import' && (
                    <div className="max-w-6xl p-4 mx-auto bg-white rounded-lg shadow-lg md:p-6">
                        <h1 className="mb-6 text-2xl font-bold">Import Questions from Excel</h1>
                        
                        <div className="p-4 mb-6 border-l-4 border-yellow-400 bg-yellow-50">
                            <p className="font-medium">Instructions:</p>
                            <ul className="ml-4 text-sm list-disc list-inside">
                                <li>Your Excel file should have headers in the first row</li>
                                <li>Column A: Question number</li>
                                <li>Column B: Question text</li>
                                <li>Column C-F: Option A, B, C, D</li>
                                <li>Column G: Correct answer (A, B, C or D)</li>
                                <li>Column H: Image URL (optional)</li>
                                <li>Province names should be in a separate row with text only in column A</li>
                            </ul>
                        </div>
                        
                        <div className="mb-6">
                            <label className="block mb-2 font-medium">Select Excel File:</label>
                            <input
                                type="file"
                                onChange={handleFileChange}
                                className="w-full p-2 border rounded"   
                                accept=".xlsx,.xls"
                                disabled={importing}
                            />
                        </div>
                        
                        {questions.length > 0 && (
                            <>
                                <div className="grid grid-cols-1 gap-4 mb-6 md:grid-cols-2">
                                    <div>
                                        <label className="block mb-2 font-medium">Import Options:</label>
                                        <div className="space-y-2">
                                            <label className="flex items-center">
                                                <input
                                                    type="radio"
                                                    name="wipeOption"
                                                    value="keep"
                                                    checked={wipeOption === 'keep'}
                                                    onChange={() => setWipeOption('keep')}
                                                    className="mr-2"
                                                />
                                                Keep existing questions
                                            </label>
                                            <label className="flex items-center">
                                                <input
                                                    type="radio"
                                                    name="wipeOption"
                                                    value="wipe"
                                                    checked={wipeOption === 'wipe'}
                                                    onChange={() => setWipeOption('wipe')}
                                                    className="mr-2"
                                                />
                                                Wipe all existing questions
                                            </label>
                                            <label className="flex items-center">
                                                <input
                                                    type="radio"
                                                    name="wipeOption"
                                                    value="replace"
                                                    checked={wipeOption === 'replace'}
                                                    onChange={() => setWipeOption('replace')}
                                                    className="mr-2"
                                                />
                                                Replace questions for selected province
                                            </label>
                                        </div>
                                    </div>
                                    
                                    <div>
                                        <label className="block mb-2 font-medium">
                                            Filter by Province:
                                            {wipeOption === 'replace' && <span className="ml-1 text-red-500">*</span>}
                                        </label>
                                        <select
                                            value={provinceFilter}
                                            onChange={(e) => setProvinceFilter(e.target.value)}
                                            className="w-full p-2 border rounded"
                                            disabled={importing}
                                        >
                                            <option value="">All Provinces ({questions.length} questions)</option>
                                            {provinces.map(province => {
                                                const count = questions.filter(q => q.provinceName === province).length;
                                                return (
                                                    <option key={province} value={province}>
                                                        {province} ({count} questions)
                                                    </option>
                                                );
                                            })}
                                        </select>
                                        {wipeOption === 'replace' && !provinceFilter && (
                                            <p className="mt-1 text-sm text-red-500">
                                                Please select a province when using "Replace" option
                                            </p>
                                        )}
                                    </div>
                                </div>
                                
                                <div className="p-3 mb-4 text-green-700 bg-green-100 rounded">
                                    <p className="font-medium">{questions.length} questions parsed from Excel:</p>
                                    <div className="mt-2 text-sm">
                                        {provinces.map(province => (
                                            <div key={province} className="mb-1">
                                                {province}: {questions.filter(q => q.provinceName === province).length} questions
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </>
                        )}
                        
                        {error && (
                            <div className="p-3 mb-4 text-red-700 bg-red-100 rounded">{error}</div>
                        )}
                        
                        {importStatus && (
                            <div className="p-3 mb-4 text-blue-700 bg-blue-100 rounded">{importStatus}</div>
                        )}
                        
                        {preview.length > 0 && (
                            <div className="mb-6">
                                <h2 className="mb-2 text-xl font-semibold">Preview:</h2>
                                <div className="overflow-x-auto">
                                    <table className="min-w-full bg-white border">
                                        <thead>
                                            <tr className="bg-gray-100">
                                                {preview[0].map((cell: any, i: number) => (
                                                    <th key={i} className="px-2 py-1 text-xs text-left border md:text-sm">
                                                        {cell || (i === 0 ? '#' : 
                                                            i === 1 ? 'Question' : 
                                                            i === 2 ? 'A' :
                                                            i === 3 ? 'B' :
                                                            i === 4 ? 'C' :
                                                            i === 5 ? 'D' :
                                                            i === 6 ? 'Key' : 'URL')}
                                                    </th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {preview.slice(1, 12).map((row: any, i: number) => (
                                                <tr key={i} className={i % 2 === 0 ? 'bg-gray-50' : ''}>
                                                    {row.map((cell: any, j: number) => (
                                                        <td key={j} className="px-2 py-1 border truncate max-w-[150px] text-xs md:text-sm">
                                                            {cell}
                                                        </td>
                                                    ))}
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                        
                        <div className="flex justify-between">
                            <button
                                onClick={handleImport}
                                className="px-6 py-2 text-white transition-colors bg-blue-500 rounded hover:bg-blue-600 disabled:opacity-50"
                                disabled={importing || 
                                        questions.length === 0 || 
                                        (wipeOption === 'replace' && !provinceFilter)}
                            >
                                {importing ? 'Importing...' : 'Import Questions'}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default QuestionManager;