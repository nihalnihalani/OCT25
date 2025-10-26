// scripts/check-env.js
const fs = require('fs');
const path = require('path');

console.log('🔍 Checking Environment Variables...\n');

const envPath = path.join(process.cwd(), '.env.local');

// Check if .env.local exists
if (!fs.existsSync(envPath)) {
  console.log('ℹ️ .env.local file not found. Creating one...');
  fs.writeFileSync(envPath, `# OpenAI API Configuration
OPENAI_API_KEY=

# Application Configuration
NEXT_PUBLIC_APP_NAME=BUD-DY Advisor
NODE_ENV=development
`);
  console.log('✅ Created .env.local file');
}

// Read and parse .env.local
const envContent = fs.readFileSync(envPath, 'utf8');
const lines = envContent.split('\n');

const requiredVars = []; // No required vars - app works without OpenAI

const optionalVars = [
  'NEXT_PUBLIC_APP_NAME',
  'NODE_ENV',
  'OPENAI_API_KEY'
];

const issues = [];
const envVars = {};

// Parse environment variables
lines.forEach((line, index) => {
  const trimmedLine = line.trim();
  if (trimmedLine && !trimmedLine.startsWith('#')) {
    const [key, ...valueParts] = trimmedLine.split('=');
    if (key && valueParts.length > 0) {
      const value = valueParts.join('=');
      envVars[key.trim()] = value;
    }
  }
});

// Check each required variable
requiredVars.forEach(varName => {
  const value = envVars[varName];
  
  if (!value) {
    issues.push({
      variable: varName,
      issue: 'Missing',
      line: null,
      suggestion: `Add: ${varName}=your_value`
    });
    return;
  }

  // Find line number for better error reporting
  const lineIndex = lines.findIndex(line => line.includes(`${varName}=`));
  const lineNumber = lineIndex + 1;

  // Check for quotes (not needed in .env files)
  if (value.startsWith('"') && value.endsWith('"')) {
    issues.push({
      variable: varName,
      issue: 'Unnecessary quotes',
      line: lineNumber,
      value: value,
      suggestion: `Remove quotes: ${varName}=${value.slice(1, -1)}`
    });
  }

  // Check for whitespace
  if (value !== value.trim()) {
    issues.push({
      variable: varName,
      issue: 'Leading/trailing whitespace',
      line: lineNumber,
      value: JSON.stringify(value),
      suggestion: `Trim whitespace: ${varName}=${value.trim()}`
    });
  }

  // Check for newlines
  if (value.includes('\\n') || value.includes('\n')) {
    issues.push({
      variable: varName,
      issue: 'Contains newline characters',
      line: lineNumber,
      value: JSON.stringify(value),
      suggestion: 'Remove all \\n or line breaks'
    });
  }

  // No special validation needed for local setup
});

// Report results
if (issues.length === 0) {
  console.log('✅ Environment configured!\n');
  console.log('Configuration:');
  optionalVars.forEach(varName => {
    const value = envVars[varName];
    if (value) {
      const displayValue = varName.includes('API_KEY') ? '[SET]' : value.substring(0, 30) + (value.length > 30 ? '...' : '');
      console.log(`  ${varName}: ${displayValue}`);
    } else {
      const status = varName === 'OPENAI_API_KEY' ? '(not required)' : '(not set)';
      console.log(`  ${varName}: ${status}`);
    }
  });
  
  if (!envVars['OPENAI_API_KEY']) {
    console.log('\nℹ️  Note: OPENAI_API_KEY is not set. Voice features are disabled.');
    console.log('   To enable voice features, add your API key to .env.local');
  }
} else {
  console.error(`❌ Found ${issues.length} issue(s) with your environment variables:\n`);
  
  issues.forEach((issue, index) => {
    console.log(`${index + 1}. ${issue.variable}`);
    console.log(`   Issue: ${issue.issue}`);
    if (issue.line) {
      console.log(`   Line: ${issue.line}`);
    }
    if (issue.value) {
      console.log(`   Current value: ${issue.value}`);
    }
    console.log(`   Fix: ${issue.suggestion}`);
    console.log('');
  });

  console.log('\n📝 How to fix:');
  console.log('1. Open .env.local in your editor');
  console.log('2. Fix the issues listed above');
  console.log('3. Save the file');
  console.log('4. Restart your development server (npm run dev)');
  
  // Offer to create a corrected version
  console.log('\n💡 Tip: Make sure to copy values directly from Firebase Console without any modifications.');
}

// Check if we should create a fixed version
if (issues.length > 0 && process.argv.includes('--fix')) {
  console.log('\n🔧 Creating .env.local.fixed with corrections...');
  
  const fixedVars = { ...envVars };
  
  // Apply fixes
  issues.forEach(issue => {
    if (issue.variable && fixedVars[issue.variable]) {
      let value = fixedVars[issue.variable];
      // Remove quotes
      value = value.replace(/^["']|["']$/g, '');
      // Trim whitespace
      value = value.trim();
      // Remove newlines
      value = value.replace(/\\n/g, '').replace(/\n/g, '');
      
      fixedVars[issue.variable] = value;
    }
  });
  
  // Write fixed version
  const fixedContent = Object.entries(fixedVars)
    .map(([key, value]) => `${key}=${value}`)
    .join('\n');
  
  fs.writeFileSync(path.join(process.cwd(), '.env.local.fixed'), fixedContent);
  console.log('✅ Created .env.local.fixed - review and rename to .env.local if correct');
}