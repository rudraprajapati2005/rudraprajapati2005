
document.addEventListener('DOMContentLoaded', function() {
    const editableSections = document.querySelectorAll('.editable-section');

    editableSections.forEach(section => {
        const editIcons = section.querySelectorAll('.edit-icon');
        
        editIcons.forEach(icon => {
            const fieldType = icon.dataset.field;
            const form = document.getElementById(`${fieldType}-form`);
            const textElement = icon.parentElement;
            const cancelBtn = form.querySelector('.cancel-btn');

            icon.addEventListener('click', () => {
                form.style.display = 'block';
                textElement.style.display = 'none';
            });

            cancelBtn.addEventListener('click', () => {
                form.style.display = 'none';
                textElement.style.display = 'flex';
            });
        });
    });
});

document.addEventListener("DOMContentLoaded", function() {
    function submitFormOnFileSelect() {
        var form = document.getElementById('uploadForm');
        if (form) {
            form.submit();
        }
    }

    var fileInput = document.getElementById('UploadfileInput');
    if (fileInput) {
        fileInput.addEventListener('change', submitFormOnFileSelect);
    }

    // For update form
    function submitUpdateFormOnFileSelect() {
        var form = document.getElementById('updateProfileForm');
        if (form) {
            form.submit();
        }
    }

    var updateFileInput = document.getElementById('updateFileInput');
    if (updateFileInput) {
        updateFileInput.addEventListener('change', submitUpdateFormOnFileSelect);
    }
});
