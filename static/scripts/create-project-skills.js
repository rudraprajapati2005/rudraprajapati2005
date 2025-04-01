import { allskills  } from "./skills.js";
const allSkills = allskills

document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('searchProjectSkills');
    const skillsList = document.getElementById('skillsList');
    const selectedSkillsContainer = document.getElementById('selectedSkills');
    const hiddenInput = document.getElementById('selected_Skills');
    let selectedSkills = [];

    function addSkill(skill) {
        if (!selectedSkills.some(s => s.value === skill.value)) {
            selectedSkills.push(skill);
            updateSelectedSkills();
        }
        searchInput.value = '';
        skillsList.innerHTML = '';
    }

    function removeSkill(skill) {
        selectedSkills = selectedSkills.filter(s => s.value !== skill.value);
        updateSelectedSkills();
    }

    function updateSelectedSkills() {
        selectedSkillsContainer.innerHTML = '';
        selectedSkills.forEach(skill => {
            const skillTag = document.createElement('span');
            skillTag.className = 'skill-tag';
            skillTag.textContent = skill.text + ' ×';
            skillTag.addEventListener('click', () => removeSkill(skill));
            selectedSkillsContainer.appendChild(skillTag);
        });
        hiddenInput.value = selectedSkills.map(skill => skill.value).join(',');
    }

    searchInput.addEventListener('input', function() {
        const query = this.value.toLowerCase().trim();
        skillsList.innerHTML = '';
        
        if (query === '') {
            skillsList.style.display = 'none';
            return;
        }

        const filteredSkills = allSkills.filter(skill => 
            skill.text.toLowerCase().includes(query) && 
            !selectedSkills.some(s => s.value === skill.value)
        );

        if (filteredSkills.length > 0) {
            skillsList.style.display = 'block';
            filteredSkills.forEach(skill => {
                const li = document.createElement('li');
                li.textContent = skill.text;
                li.addEventListener('click', () => {
                    addSkill(skill);
                    skillsList.style.display = 'none';
                });
                skillsList.appendChild(li);
            });
        } else {
            skillsList.style.display = 'none';
        }
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.skills-input-container')) {
            skillsList.style.display = 'none';
        }
    });
});