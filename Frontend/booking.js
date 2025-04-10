// Get elements
const popup = document.getElementById("popup");
const openPopupButtons = document.querySelectorAll(".openPopup");
const closePopupButton = document.querySelector(".close");
const loginForm = document.getElementById("loginForm");

// Check if elements exist before adding event listeners
if (popup && openPopupButtons && closePopupButton && loginForm) {
    // Open popup on button click
    openPopupButtons.forEach(button => {
        button.addEventListener("click", function () {
            popup.style.display = "flex";
        });
    });

    // Close popup when clicking the close button
    closePopupButton.addEventListener("click", function () {
        popup.style.display = "none";
    });

    // Close popup when clicking outside the content box
    window.addEventListener("click", function (event) {
        if (event.target === popup) {
            popup.style.display = "none";
        }
    });

    // Handle login form submission
    loginForm.addEventListener("submit", async function (event) {
        event.preventDefault(); // Prevent form from submitting normally

        // Collect form data
        const username = document.getElementById("name").value;
        const age = document.getElementById("age").value;
        const gender = document.getElementById("gender").value;
        const email = document.getElementById("email").value;
        const location = document.getElementById("location").value;

        console.log("Form Data:", { username, age, gender, email, location });

        // Send data to the backend
        try {
            const response = await fetch('https://enlightened-sage-ltd.onrender.com/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username,
                    age,
                    gender,
                    email,
                    location,
                }),
            });

            if (response.ok) {
                alert('Data saved successfully!');
                popup.style.display = "none"; // Close popup after successful submission
            } else {
                alert('Failed to save data');
            }
        } catch (err) {
            console.error('Error:', err);
            alert('An error occurred while saving data');
        }
    });
}
