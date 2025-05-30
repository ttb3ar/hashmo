const themeToggle = document.getElementById("checkbox");
const langToggle = document.getElementById("language-checkbox");
const langLabel = document.querySelector(".lang-label");
const title = document.getElementById("title");

let isJapanese = false;

// Language translations object
const translations = {
  en: {
    title: "Hashing Demo",
    subtitle: "Explore MD5, SHA-1, and SHA-256 + file verification",
    textLabel: "Text to Hash:",
    textPlaceholder: "Enter text here...",
    fileLabel: "File for Integrity Check (SHA-256):",
    expectedHashPlaceholder: "Expected SHA-256 hash",
    verifyButton: "Verify File",
    footer: "Created by TTB3AR",
    emptyTextError: "Please enter some text to hash.",
    selectFileError: "Please select a file.",
    enterHashError: "Please enter the expected hash.",
    invalidHashError: "Invalid hash format. SHA-256 hash should be 64 hexadecimal characters.",
    calculatingHash: "Calculating hash...",
    hashMatch: "✓ File hash matches!",
    hashMismatch: "✗ Hash mismatch!",
    fileError: "Error verifying file:"
  },
  jp: {
    title: "ハッシュデモ",
    subtitle: "MD5・SHA-1・SHA-256 とファイル検証",
    textLabel: "ハッシュ化するテキスト:",
    textPlaceholder: "テキストを入力してください...",
    fileLabel: "整合性チェック用ファイル (SHA-256):",
    expectedHashPlaceholder: "期待されるSHA-256ハッシュ",
    verifyButton: "ファイル検証",
    footer: "TTB3AR制作",
    emptyTextError: "ハッシュ化するテキストを入力してください。",
    selectFileError: "ファイルを選択してください。",
    enterHashError: "期待されるハッシュを入力してください。",
    invalidHashError: "無効なハッシュ形式です。SHA-256ハッシュは64文字の16進数である必要があります。",
    calculatingHash: "ハッシュを計算中...",
    hashMatch: "✓ ファイルハッシュが一致しました！",
    hashMismatch: "✗ ハッシュが一致しません！",
    fileError: "ファイル検証エラー:"
  }
};

// Local Storage Functions
function saveTheme(theme) {
  try {
    localStorage.setItem('hashingDemo_theme', theme);
  } catch (error) {
    console.warn('Could not save theme preference:', error);
  }
}

function loadTheme() {
  try {
    return localStorage.getItem('hashingDemo_theme') || 'light';
  } catch (error) {
    console.warn('Could not load theme preference:', error);
    return 'light';
  }
}

function saveLanguage(language) {
  try {
    localStorage.setItem('hashingDemo_language', language);
  } catch (error) {
    console.warn('Could not save language preference:', error);
  }
}

function loadLanguage() {
  try {
    return localStorage.getItem('hashingDemo_language') || 'en';
  } catch (error) {
    console.warn('Could not load language preference:', error);
    return 'en';
  }
}

// Theme handling
function setTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  saveTheme(theme);
}

function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  const newTheme = currentTheme === 'light' ? 'dark' : 'light';
  setTheme(newTheme);
}

function initializeTheme() {
  const savedTheme = loadTheme();
  setTheme(savedTheme);
  
  // Update the toggle switch to match the saved theme
  themeToggle.checked = (savedTheme === 'dark');
}

// Language handling
function setLanguage(language) {
  document.documentElement.setAttribute('data-language', language);
  isJapanese = (language === 'jp');
  updateUILanguage(language);
  saveLanguage(language);
}

function toggleLanguage() {
  const contentElements = document.querySelectorAll('#title, #subtitle, #text-label, #file-label, #verify-button, #footer-text');
  
  contentElements.forEach(element => {
    element.classList.add('transition-content');
  });
  
  document.body.offsetHeight;
  
  contentElements.forEach(element => {
    element.classList.add('fade-out');
  });
  
  setTimeout(() => {
    const newLanguage = isJapanese ? 'en' : 'jp';
    setLanguage(newLanguage);
    
    langLabel.textContent = isJapanese ? "JP" : "EN";
    
    showLanguageIndicator(newLanguage);
    
    setTimeout(() => {
      contentElements.forEach(element => {
        element.classList.remove('fade-out');
      });
      
      setTimeout(() => {
        contentElements.forEach(element => {
          element.classList.remove('transition-content');
        });
      }, 300);
    }, 50);
  }, 300);
}

function initializeLanguage() {
  const savedLanguage = loadLanguage();
  isJapanese = (savedLanguage === 'jp');
  
  // Update the toggle switch to match the saved language
  langToggle.checked = isJapanese;
  langLabel.textContent = isJapanese ? "JP" : "EN";
  
  setLanguage(savedLanguage);
}

