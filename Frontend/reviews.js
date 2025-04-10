document.getElementById("reviewBtn").addEventListener("click", () => {
    const form = document.getElementById("reviewForm");
    form.style.display = form.style.display === "none" ? "block" : "none";
});

async function addReview() {
    const reviewText = document.getElementById("reviewText").value;
    const reviewAuthor = document.getElementById("reviewAuthor").value;

    if (reviewText && reviewAuthor) {
        const newReview = document.createElement("div");
        newReview.classList.add("review-card");
        newReview.innerHTML = `<p>"${reviewText}"</p><span>- ${reviewAuthor}</span>`;

        document.getElementById("reviews-container").appendChild(newReview);

        // Clear form fields
        document.getElementById("reviewText").value = "";
        document.getElementById("reviewAuthor").value = "";

        // Hide the form
        document.getElementById("reviewForm").style.display = "none";

        // Send review details to the backend for email notification
        try {
            const response = await fetch('https://enlightened-sage-ltd.onrender.com/submit-review', { // Add the full backend URL
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ reviewText, reviewAuthor }),
            });

            if (response.ok) {
                alert('Review added and email notification sent!');
            } else {
                const errorMessage = await response.text();
                alert('Failed to send email: ' + errorMessage);
            }
        } catch (error) {
            console.error('Error sending email:', error);
            alert('An error occurred while sending the email.');
        }
    } else {
        alert("Please fill in both fields!");
    }
}

// Close the form initially
document.getElementById("reviewForm").style.display = "none";
