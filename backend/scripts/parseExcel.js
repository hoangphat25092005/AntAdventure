const xlsx = require('xlsx');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

// Import Question model
const Question = require('../models/questions.model');

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected');
  } catch (err) {
    console.error('Failed to connect to MongoDB', err);
    process.exit(1);
  }
};

// Function to read Excel file and convert to JSON
const readExcel = (filePath) => {
  try {
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(worksheet, { header: 1, defval: "" });
    return data;
  } catch (error) {
    console.error('Error reading Excel file:', error);
    return [];
  }
};

// Function to wipe existing questions
const wipeExistingQuestions = async (province = null) => {
  try {
    let query = {};
    if (province) {
      // Delete questions for specific province only
      query = { provinceName: province };
    }

    const result = await Question.deleteMany(query);
    console.log(`Wiped ${result.deletedCount} questions${province ? ` for province ${province}` : ''}`);
    return result.deletedCount;
  } catch (error) {
    console.error('Error wiping questions:', error);
    throw error;
  }
};

// Function to convert letter key (A, B, C, D) to numeric index (0, 1, 2, 3)
const keyToIndex = (key) => {
  switch (key) {
    case 'A': return 0;
    case 'B': return 1;
    case 'C': return 2;
    case 'D': return 3;
    default: return 0; // Default to first option if key is invalid
  }
};

// Parse the Excel data into question objects
const parseQuestions = (data) => {
  const questions = [];
  let currentProvince = null;
  let headerRow = -1;
  
  // Find province header rows
  for (let rowIndex = 0; rowIndex < data.length; rowIndex++) {
    const row = data[rowIndex];
    
    // If this row spans multiple cells and is centered, it's likely a province header
    if (row[0] === '' && row[2] === '' && row[1] && row[1].trim() !== '') {
      currentProvince = row[1].trim();
      headerRow = rowIndex;
      
      // Skip header row and process questions for this province
      let questionIndex = 0;
      
      // Starting from 2 rows after the province header (to skip the column headers)
      for (let qRow = headerRow + 2; qRow < data.length; qRow++) {
        const questionRow = data[qRow];
        
        // If we've reached a blank row or a new province header, stop processing
        if (!questionRow[0] && !questionRow[1] && !questionRow[2]) {
          break;
        }
        
        // Skip if no question number in column 0
        if (!questionRow[0]) {
          continue;
        }
        
        // Question text is in column 1
        const questionText = questionRow[1];
        if (!questionText) continue;
        
        // Options A, B, C, D are across columns for each question
        const options = [
          questionRow[2] || '', // Option A
          questionRow[3] || '', // Option B
          questionRow[4] || '', // Option C
          questionRow[5] || ''  // Option D
        ];
        
        // Get the correct answer key
        const correctAnswerKey = questionRow[6] || 'A';
        const correctAnswerIndex = keyToIndex(correctAnswerKey);
        
        // Image URL is in column 7
        const imageUrl = questionRow[7] ? questionRow[7].toString().trim() : '';
        
        questions.push({
          provinceName: currentProvince,
          question: questionText,
          options: options,
          correctAnswer: correctAnswerIndex,
          image: imageUrl && imageUrl.startsWith('http') ? imageUrl : undefined
        });
        
        questionIndex++;
      }
      
      console.log(`Found ${questionIndex} questions for province "${currentProvince}"`);
    }
  }
  
  return questions;
};

// Import questions to MongoDB
const importQuestions = async (questions) => {
  try {
    // Group questions by province for summary
    const provinceGroups = {};
    for (const q of questions) {
      if (!provinceGroups[q.provinceName]) {
        provinceGroups[q.provinceName] = 0;
      }
      provinceGroups[q.provinceName]++;
    }
    
    // Insert all questions
    const result = await Question.insertMany(questions);
    console.log(`${result.length} questions imported successfully`);
    
    // Print summary
    console.log('Imported questions by province:');
    for (const [province, count] of Object.entries(provinceGroups)) {
      console.log(`- ${province}: ${count} questions`);
    }
    
    return result;
  } catch (error) {
    console.error('Error importing questions:', error);
    if (error.name === 'ValidationError') {
      for (const field in error.errors) {
        console.error(`Validation error in field ${field}:`, error.errors[field].message);
      }
    }
    throw error;
  }
};

// Main function
const main = async () => {
  try {
    await connectDB();
    
    // Replace with the path to your Excel file
    const filePath = path.join(__dirname, '..', 'data', 'questions.xlsx');
    
    console.log(`Reading Excel file from: ${filePath}`);
    
    if (!fs.existsSync(filePath)) {
      console.error(`File not found: ${filePath}`);
      console.log('Please place your Excel file at the specified location.');
      process.exit(1);
    }
    
    const excelData = readExcel(filePath);
    if (excelData.length === 0) {
      console.error('No data found in Excel file.');
      process.exit(1);
    }
    
    const questions = parseQuestions(excelData);
    console.log(`Parsed ${questions.length} questions from Excel`);
    
    if (questions.length === 0) {
      console.error('No valid questions were parsed from the Excel file.');
      console.log('Please check your file format.');
      process.exit(1);
    }
    
    // Show the first question as a sample
    if (questions.length > 0) {
      console.log('Sample question:', JSON.stringify(questions[0], null, 2));
    }
    
    // Ask for confirmation before importing
    console.log('\nDo you want to wipe existing questions before importing? (yes/no/province):');
    const readLine = require('readline').createInterface({
      input: process.stdin,
      output: process.stdout
    });
    
    readLine.question('', async (answer) => {
      if (answer.toLowerCase() === 'yes') {
        // Wipe all questions
        await wipeExistingQuestions();
        await importQuestions(questions);
        console.log('All existing questions were removed and new questions imported.');
      } else if (answer.toLowerCase() === 'no') {
        // Just import without wiping
        await importQuestions(questions);
        console.log('New questions were added without removing existing ones.');
      } else if (answer.trim() !== '') {
        // Wipe questions for a specific province
        const province = answer.trim();
        await wipeExistingQuestions(province);
        
        // Filter questions to import only for specified province
        const filteredQuestions = questions.filter(q => q.provinceName === province);
        
        if (filteredQuestions.length > 0) {
          await importQuestions(filteredQuestions);
          console.log(`Questions for province "${province}" were replaced successfully.`);
        } else {
          console.log(`No questions found for province "${province}" in the Excel file.`);
        }
      } else {
        console.log('Import cancelled');
      }
      
      readLine.close();
      mongoose.disconnect();
      console.log('Disconnected from MongoDB');
    });
    
  } catch (error) {
    console.error('Error in import process:', error);
    mongoose.disconnect();
  }
};

main();