function updateUILanguage(language) {
  const texts = translations[language];
  
  document.getElementById('title').textContent = texts.title;
  document.getElementById('subtitle').textContent = texts.subtitle;
  document.getElementById('text-label').textContent = texts.textLabel;
  document.getElementById('textInput').placeholder = texts.textPlaceholder;
  document.getElementById('file-label').textContent = texts.fileLabel;
  document.getElementById('expectedHash').placeholder = texts.expectedHashPlaceholder;
  document.getElementById('verify-button').textContent = texts.verifyButton;
  document.getElementById('footer-text').textContent = texts.footer;
  document.title = texts.title;
}

function showLanguageIndicator(language) {
  let indicator = document.querySelector('.language-indicator');
  
  if (!indicator) {
    indicator = document.createElement('div');
    indicator.className = 'language-indicator';
    document.body.appendChild(indicator);
  }
  
  indicator.textContent = language === 'en' ? 'English' : '日本語';
  indicator.classList.add('show');
  
  setTimeout(() => {
    indicator.classList.remove('show');
  }, 1500);
}

/**
 * Generate hash for the input text using specified algorithm
 * @param {string} algorithm - The hashing algorithm (MD5, SHA-1, SHA-256)
 */
async function runHash(algorithm) {
  const input = document.getElementById("textInput").value;
  const resultElement = document.getElementById("hashResult");
  const texts = translations[isJapanese ? 'jp' : 'en'];
  
  if (!input.trim()) {
    resultElement.textContent = texts.emptyTextError;
    resultElement.style.color = "var(--danger)";
    return;
  }
  
  let hash = "";
  
  try {
    switch (algorithm) {
      case "MD5":
        hash = CryptoJS.MD5(input).toString();
        break;
      case "SHA-1":
        hash = CryptoJS.SHA1(input).toString();
        break;
      case "SHA-256":
        hash = CryptoJS.SHA256(input).toString();
        break;
      default:
        throw new Error("Unsupported algorithm");
    }
    
    resultElement.textContent = `${algorithm} Hash:\n${hash}`;
    resultElement.style.color = "inherit";
  } catch (error) {
    resultElement.textContent = `Error generating ${algorithm} hash: ${error.message}`;
    resultElement.style.color = "var(--danger)";
  }
}

/**
 * Verify file integrity by comparing SHA-256 hashes
 */
async function verifyFile() {
  const fileInput = document.getElementById("fileInput").files[0];
  const expected = document.getElementById("expectedHash").value.trim().toLowerCase();
  const result = document.getElementById("fileResult");
  const texts = translations[isJapanese ? 'jp' : 'en'];

  // Clear previous results
  result.textContent = "";
  result.style.color = "inherit";

  // Validate inputs
  if (!fileInput) {
    result.textContent = texts.selectFileError;
    result.style.color = "var(--danger)";
    return;
  }
  
  if (!expected) {
    result.textContent = texts.enterHashError;
    result.style.color = "var(--danger)";
    return;
  }

  // Validate hash format (SHA-256 should be 64 hex characters)
  const hashRegex = /^[a-f0-9]{64}$/i;
  if (!hashRegex.test(expected)) {
    result.textContent = texts.invalidHashError;
    result.style.color = "var(--danger)";
    return;
  }

  try {
    // Show loading state
    result.textContent = texts.calculatingHash;
    result.style.color = "inherit";

    // Calculate SHA-256 hash of the file
    const buffer = await fileInput.arrayBuffer();
    const digest = await crypto.subtle.digest("SHA-256", buffer);
    const hashArray = Array.from(new Uint8Array(digest));
    const actualHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

    // Compare hashes
    if (actualHash === expected) {
      result.textContent = `${texts.hashMatch}\nFile: ${fileInput.name}\nHash: ${actualHash}`;
      result.style.color = "var(--success)";
    } else {
      result.textContent = `${texts.hashMismatch}\nFile: ${fileInput.name}\nExpected: ${expected}\nActual: ${actualHash}`;
      result.style.color = "var(--danger)";
    }
  } catch (error) {
    result.textContent = `${texts.fileError} ${error.message}`;
    result.style.color = "var(--danger)";
  }
}

/**
 * Initialize the application
 */
function init() {
  // Initialize saved preferences first
  initializeTheme();
  initializeLanguage();
  
  // Then set up event listeners
  themeToggle.addEventListener("change", toggleTheme);
  langToggle.addEventListener("change", toggleLanguage);
  
  // Add keyboard event listeners
  document.getElementById('textInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      runHash('SHA-256'); // Default to SHA-256 on Enter
    }
  });
  
  document.getElementById('expectedHash').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      verifyFile();
    }
  });
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', init);
