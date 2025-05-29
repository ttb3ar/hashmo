const translations = {
  en: { 
    title: "Hashing Demo", 
    subtitle: "Explore MD5, SHA-1, and SHA-256 + file verification" 
  },
  jp: { 
    title: "ハッシュデモ", 
    subtitle: "MD5・SHA-1・SHA-256 とファイル検証" 
  }
};

let isJapanese = false;

/**
 * Toggle between light and dark themes
 */
function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme');
  const newTheme = current === 'light' ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', newTheme);
  
  // Update theme icon
  const themeIcon = document.querySelector('.theme-switch i');
  themeIcon.className = newTheme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
}

/**
 * Toggle between English and Japanese languages
 */
function toggleLanguage() {
  isJapanese = !isJapanese;
  const lang = isJapanese ? 'jp' : 'en';
  
  document.getElementById('title').textContent = translations[lang].title;
  document.getElementById('subtitle').textContent = translations[lang].subtitle;
  
  // Update language attribute
  document.documentElement.setAttribute('data-language', lang);
}

/**
 * Generate hash for the input text using specified algorithm
 * @param {string} algorithm - The hashing algorithm (MD5, SHA-1, SHA-256)
 */
async function runHash(algorithm) {
  const input = document.getElementById("textInput").value;
  const resultElement = document.getElementById("hashResult");
  
  if (!input.trim()) {
    resultElement.textContent = "Please enter some text to hash.";
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

  // Clear previous results
  result.textContent = "";
  result.style.color = "inherit";

  // Validate inputs
  if (!fileInput) {
    result.textContent = "Please select a file.";
    result.style.color = "var(--danger)";
    return;
  }
  
  if (!expected) {
    result.textContent = "Please enter the expected hash.";
    result.style.color = "var(--danger)";
    return;
  }

  // Validate hash format (SHA-256 should be 64 hex characters)
  const hashRegex = /^[a-f0-9]{64}$/i;
  if (!hashRegex.test(expected)) {
    result.textContent = "Invalid hash format. SHA-256 hash should be 64 hexadecimal characters.";
    result.style.color = "var(--danger)";
    return;
  }

  try {
    // Show loading state
    result.textContent = "Calculating hash...";
    result.style.color = "inherit";

    // Calculate SHA-256 hash of the file
    const buffer = await fileInput.arrayBuffer();
    const digest = await crypto.subtle.digest("SHA-256", buffer);
    const hashArray = Array.from(new Uint8Array(digest));
    const actualHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

    // Compare hashes
    if (actualHash === expected) {
      result.textContent = `✓ File hash matches!\nFile: ${fileInput.name}\nHash: ${actualHash}`;
      result.style.color = "var(--success)";
    } else {
      result.textContent = `✗ Hash mismatch!\nFile: ${fileInput.name}\nExpected: ${expected}\nActual: ${actualHash}`;
      result.style.color = "var(--danger)";
    }
  } catch (error) {
    result.textContent = `Error verifying file: ${error.message}`;
    result.style.color = "var(--danger)";
  }
}

/**
 * Initialize the application
 */
function init() {
  // Set initial theme icon
  const themeIcon = document.querySelector('.theme-switch i');
  const currentTheme = document.documentElement.getAttribute('data-theme');
  themeIcon.className = currentTheme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
  
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
