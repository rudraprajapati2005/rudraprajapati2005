import { allskills } from "./skills.js"; 

let allSkills = allskills
        // Define allSkills array in the global scope
         

        document.addEventListener("DOMContentLoaded", function() {
            function submitFormOnFileSelect() {
                console.log('submitting form');
                var form = document.getElementById('uploadForm');
                if (form) {
                    form.submit();
                    console.log('Form submitted');
                } else {
                    console.error('Form not found!');
                }
            }

            var fileInput = document.getElementById('UploadfileInput');
            if (fileInput) {
                fileInput.addEventListener('change', submitFormOnFileSelect);
                console.log('Event listener added to file input');
            }

            // For update form
            function submitUpdateFormOnFileSelect() {
                console.log('submitting update form');
                var form = document.getElementById('updateProfileForm');
                if (form) {
                    form.submit();
                    console.log('Update form submitted');
                } else {
                    console.error('Update form not found!');
                }
            }

            var updateFileInput = document.getElementById('updateFileInput');
            if (updateFileInput) {
                updateFileInput.addEventListener('change', submitUpdateFormOnFileSelect);
                console.log('Event listener added to update file input');
            }

            const editableSections = document.querySelectorAll('.editable-section');
            editableSections.forEach(section => {
                const addDescription = section.querySelector('.add-description');
                const editIcon = section.querySelector('.edit-icon');
                const editForm = section.querySelector('.edit-form');
                const textDisplay = section.querySelector('div[class$="-text"]');
                const cancelBtn = section.querySelector('.cancel-btn');

                function showForm() {
                    if (editForm) {
                        editForm.style.display = 'block';
                        if (textDisplay) {
                            textDisplay.style.display = 'none';
                        }
                        if (addDescription) {
                            addDescription.style.display = 'none';
                        }
                    }
                }

                function hideForm() {
                    if (editForm) {
                        editForm.style.display = 'none';
                        if (textDisplay) {
                            textDisplay.style.display = 'block';
                        }
                        if (addDescription) {
                            addDescription.style.display = 'block';
                        }
                    }
                }

                if (addDescription) {
                    addDescription.addEventListener('click', showForm);
                }

                if (editIcon) {
                    editIcon.addEventListener('click', showForm);
                }

                if (cancelBtn) {
                    cancelBtn.addEventListener('click', hideForm);
                }
            });

            // GitHub link validation
            function validateGitLinks(form) {
                const textarea = form.querySelector('textarea[name="description"]');
                const links = textarea.value.split('\n').filter(link => link.trim() !== '');
                const githubRegex = /^https:\/\/github\.com\/[\w-]+(?:\/[\w.-]+)*\/?$/;
                let isValid = true;
                let errorMessage = '';

                for (const link of links) {
                    if (link.trim() && !githubRegex.test(link.trim())) {
                        isValid = false;
                        errorMessage = 'Please enter valid GitHub links (e.g., https://github.com/username/repository)';
                        break;
                    }
                }

                if (!isValid) {
                    alert(errorMessage);
                    return false;
                }

                return true;
            }

            // Skills validation and handling
            function validateSkills(form) {
                const selectedSkills = document.getElementById('selected_Skills').value;
                if (!selectedSkills.trim()) {
                    alert('Please select at least one skill');
                    return false;
                }
                return true;
            }

            function initializeSkillsSearch() {
                const searchInput = document.getElementById('searchSkills');
                const skillsList = document.getElementById('skillsList');
                const selectedSkillsContainer = document.getElementById('selectedSkills');
                const hiddenInput = document.getElementById('selected_Skills');
                let selectedSkills = [];

                if (!searchInput || !skillsList || !selectedSkillsContainer || !hiddenInput) {
                    console.error('Required elements not found');
                    return;
                }

                // Style the skills list
                skillsList.style.cssText = `
                    display: none;
                    position: absolute;
                    background: white;
                    border: 1px solid #ddd;
                    border-radius: 4px;
                    max-height: 200px;
                    overflow-y: auto;
                    width: 100%;
                    z-index: 1000;
                    margin-top: 5px;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                `;

                // Initialize selected skills from existing data
                if ("{{freelancer.skills}}") {
                    const skills = "{{freelancer.skills}}".split(',').map(skill => skill.trim());
                    skills.forEach(skillValue => {
                        const skill = allSkills.find(s => s.value === skillValue);
                        if (skill) {
                            addSkill(skill);
                        }
                    });
                }

                // Search input handler
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
                            li.style.cssText = `
                                padding: 8px 12px;
                                cursor: pointer;
                                hover: background-color: #f5f5f5;
                            `;
                            li.addEventListener('click', () => {
                                addSkill(skill);
                                searchInput.value = '';
                                skillsList.style.display = 'none';
                            });
                            skillsList.appendChild(li);
                        });
                    } else {
                        skillsList.style.display = 'none';
                    }
                });

                function addSkill(skill) {
                    if (!selectedSkills.some(s => s.value === skill.value)) {
                        selectedSkills.push(skill);
                        updateSelectedSkills();
                    }
                }

                function removeSkill(skill) {
                    selectedSkills = selectedSkills.filter(s => s.value !== skill.value);
                    updateSelectedSkills();
                }

                function updateSelectedSkills() {
                    selectedSkillsContainer.innerHTML = '';
                    selectedSkills.forEach(skill => {
                        const span = document.createElement('span');
                        span.className = 'skill-tag';
                        span.textContent = skill.text + ' ×';
                        span.addEventListener('click', () => removeSkill(skill));
                        selectedSkillsContainer.appendChild(span);
                    });
                    hiddenInput.value = selectedSkills.map(s => s.value).join(',');
                }
            }

            // Initialize skills search when the skills edit form is shown
            const editIcon = document.querySelector('[data-field="skills"]');
            const addDescription = document.querySelector('.add-description[data-field="skills"]');
            
            if (editIcon) {
                editIcon.addEventListener('click', () => setTimeout(initializeSkillsSearch, 100));
            }
            if (addDescription) {
                addDescription.addEventListener('click', () => setTimeout(initializeSkillsSearch, 100));
            }

            // Add this to your existing DOMContentLoaded event listener
            function initializeRateValidation() {
                const rateInput = document.querySelector('input[name="description"][type="number"]');
                const rateForm = document.querySelector('#rate-form form');
                
                if (rateInput && rateForm) {
                    // Add error message element
                    const errorDiv = document.createElement('div');
                    errorDiv.className = 'rate-error';
                    rateInput.parentNode.insertBefore(errorDiv, rateInput.nextSibling);

                    rateInput.addEventListener('input', function() {
                        const value = parseFloat(this.value);
                        if (value < 0) {
                            this.classList.add('invalid-rate');
                            errorDiv.textContent = 'Hourly rate cannot be negative';
                            errorDiv.style.display = 'block';
                        } else if (value > 1000) {
                            this.classList.add('invalid-rate');
                            errorDiv.textContent = 'Hourly rate cannot exceed $1000';
                            errorDiv.style.display = 'block';
                        } else {
                            this.classList.remove('invalid-rate');
                            errorDiv.style.display = 'none';
                        }
                    });

                    rateForm.addEventListener('submit', function(e) {
                        const value = parseFloat(rateInput.value);
                        if (value < 0 || value > 1000 || isNaN(value)) {
                            e.preventDefault();
                            rateInput.classList.add('invalid-rate');
                            errorDiv.textContent = 'Please enter a valid hourly rate between $0 and $1000';
                            errorDiv.style.display = 'block';
                        }
                    });

                    // Format the input to always show 2 decimal places
                    rateInput.addEventListener('blur', function() {
                        if (this.value && !isNaN(this.value)) {
                            this.value = parseFloat(this.value).toFixed(2);
                        }
                    });
                }
            }

            // Initialize rate validation when edit form is shown
            const rateEditIcon = document.querySelector('[data-field="rate"]');
            const addRateBtn = document.querySelector('.add-description[data-field="rate"]');
            
            if (rateEditIcon) {
                rateEditIcon.addEventListener('click', () => setTimeout(initializeRateValidation, 100));
            }
            if (addRateBtn) {
                addRateBtn.addEventListener('click', () => setTimeout(initializeRateValidation, 100));
            }
        });

        function showSkillsForm() {
            const skillsForm = document.getElementById('skills-form');
            if (skillsForm) {
                skillsForm.style.display = 'block';
                initializeSkillsSearch();
            }
        }

        // Initialize when edit icon is clicked
        const editSkillsIcon = document.querySelector('[data-field="skills"]');
        if (editSkillsIcon) {
            editSkillsIcon.addEventListener('click', showSkillsForm);
        }

        // Initialize when "Add Skills" is clicked
        const addSkillsBtn = document.querySelector('.add-description[data-field="skills"]');
        if (addSkillsBtn) {
            addSkillsBtn.addEventListener('click', showSkillsForm);
        }
   