import { allSkills } from './skills.js';

let selectedSkills = []; // Store selected skills

document.addEventListener("DOMContentLoaded", function () {
    const skillSearchInput = document.getElementById("skill-search");
    const skillList = document.getElementById("skill-list");
    const selectedSkillsContainer = document.getElementById("selected-skills");
    const applyFiltersBtn = document.getElementById("apply-filters");
    const freelancerSearchInput = document.getElementById("freelancer-search");

    // Filter skills dynamically as user types
    skillSearchInput.addEventListener("input", function () {
        const query = skillSearchInput.value.toLowerCase();
        skillList.innerHTML = ""; // Clear previous list

        if (query) {
            const filteredSkills = allSkills.filter(skill => skill.toLowerCase().includes(query));
            filteredSkills.forEach(skill => {
                const li = document.createElement("li");
                li.textContent = skill;
                li.addEventListener("click", function () {
                    addSkill(skill);
                });
                skillList.appendChild(li);
            });
        }
    });

    // Function to add a selected skill
    function addSkill(skill) {
        if (!selectedSkills.includes(skill)) {
            selectedSkills.push(skill);
            updateSelectedSkills();
        }
        skillSearchInput.value = ""; // Clear input after selection
        skillList.innerHTML = ""; // Clear suggestion list
    }

    // Function to remove skill and update freelancers dynamically
    function removeSkill(skill) {
        selectedSkills = selectedSkills.filter(s => s !== skill);
        updateSelectedSkills();
        filterFreelancers(); // Reapply filtering
    }

    // Function to update selected skills display
    function updateSelectedSkills() {
        selectedSkillsContainer.innerHTML = "";
        selectedSkills.forEach(skill => {
            const skillTag = document.createElement("span");
            skillTag.classList.add("skill-tag");
            skillTag.textContent = skill;
            skillTag.addEventListener("click", function () {
                removeSkill(skill);
            });
            selectedSkillsContainer.appendChild(skillTag);
        });
    }

    // Function to filter freelancers based on selected skills
    function filterFreelancers() {
        const freelancerCards = document.querySelectorAll(".freelancer-card");
        freelancerCards.forEach(card => {
            const skillsText = card.querySelector(".freelancer-info p").textContent.toLowerCase(); 
            const freelancerSkills = skillsText.split(',').map(skill => skill.trim().toLowerCase()); // Handle comma-separated skills
            const hasAllSkills = selectedSkills.every(skill => freelancerSkills.includes(skill.toLowerCase())); // Check all selected skills

            if (selectedSkills.length === 0 || hasAllSkills) {
                card.style.display = "block";
            } else {
                card.style.display = "none";
            }
        });
    }

    // Apply filters when button is clicked
    applyFiltersBtn.addEventListener("click", filterFreelancers);

    // Search freelancers by name
    freelancerSearchInput.addEventListener("input", function () {
        const query = freelancerSearchInput.value.toLowerCase();
        const freelancerCards = document.querySelectorAll(".freelancer-card");
        freelancerCards.forEach(card => {
            const title = card.querySelector("h2").textContent.toLowerCase();
            if (title.includes(query)) {
                card.style.display = "block";
            } else {
                card.style.display = "none";
            }
        });
    });
});
