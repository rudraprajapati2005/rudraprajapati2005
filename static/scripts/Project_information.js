document.addEventListener("DOMContentLoaded", function () {
    // Default active tab
    document.querySelector(".tab1-project-info").classList.add("active");
    document.querySelector(".tabs h3:first-child").classList.add("active");

    document.querySelectorAll(".tabs h3").forEach(tab => {
        tab.addEventListener("click", function () {
            document.querySelectorAll(".tabs h3").forEach(t => t.classList.remove("active"));
            document.querySelectorAll(".tab1-project-info, .tab2-project-proposals").forEach(content => content.classList.remove("active"));

            this.classList.add("active");
            if (this.innerText === "Details") {
                document.querySelector(".tab1-project-info").classList.add("active");
            } else {
                document.querySelector(".tab2-project-proposals").classList.add("active");
            }
        });
    });
});

 // Modal functions
 function openBidModal() {
    document.getElementById("bidModal").style.display = "block";
}

document.querySelector(".close").onclick = function() {
    document.getElementById("bidModal").style.display = "none";
}

window.onclick = function(event) {
    if (event.target == document.getElementById("bidModal")) {
        document.getElementById("bidModal").style.display = "none";
    }
}

// Form submission
document.getElementById('bidForm').addEventListener('submit', function(e) {
    const amount = parseFloat(document.getElementById('bid_amount').value);
    
    if (amount < 0) {
        e.preventDefault();
        alert('Bid amount must be greater than or equal to 0');
        return false;
    }

    const submitBtn = this.querySelector('.submit-bid');
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
    submitBtn.disabled = true;
    
    // Let the form submit normally - no AJAX
    return true;
});

const csrfToken = "{{ csrf_token }}";
        
// Function to get CSRF token from cookie
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}