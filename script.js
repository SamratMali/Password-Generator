const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");
const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#number");
const symbolsCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generateButton");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const symbols = '~`!@#$%^&*()_+={}[]:;"<,>.?/';

let password = "";
let passwordLength = 15;
let checkCount = 0;

handleSlider();

// Set PasswordLength
function handleSlider() {
  inputSlider.value = passwordLength;
  lengthDisplay.innerText = passwordLength;
}

function setIndicator(color) {
  indicator.style.backgroundColor = color;
}

function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function generateRandomNumber() {
  return getRndInteger(0, 10);
}

function generateLowerCase() {
  return String.fromCharCode(getRndInteger(97, 123));
}

function generateUpperCase() {
  return String.fromCharCode(getRndInteger(65, 91));
}

function generateSymbol() {
  const randNum = getRndInteger(0, symbols.length);
  return symbols.charAt(randNum);
}

function calcStrength() {
  let hasUpper = uppercaseCheck.checked;
  let hasLower = lowercaseCheck.checked;
  let hasNum = numbersCheck.checked;
  let hasSym = symbolsCheck.checked;

  if (hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8) {
    setIndicator("#0f0");
  } else if (
    (hasLower || hasUpper) &&
    (hasNum || hasSym) &&
    passwordLength >= 6
  ) {
    setIndicator("#ff0");
  } else {
    setIndicator("#f00");
  }
}

async function copyContent() {
  try {
    await navigator.clipboard.writeText(passwordDisplay.value);
    copyMsg.innerText = "Copied";
  } catch (e) {
    copyMsg.innerText = "Failed";
  }
  copyMsg.classList.add("active");

  setTimeout(() => {
    copyMsg.classList.remove("active");
  }, 2000);
}

inputSlider.addEventListener("input", (e) => {
  passwordLength = e.target.value;
  handleSlider();
});

copyBtn.addEventListener("click", () => {
  if (passwordDisplay.value) {
    copyContent();
  }
});

function shufflePassword(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array.join("");
}

function handleCheckBoxChange() {
  checkCount = 0;
  allCheckBox.forEach((checkbox) => {
    if (checkbox.checked) checkCount++;
  });

  if (passwordLength < checkCount) {
    passwordLength = checkCount;
    handleSlider();
  }
}

allCheckBox.forEach((checkbox) => {
  checkbox.addEventListener("change", handleCheckBoxChange);
});

generateBtn.addEventListener("click", () => {
  if (checkCount <= 0) return;

  if (passwordLength < checkCount) {
    passwordLength = checkCount;
    handleSlider();
  }

  password = "";

  let funcArr = [];

  if (uppercaseCheck.checked) {
    funcArr.push(generateUpperCase);
  }
  if (lowercaseCheck.checked) {
    funcArr.push(generateLowerCase);
  }
  if (numbersCheck.checked) {
    funcArr.push(generateRandomNumber);
  }
  if (symbolsCheck.checked) {
    funcArr.push(generateSymbol);
  }

  // Compulsory Addition
  for (let i = 0; i < funcArr.length; i++) {
    password += funcArr[i]();
  }

  // Remaining addition
  for (let i = 0; i < passwordLength - funcArr.length; i++) {
    let randIndex = getRndInteger(0, funcArr.length);
    password += funcArr[randIndex]();
  }

  password = shufflePassword(Array.from(password));

  passwordDisplay.value = password;

  calcStrength();
});
