import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Upload, 
  FileSpreadsheet, 
  CheckCircle, 
  AlertTriangle, 
  X, 
  RefreshCw,
  FileText,
  Download,
  Info
} from 'lucide-react';
import { parseXLSXFile, validateParsedData } from '../../utils/xlsxParser';
import { useTheme } from '../../contexts/ThemeContext';

const FileUpload = ({ onDataLoaded, onReset }) => {
  const { isPremium } = useTheme();
  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadResult, setUploadResult] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      processFile(files[0]);
    }
  };

  const handleFileSelect = (e) => {
    const files = e.target.files;
    if (files.length > 0) {
      processFile(files[0]);
    }
  };

  const processFile = async (file) => {
    // Validate file type
    const validTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel',
      '.xlsx',
      '.xls'
    ];
    
    const isValidType = validTypes.some(type => 
      file.type === type || file.name.toLowerCase().endsWith('.xlsx') || file.name.toLowerCase().endsWith('.xls')
    );

    if (!isValidType) {
      setUploadResult({
        success: false,
        error: 'Invalid file type. Please upload an Excel file (.xlsx or .xls)',
        fileName: file.name
      });
      return;
    }

    setIsProcessing(true);
    setUploadResult(null);

    try {
      const result = await parseXLSXFile(file);
      
      if (result.success) {
        // Validate the parsed data
        const validation = validateParsedData(result.data);
        
        // Transform data to match app format
        const transformedData = transformToAppFormat(result.data);
        
        setUploadResult({
          success: true,
          fileName: file.name,
          summary: result.summary,
          validation,
          data: transformedData
        });

        // Auto-load data if no critical errors
        if (result.summary.errors.length === 0) {
          onDataLoaded(transformedData);
        }
      } else {
        setUploadResult({
          success: false,
          error: result.error || 'Failed to parse file',
          fileName: file.name,
          summary: result.summary
        });
      }
    } catch (error) {
      setUploadResult({
        success: false,
        error: error.message || 'An unexpected error occurred',
        fileName: file.name
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Transform parsed XLSX data to match the app's expected format
  const transformToAppFormat = (parsedData) => {
    return {
      ClinkerDemand: parsedData.ClinkerDemand || [],
      ClinkerCapacity: parsedData.ClinkerCapacity || [],
      ProductionCost: parsedData.ProductionCost || [],
      LogisticsIUGU: parsedData.LogisticsIUGU || [],
      IUGUConstraint: parsedData.IUGUConstraint || [],
      IUGUOpeningStock: parsedData.IUGUOpeningStock || [],
      IUGUClosingStock: parsedData.IUGUClosingStock || [],
      IUGUType: parsedData.IUGUType || [],
      HubOpeningStock: parsedData.HubOpeningStock || []
    };
  };

  const handleApplyData = () => {
    if (uploadResult?.data) {
      onDataLoaded(uploadResult.data);
    }
  };

  const handleReset = () => {
    setUploadResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onReset();
  };

  const clearUpload = () => {
    setUploadResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
          isDragging
            ? isPremium
              ? 'border-premium-neon bg-premium-neon/10'
              : 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
            : isPremium
              ? 'border-premium-gold/30 hover:border-premium-gold/50 bg-premium-dark/50'
              : 'border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500 bg-gray-50 dark:bg-gray-800/50'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".xlsx,.xls"
          onChange={handleFileSelect}
          className="hidden"
        />
        
        {isProcessing ? (
          <div className="flex flex-col items-center">
            <RefreshCw className={`h-12 w-12 animate-spin mb-4 ${
              isPremium ? 'text-premium-neon' : 'text-blue-500'
            }`} />
            <p className={`text-lg font-medium ${
              isPremium ? 'text-premium-gold' : 'text-gray-900 dark:text-white'
            }`}>
              Processing Excel file...
            </p>
            <p className={`text-sm mt-1 ${
              isPremium ? 'text-gray-400' : 'text-gray-500 dark:text-gray-400'
            }`}>
              Parsing sheets and validating data
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <div className={`p-4 rounded-full mb-4 ${
              isPremium ? 'bg-premium-gold/20' : 'bg-blue-100 dark:bg-blue-900/30'
            }`}>
              <Upload className={`h-8 w-8 ${
                isPremium ? 'text-premium-gold' : 'text-blue-600 dark:text-blue-400'
              }`} />
            </div>
            <p className={`text-lg font-medium ${
              isPremium ? 'text-premium-gold' : 'text-gray-900 dark:text-white'
            }`}>
              Drop your Excel file here
            </p>
            <p className={`text-sm mt-1 ${
              isPremium ? 'text-gray-400' : 'text-gray-500 dark:text-gray-400'
            }`}>
              or click to browse (.xlsx, .xls)
            </p>
          </div>
        )}
      </div>

      {/* Upload Result */}
      <AnimatePresence>
        {uploadResult && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`rounded-xl p-4 ${
              uploadResult.success
                ? isPremium
                  ? 'bg-green-900/20 border border-green-500/30'
                  : 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
                : isPremium
                  ? 'bg-red-900/20 border border-red-500/30'
                  : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3">
                {uploadResult.success ? (
                  <CheckCircle className="h-6 w-6 text-green-500 mt-0.5" />
                ) : (
                  <AlertTriangle className="h-6 w-6 text-red-500 mt-0.5" />
                )}
                <div>
                  <h4 className={`font-medium ${
                    uploadResult.success
                      ? 'text-green-800 dark:text-green-200'
                      : 'text-red-800 dark:text-red-200'
                  }`}>
                    {uploadResult.success ? 'File Processed Successfully' : 'Processing Failed'}
                  </h4>
                  <p className={`text-sm mt-1 ${
                    uploadResult.success
                      ? 'text-green-600 dark:text-green-300'
                      : 'text-red-600 dark:text-red-300'
                  }`}>
                    {uploadResult.fileName}
                  </p>
                  {uploadResult.error && (
                    <p className="text-sm text-red-600 dark:text-red-300 mt-2">
                      {uploadResult.error}
                    </p>
                  )}
                </div>
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); clearUpload(); }}
                className={`p-1 rounded hover:bg-black/10 ${
                  uploadResult.success ? 'text-green-600' : 'text-red-600'
                }`}
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Summary Details */}
            {uploadResult.summary && (
              <div className="mt-4">
                <button
                  onClick={(e) => { e.stopPropagation(); setShowDetails(!showDetails); }}
                  className={`flex items-center text-sm font-medium ${
                    uploadResult.success
                      ? 'text-green-700 dark:text-green-300'
                      : 'text-red-700 dark:text-red-300'
                  }`}
                >
                  <Info className="h-4 w-4 mr-1" />
                  {showDetails ? 'Hide Details' : 'Show Details'}
                </button>

                <AnimatePresence>
                  {showDetails && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="mt-3 space-y-3 text-sm">
                        {/* Sheets Used */}
                        {uploadResult.summary.sheetsUsed?.length > 0 && (
                          <div>
                            <p className={`font-medium ${
                              isPremium ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'
                            }`}>
                              Sheets Processed ({uploadResult.summary.sheetsUsed.length}):
                            </p>
                            <div className="flex flex-wrap gap-2 mt-1">
                              {uploadResult.summary.sheetsUsed.map((sheet, i) => (
                                <span
                                  key={i}
                                  className={`inline-flex items-center px-2 py-1 rounded text-xs ${
                                    isPremium
                                      ? 'bg-premium-gold/20 text-premium-gold'
                                      : 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200'
                                  }`}
                                >
                                  <FileSpreadsheet className="h-3 w-3 mr-1" />
                                  {sheet.mapped}
                                  {uploadResult.summary.recordCounts?.[sheet.mapped] && (
                                    <span className="ml-1 opacity-70">
                                      ({uploadResult.summary.recordCounts[sheet.mapped]} rows)
                                    </span>
                                  )}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Sheets Ignored */}
                        {uploadResult.summary.sheetsIgnored?.length > 0 && (
                          <div>
                            <p className={`font-medium ${
                              isPremium ? 'text-gray-400' : 'text-gray-600 dark:text-gray-400'
                            }`}>
                              Sheets Ignored ({uploadResult.summary.sheetsIgnored.length}):
                            </p>
                            <p className={`text-xs ${
                              isPremium ? 'text-gray-500' : 'text-gray-500 dark:text-gray-500'
                            }`}>
                              {uploadResult.summary.sheetsIgnored.join(', ')}
                            </p>
                          </div>
                        )}

                        {/* Warnings */}
                        {uploadResult.summary.warnings?.length > 0 && (
                          <div>
                            <p className="font-medium text-yellow-700 dark:text-yellow-300">
                              Warnings ({uploadResult.summary.warnings.length}):
                            </p>
                            <ul className="list-disc list-inside text-xs text-yellow-600 dark:text-yellow-400">
                              {uploadResult.summary.warnings.slice(0, 5).map((w, i) => (
                                <li key={i}>{w}</li>
                              ))}
                              {uploadResult.summary.warnings.length > 5 && (
                                <li>...and {uploadResult.summary.warnings.length - 5} more</li>
                              )}
                            </ul>
                          </div>
                        )}

                        {/* Errors */}
                        {uploadResult.summary.errors?.length > 0 && (
                          <div>
                            <p className="font-medium text-red-700 dark:text-red-300">
                              Errors ({uploadResult.summary.errors.length}):
                            </p>
                            <ul className="list-disc list-inside text-xs text-red-600 dark:text-red-400">
                              {uploadResult.summary.errors.map((e, i) => (
                                <li key={i}>{e}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* Action Buttons */}
            {uploadResult.success && uploadResult.summary?.errors?.length === 0 && (
              <div className="mt-4 flex space-x-3">
                <button
                  onClick={(e) => { e.stopPropagation(); handleApplyData(); }}
                  className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isPremium
                      ? 'bg-gradient-to-r from-premium-gold to-premium-neon text-premium-dark hover:shadow-lg'
                      : 'bg-green-600 text-white hover:bg-green-700'
                  }`}
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Apply Data
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reset Button */}
      <div className="flex items-center justify-between pt-2">
        <div className={`text-xs ${
          isPremium ? 'text-gray-500' : 'text-gray-500 dark:text-gray-400'
        }`}>
          <p>Supported sheets: ClinkerDemand, ClinkerCapacity, ProductionCost, LogisticsIUGU, IUGUConstraint, IUGUOpeningStock, IUGUClosingStock, IUGUType</p>
        </div>
        <button
          onClick={handleReset}
          className={`flex items-center px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
            isPremium
              ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
          }`}
        >
          <RefreshCw className="h-4 w-4 mr-1" />
          Reset to Demo Data
        </button>
      </div>
    </div>
  );
};

export default FileUpload;
