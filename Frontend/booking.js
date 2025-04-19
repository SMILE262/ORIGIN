const threeCardsReadingbtn = document.getElementById('threeCardsReading')
const sevenCardsReadingbtn = document.getElementById('sevenCardsReading')
const elevenCardsReadingbtn = document.getElementById('elevenCardsReading')

checkLogin();

// threeCardsReading.onclick = function () {
//     alert("Three Cards Reading");
// }

// sevenCardsReading.onclick = function () {
//     alert("Seven Cards Reading");
// }

// elevenCardsReading.onclick = function () {
//     alert("Eleven Cards Reading");
// }

// 3 cards
async function threeCardsReading() {
    // e.preventDefault();
    const notes = prompt("Do you have some notes for us?");
    if (notes === null) {
        alert("Booking Cancelled");
        return;
    }
    try {
        const response = await fetch('https://enlightened-sage-ltd.onrender.com/api/booking/booking', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                service: "Three Cards Reading",
                notes: notes,
            })
        })
        if (response.ok) {
            alert("Booking Created Successfully!");
            window.location.href = "index.html"; // Redirect to home
        }
    } catch (error) {
        console.error("Error:", error);
        alert("An error occurred during booking: ", error);
        window.location.href = "index.html"; // Redirect to home
    }
}

// 7 cards
async function sevenCardsReading() {
    // e.preventDefault();
    const notes = prompt("Do you have some notes for us?");
    if (notes === null) {
        alert("Booking Cancelled");
        return;
    }
    try {
        const response = await fetch('https://enlightened-sage-ltd.onrender.com/api/booking/booking', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                service: "Seven Cards Reading",
                notes: notes,
            })
        })
        console.log(response);
        if (response.ok) {
            alert("Booking Created Successfully!");
            window.location.href = "index.html"; // Redirect to home
        }
        else {
            alert("Booking Failed!");
        }
    } catch (error) {
        console.error("Error:", error);
        alert("An error occurred during booking: ", error);
        window.location.href = "index.html"; // Redirect to home
    }
}

// 11 cards
async function elevenCardsReading() {
    // e.preventDefault();
    const notes = prompt("Do you have some notes for us?");
    if (notes === null) {
        alert("Booking Cancelled");
        return;
    }
    try {
        const response = await fetch('https://enlightened-sage-ltd.onrender.com/api/booking/booking', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                service: "Eleven Cards Reading",
                notes: notes,
            })
        })
        if (response.ok) {
            alert("Booking Created Successfully!");
            window.location.href = "index.html"; // Redirect to home
        }
    } catch (error) {
        console.error("Error:", error);
        alert("An error occurred during booking: ", error);
        window.location.href = "index.html"; // Redirect to home
    }
}

threeCardsReadingbtn.addEventListener('click', (e) => {
    e.preventDefault();
    threeCardsReading();
})

sevenCardsReadingbtn.addEventListener('click', (e) => {
    e.preventDefault();
    sevenCardsReading();
})

elevenCardsReadingbtn.addEventListener('click', (e) => {
    e.preventDefault();
    elevenCardsReading();
})

function redirectToLogin() {
    window.location.href = " login.html";
}

async function checkLogin() {
    const response = await fetch('https://enlightened-sage-ltd.onrender.com/api/auth/isloggedin', {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    })
    const data = await response.json();
    if (data.loggedin) {
        console.log(true);
    } else {
        console.log(false);
        window.location.href = "login.html";
    }
}