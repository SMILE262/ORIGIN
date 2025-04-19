

// http://localhost:3000
function showSignUp() {
    document.getElementById("loginForm").style.display = "none";
    document.getElementById("signUpForm").style.display = "block";
}

// Show Login Form
function showLogin() {
    document.getElementById("signUpForm").style.display = "none";
    document.getElementById("loginForm").style.display = "block";
}

// Handle Sign-Up Form Submission
document.getElementById("signup").addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = document.getElementById("name").value;
    const age = document.getElementById("age").value;
    const gender = document.getElementById("gender").value;
    const location = document.getElementById("location").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
        const response = await fetch("https://enlightened-sage-ltd.onrender.com/api/auth/signup", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ name, age, gender, location, email, password }),
        });

        if (response.ok) {
            alert("Sign-Up Successful! Log in to continue.");
            showLogin();
        } else {
            alert("Sign-Up Failed!");
        }
    } catch (error) {
        console.error("Error:", error);
        alert("An error occurred during sign-up.");
    }
});

// Handle Login Form Submission
document.getElementById("login").addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

    try {
        const response = await fetch("https://enlightened-sage-ltd.onrender.com/api/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
        });

        if (response.ok) {
            alert("Login Successful!");
            window.location.href = "https://enlightened-sage-ltd.onrender.com/index.html"; // Redirect to home

        } else {
            alert("Login Failed!");
        }
    } catch (error) {
        console.error("Error:", error);
        alert("An error occurred during login.");
    }
});

// Dynamically populate the age dropdown
function populateAgeOptions() {
    const ageSelect = document.getElementById("age");
    for (let i = 18; i <= 100; i++) {
        const option = document.createElement("option");
        option.value = i;
        option.textContent = i;
        ageSelect.appendChild(option);
    }
}

// Call the function to populate the age dropdown when the page loads
populateAgeOptions();