const form = document.getElementById('signup-form');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const emailError = document.getElementById('email-error');
const passwordError = document.getElementById('password-error');
const successMsg = document.getElementById('success-msg');


form.addEventListener("submit", (e) => {
    e.preventDefault(); // Stop standard submit reloads
    
    const emailVal = emailInput.value.trim();
    const passwordVal = passwordInput.value.trim();
    
    // Clear previous states
    emailError.textContent = "";
    passwordError.textContent = "";
    successMsg.textContent = "";
    
    let isEmailValid = false;
    let isPasswordValid = false;
    
    // PART 1: Email Validation
    // - Check if length > 3
    // - Check if it contains "@" and "."
    if (emailVal.length > 3 && emailVal.includes("@") && emailVal.includes(".")) {
        isEmailValid = true;
        emailInput.style.borderColor = "#28a745"; // Green border
    } else {
        emailError.textContent = "Make sure email is more than 3 characters and has @ and a . ";
        emailInput.style.borderColor = "#dc3545"; // Red border
    }
    
    // PART 2: Password Validation
    // - Check if length > 8
    if (passwordVal.length > 8) {
        isPasswordValid = true;
        passwordInput.style.borderColor = "#28a745"; // Green border
    } else {
        passwordError.textContent = "Make sure password is more than 8 characters.";
        passwordInput.style.borderColor = "#dc3545"; // Red border
    }
    
    // PART 3: Feedback Display & Confirmation handling
    if (isEmailValid && isPasswordValid) {
        // Display green success message
        successMsg.textContent = "All good to go";
        
        // Show confirmation popup
        const userConfirmed = confirm("Are you sure you want to sign up?");
        
        if (userConfirmed) {
            // User clicked OK
            alert("Successful signup!");
        } else {
            // User clicked Cancel: reload page to redirect and clear inputs
            window.location.reload();
        }
    }
});