// A simple test script to verify xlsx and axios imports
// @ts-ignore
import * as XLSX from 'xlsx';
// @ts-ignore
import axios from 'axios';

console.log('XLSX type:', typeof XLSX);
console.log('Axios type:', typeof axios);

// Simple check if the objects exist
if (XLSX && axios) {
  console.log('Both imports are available');
}

console.log('XLSX keys:', Object.keys(XLSX));
console.log('Axios keys:', Object.keys(axios));

console.log('Test completed!');
