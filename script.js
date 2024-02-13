const inputSlider = document.querySelector("[slider]");
const lengthDisplay = document.querySelector(".lengthCount");
const passwordDisplay = document.querySelector("[data-passwordDisplay");
const copyBtn = document.querySelector(".copyBtn");
const copyMsg = document.querySelector(".tooltip");
const upperCaseCheck = document.querySelector("#uppercase");
const lowerCaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const indicator = document.querySelector(".indicator");
const generateBtn = document.querySelector("[generateBtn]");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const symbols = '~`!@#$%^&*()_-+={[}]|:;"<,>.?/';

let password = "";
let passwordLength = 10;
let checkCount = 0;
handleSlider();
upperCaseCheck.checked = true;
setIndicator("#ccc");

// set Password length
function handleSlider() {
  inputSlider.value = passwordLength;
  lengthDisplay.innerText = passwordLength;

  const min = inputSlider.min;
  const max = inputSlider.max;
  inputSlider.style.backgroundSize =
    ((passwordLength - min) * 100) / (max - min) + "% 100%";
}
function setIndicator(color) {
  indicator.style.backgroundColor = color;
  indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}
function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}
function generateRandomNumber() {
  return getRndInteger(0, 9);
}
function generateUpperCase() {
  return String.fromCharCode(getRndInteger(65, 91));
}
function generateLowerCase() {
  return String.fromCharCode(getRndInteger(97, 123));
}
function generateSymbol() {
  const randNum = getRndInteger(0, symbols.length);
  return symbols.charAt(randNum);
}
function calcStrength() {
  let hasUpper = false;
  let hasLower = false;
  let hasNum = false;
  let hasSym = false;
  if (upperCaseCheck.checked) hasUpper = true;
  if (lowerCaseCheck.checked) hasLower = true;
  if (numbersCheck.checked) hasNum = true;
  if (symbolsCheck.checked) hasSym = true;

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
    copyMsg.innerText = "copied";
  } catch (error) {
    copyMsg.innerText = "Failed";
  }
  copyMsg.classList.add("active");

  setTimeout(() => {
    copyMsg.classList.remove("active");
  }, 2000);
}
function shufflePassword(array) {
  //Fisher Yates Method
  for (let i = array.length - 1; i > 0; i--) {
    //random J, find out using random function
    const j = Math.floor(Math.random() * (i + 1));
    //swap number at i index and j index
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  let str = "";
  array.forEach((el) => (str += el));
  return str;
}
function handleCheckBoxChange() {
  checkCount = 0;
  allCheckBox.forEach((checkbox) => {
    if (checkbox.checked) checkCount++;
  });

  if (passwordLength < checkCount) passwordLength = checkCount;
  handleSlider();
}
allCheckBox.forEach((checkBox) => {
  checkBox.addEventListener('change', handleCheckBoxChange);
});

inputSlider.addEventListener('input',(e)=>{
    passwordLength = e.target.value;
    handleSlider();
})
copyBtn.addEventListener('click',()=>{
    if(passwordDisplay.value)
        copyContent();
})
generateBtn.addEventListener('click',()=>{
    handleCheckBoxChange();
    // console.log(checkCount);
    if(checkCount==0)
        return;
    if(passwordLength<checkCount)
    {
        passwordLength=checkCount;
        handleSlider();
    }
    password="";
    let funcArr = [];
    if(upperCaseCheck.checked)
        funcArr.push(generateUpperCase);
    if(lowerCaseCheck.checked)
        funcArr.push(generateLowerCase);
    if(symbolsCheck.checked)
        funcArr.push(generateSymbol);
    if(numbersCheck.checked)
        funcArr.push(generateRandomNumber);

    // compulsory
    console.log(funcArr.length);
    for(let i=0;i<funcArr.length;i++)
    {
        password += funcArr[i]();
        // console.log(funcArr[i]);
    }
    console.log("After Compulsory Add");
    console.log(password);
    // Remaining
    for(let i=0;i<passwordLength-funcArr.length;i++)
    {
        let randIndex = getRndInteger(0,funcArr.length);
        password += funcArr[randIndex]();
    }

    password = shufflePassword(Array.from(password));
    passwordDisplay.value = password;
    console.log(password);
    calcStrength();
})