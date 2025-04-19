document.getElementById("reviewBtn").addEventListener("click", () => {
    const form = document.getElementById("reviewForm");
    form.style.display = form.style.display === "none" ? "block" : "none";
});

async function addReview() {
    const reviewText = document.getElementById("reviewText").value;
    // const reviewAuthor = document.getElementById("reviewAuthor").value;

    if (reviewText) {
        // const newReview = document.createElement("div");
        // newReview.classList.add("review-card");
        // newReview.innerHTML = `<p>"${reviewText}"</p><span>- ${reviewAuthor}</span>`;

        // document.getElementById("reviews-container").appendChild(newReview);

        // Clear form fields
        document.getElementById("reviewText").value = "";
        // document.getElementById("reviewAuthor").value = "";

        // Hide the form
        document.getElementById("reviewForm").style.display = "none";

        // Send review details to the backend for email notification
        try {
            const response = await fetch('https://enlightened-sage-ltd.onrender.com/api/review/submit', { // Add the full backend URL
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ reviewText }),
            });

            if (response.ok) {
                alert('Review added and email notification sent!');

                fetchReviews(); // update reviews lists
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

async function fetchReviews() {
    try {
        const response = await fetch(`https://enlightened-sage-ltd.onrender.com/api/review`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });
        const data = await response.json();
        console.log(data);
        const container = document.getElementById("reviews-container")

        container.innerHTML = ""; // clear existing reviews, not optional
        const reviews = data.reviews
        reviews.forEach((review) => {
            const reviewCard = document.createElement("div");
            reviewCard.classList.add("review-card");

            const reviewText = document.createElement("p");
            reviewText.innerText = `${review.reviewText}`;

            const reviewAuthor = document.createElement("span");
            reviewAuthor.innerText = `- ${review.reviewAuthor}`;

            reviewCard.appendChild(reviewText);
            reviewCard.appendChild(reviewAuthor);
            container.appendChild(reviewCard)
        })
    } catch (error) {
        console.log(error)
    }
}

fetchReviews()