document.addEventListener("DOMContentLoaded", function () {
    const projectSearchInput = document.getElementById("project-search");
    const projectCards = document.querySelectorAll(".project-card");

    projectSearchInput.addEventListener("input", function () {
        const query = this.value.toLowerCase();
        let hasResults = false;

        projectCards.forEach(card => {
            const title = card.querySelector("h2").textContent.toLowerCase();
            const skillTags = Array.from(card.querySelectorAll(".skill-tag"))
                .map(tag => tag.textContent.toLowerCase());
            const status = card.querySelector(".status").textContent.toLowerCase();
            
            const matches = title.includes(query) || 
                          skillTags.some(skill => skill.includes(query)) ||
                          status.includes(query);
            
            if (matches) {
                card.style.display = "flex";
                hasResults = true;
            } else {
                card.style.display = "none";
            }
        });

        updateSearchResults(hasResults, query);
    });

    // Function to update search results UI
    function updateSearchResults(hasResults, query) {
        let noResultsMsg = document.querySelector(".no-results");
        const projectList = document.querySelector(".project-list");

        if (!hasResults && query) {
            if (!noResultsMsg) {
                noResultsMsg = document.createElement("div");
                noResultsMsg.className = "no-results";
                noResultsMsg.innerHTML = `
                    <i class="fas fa-search"></i>
                    <p>No projects found matching "${query}"</p>
                    <p>Try searching with different keywords</p>
                `;
                projectList.appendChild(noResultsMsg);
            }
        } else if (noResultsMsg) {
            noResultsMsg.remove();
        }
    }
});

// Modify animation styles to prevent interference
const styleSheet = document.createElement("style");
styleSheet.textContent = `
    .no-results {
        grid-column: 1 / -1;
        text-align: center;
        padding: 2rem;
        background: white;
        border-radius: 12px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.1);
        margin: 2rem auto;
    }

    .no-results i {
        font-size: 2.5rem;
        color: rgb(1, 87, 87);
        margin-bottom: 1rem;
        display: block;
    }

    .no-results p {
        color: #666;
        margin: 0.5rem 0;
    }
`;
document.head.appendChild(styleSheet);