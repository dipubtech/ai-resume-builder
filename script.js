let profileImageData = null;
let isEditMode = false;
let autoPreviewTimer = null;

function toggleEditMode() {
    isEditMode = !isEditMode;
    const editBtn = document.getElementById('editToggleBtn');
    const resumeOutput = document.getElementById('output');
    
    if (isEditMode) {
        editBtn.textContent = '💾 Save';
        editBtn.classList.add('active');
        resumeOutput.classList.add('edit-mode');
        makeResumePartsEditable();
    } else {
        editBtn.textContent = '✏️ Edit';
        editBtn.classList.remove('active');
        resumeOutput.classList.remove('edit-mode');
        makeResumePartsNonEditable();
    }
}

function makeResumePartsEditable() {
    const editableElements = document.querySelectorAll('[data-editable]');
    editableElements.forEach(el => {
        el.contentEditable = 'true';
        el.classList.add('editable-active');
    });
}

function makeResumePartsNonEditable() {
    const editableElements = document.querySelectorAll('[data-editable]');
    editableElements.forEach(el => {
        el.contentEditable = 'false';
        el.classList.remove('editable-active');
    });
}

function toggleTheme() {
    const body = document.body;
    const button = document.querySelector('.theme-toggle');
    
    if (body.classList.contains('dark-theme')) {
        body.classList.remove('dark-theme');
        body.classList.add('light-theme');
        button.textContent = '🌙';
        localStorage.setItem('theme', 'light');
    } else {
        body.classList.remove('light-theme');
        body.classList.add('dark-theme');
        button.textContent = '☀️';
        localStorage.setItem('theme', 'dark');
    }
}

function initializeTheme() {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    const body = document.body;
    const button = document.querySelector('.theme-toggle');
    
    if (savedTheme === 'light') {
        body.classList.add('light-theme');
        button.textContent = '🌙';
    } else {
        body.classList.add('dark-theme');
        button.textContent = '☀️';
    }
}

function handleImageUpload(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            profileImageData = e.target.result;
            const preview = document.getElementById('profileImagePreview');
            preview.innerHTML = `<img src="${profileImageData}" alt="Profile">`;
        };
        reader.readAsDataURL(file);
    }
}

function switchTab(tabName) {
    const tabs = document.querySelectorAll('.tab-content');
    const buttons = document.querySelectorAll('.tab-btn');
    
    tabs.forEach(tab => tab.classList.remove('active'));
    buttons.forEach(btn => btn.classList.remove('active'));
    
    document.getElementById(tabName).classList.add('active');
    event.target.classList.add('active');
}

function generateResume(options) {
    const config = options || {};
    const isAuto = config.isAuto === true;
    const name = document.getElementById('name').value || 'Your Name';
    const email = document.getElementById('email').value || 'email@example.com';
    const phone = document.getElementById('phone').value || '+1 (555) 123-4567';
    const location = document.getElementById('location').value || '';
    const website = document.getElementById('website').value || '';
    const profession = document.getElementById('profession').value || 'Professional';
    const skills = document.getElementById('skills').value || 'Add your skills';
    const education = document.getElementById('education').value || 'Add your education';
    const experience = document.getElementById('experience').value || 'Add your experience';
    const summary = document.getElementById('summary').value || 'Add your professional summary';
    const certifications = document.getElementById('certifications').value || '';
    const projects = document.getElementById('projects').value || '';
    const languages = document.getElementById('languages').value || '';

    const skillsArray = skills.split(',').map(skill => 
        `<span class="skill-tag" data-editable>${skill.trim()}</span>`
    ).join('');

    let contactHTML = `<p data-editable>📧 ${email}`;
    if (phone) contactHTML += `<br>📱 ${phone}`;
    if (location) contactHTML += `<br>📍 ${location}`;
    if (website) contactHTML += `<br>🌐 ${website}`;
    contactHTML += '</p>';

    let profileImageHTML = '';
    if (profileImageData) {
        profileImageHTML = `<img src="${profileImageData}" alt="Profile" class="profile-pic">`;
    }

    let fullResume = `
        ${profileImageHTML}
        <h3 data-editable>${name}</h3>
        <p class="profession" data-editable>${profession}</p>
        <div class="contact">
            ${contactHTML}
        </div>
        <hr>
        
        <h4>🎯 Professional Summary</h4>
        <p data-editable>${summary}</p>
    `;

    if (experience) {
        fullResume += `
            <h4>💼 Professional Experience</h4>
            <p data-editable>${experience.replace(/\n/g, '<br>')}</p>
        `;
    }

    if (skills) {
        fullResume += `
            <h4>⚙️ Skills</h4>
            <div data-editable>${skillsArray}</div>
        `;
    }

    if (education) {
        fullResume += `
            <h4>🎓 Education</h4>
            <p data-editable>${education.replace(/\n/g, '<br>')}</p>
        `;
    }

    if (projects) {
        fullResume += `
            <h4>📁 Notable Projects</h4>
            <p data-editable>${projects.replace(/\n/g, '<br>')}</p>
        `;
    }

    if (certifications) {
        fullResume += `
            <h4>🏆 Certifications & Awards</h4>
            <p data-editable>${certifications.replace(/\n/g, '<br>')}</p>
        `;
    }

    if (languages) {
        fullResume += `
            <h4>🌍 Languages</h4>
            <p data-editable>${languages}</p>
        `;
    }

    const output = document.getElementById('output');
    output.classList.remove('slide-in', 'bounce-in');
    output.innerHTML = '<p style="text-align:center; color:#0052cc; font-size:1.3em; padding: 50px; font-weight: 700;">✨ Generating your professional resume...</p>';
    
    setTimeout(() => {
        output.innerHTML = fullResume;
        output.classList.add('slide-in');
        // Scroll to resume preview
        output.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 1200);
}

function resetForm() {
    document.querySelectorAll('.form-input, .form-textarea').forEach(input => {
        input.value = '';
    });
    document.getElementById('profileImage').value = '';
    profileImageData = null;
    document.getElementById('profileImagePreview').innerHTML = '<span>👤 No Image</span>';
    document.getElementById('output').innerHTML = 'Enter your details to see preview';
    alert('✨ Form has been reset!');
}

function downloadResume() {
    const name = document.getElementById('name').value || 'resume';
    const content = document.getElementById('output').innerHTML;
    
    if (!name || name === 'resume') {
        alert('⚠️ Please enter your name first!');
        return;
    }
    
    const printWindow = window.open('', '', 'height=800,width=800');
    printWindow.document.write('<html><head><title>' + name + ' - Resume</title>');
    printWindow.document.write(`
        <style>
            body { font-family: Arial, sans-serif; padding: 20px; background: white; color: #001a4d; }
            h3 { color: #0052cc; margin: 20px 0 5px; font-size: 28px; }
            h4 { color: #0052cc; margin-top: 20px; margin-bottom: 10px; border-bottom: 2px solid #003d80; padding-bottom: 5px; }
            p { line-height: 1.6; margin: 10px 0; }
            .profession { color: #003d80; font-size: 16px; font-style: italic; }
            .contact { background: #e6f2ff; padding: 15px; border-radius: 5px; margin: 15px 0; }
            .skill-tag { display: inline-block; background: linear-gradient(135deg, #0052cc 0%, #003d80 100%); color: white; padding: 5px 12px; border-radius: 15px; margin: 5px 5px 5px 0; font-size: 12px; }
            .profile-pic { width: 120px; height: 120px; border-radius: 10px; margin-bottom: 15px; border: 3px solid #0052cc; }
        </style>
    `);
    printWindow.document.write('</head><body>');
    printWindow.document.write(content);
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    
    setTimeout(() => {
        printWindow.print();
    }, 250);
}

function printResume() {
    const printWindow = window.open('', '', 'height=800,width=800');
    const content = document.getElementById('output').innerHTML;
    
    printWindow.document.write('<html><head><title>Resume</title>');
    printWindow.document.write(`
        <style>
            body { font-family: Arial, sans-serif; padding: 20px; background: white; color: #001a4d; }
            h3 { color: #0052cc; margin: 20px 0 5px; font-size: 28px; }
            h4 { color: #0052cc; margin-top: 20px; margin-bottom: 10px; border-bottom: 2px solid #003d80; padding-bottom: 5px; }
            p { line-height: 1.6; margin: 10px 0; }
            .profession { color: #003d80; font-size: 16px; font-style: italic; }
            .contact { background: #e6f2ff; padding: 15px; border-radius: 5px; margin: 15px 0; }
            .skill-tag { display: inline-block; background: linear-gradient(135deg, #0052cc 0%, #003d80 100%); color: white; padding: 5px 12px; border-radius: 15px; margin: 5px 5px 5px 0; font-size: 12px; }
            .profile-pic { width: 120px; height: 120px; border-radius: 10px; margin-bottom: 15px; border: 3px solid #0052cc; }
        </style>
    `);
    printWindow.document.write('</head><body>');
    printWindow.document.write(content);
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    
    setTimeout(() => {
        printWindow.print();
    }, 250);
}

// Initialize theme on page load
window.addEventListener('DOMContentLoaded', initializeTheme);
window.addEventListener('DOMContentLoaded', setupAutoPreview);
window.addEventListener('DOMContentLoaded', setupSectionEditButtons);
window.addEventListener('DOMContentLoaded', setupLabelEditors);

function handleImageUpload(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            profileImageData = e.target.result;
            const preview = document.getElementById('profileImagePreview');
            preview.innerHTML = `<img src="${profileImageData}" alt="Profile">`;
        };
        reader.readAsDataURL(file);
    }
}

function switchTab(tabName) {
    const tabs = document.querySelectorAll('.tab-content');
    const buttons = document.querySelectorAll('.tab-btn');
    
    tabs.forEach(tab => tab.classList.remove('active'));
    buttons.forEach(btn => btn.classList.remove('active'));
    
    document.getElementById(tabName).classList.add('active');
    event.target.classList.add('active');
}

function generateResume(options) {
    const config = options || {};
    const isAuto = config.isAuto === true;
    const name = document.getElementById('name').value || 'Your Name';
    const email = document.getElementById('email').value || 'email@example.com';
    const phone = document.getElementById('phone').value || '+1 (555) 123-4567';
    const location = document.getElementById('location').value || '';
    const website = document.getElementById('website').value || '';
    const profession = document.getElementById('profession').value || 'Professional';
    const skills = document.getElementById('skills').value || 'Add your skills';
    const education = document.getElementById('education').value || 'Add your education';
    const experience = document.getElementById('experience').value || 'Add your experience';
    const summary = document.getElementById('summary').value || 'Add your professional summary';
    const certifications = document.getElementById('certifications').value || '';
    const projects = document.getElementById('projects').value || '';
    const languages = document.getElementById('languages').value || '';

    const skillsArray = skills.split(',').map(skill => 
        `<span class="skill-tag" data-editable>${skill.trim()}</span>`
    ).join('');

    let contactHTML = `<p data-editable>📧 ${email}`;
    if (phone) contactHTML += `<br>📱 ${phone}`;
    if (location) contactHTML += `<br>📍 ${location}`;
    if (website) contactHTML += `<br>🌐 ${website}`;
    contactHTML += '</p>';

    let profileImageHTML = '';
    if (profileImageData) {
        profileImageHTML = `<img src="${profileImageData}" alt="Profile" class="profile-pic">`;
    }

    let fullResume = `
        ${profileImageHTML}
        <h3 data-editable>${name}</h3>
        <p class="profession" data-editable>${profession}</p>
        <div class="contact">
            ${contactHTML}
        </div>
        <hr>
        
        <div class="resume-block">
            <div class="block-header">
                <h4>🎯 Professional Summary</h4>
                <button type="button" class="section-edit-btn">✏️ Edit</button>
            </div>
            <div class="block-content">
                    <p data-editable>${summary}</p>
            </div>
        </div>
    `;

    if (experience) {
        fullResume += `
            <div class="resume-block">
                <div class="block-header">
                    <h4>💼 Professional Experience</h4>
                    <button type="button" class="section-edit-btn">✏️ Edit</button>
                </div>
                <div class="block-content">
                    <p data-editable>${experience.replace(/\n/g, '<br>')}</p>
                </div>
            </div>
        `;
    }

    if (skills) {
        fullResume += `
            <div class="resume-block">
                <div class="block-header">
                    <h4>🛠️ Skills</h4>
                    <button type="button" class="section-edit-btn">✏️ Edit</button>
                </div>
                <div class="block-content" data-editable>${skillsArray}</div>
            </div>
        `;
    }

    if (education) {
        fullResume += `
            <div class="resume-block">
                <div class="block-header">
                    <h4>🎓 Education</h4>
                    <button type="button" class="section-edit-btn">✏️ Edit</button>
                </div>
                <div class="block-content">
                    <p data-editable>${education.replace(/\n/g, '<br>')}</p>
                </div>
            </div>
        `;
    }

    if (projects) {
        fullResume += `
            <div class="resume-block">
                <div class="block-header">
                    <h4>📁 Notable Projects</h4>
                    <button type="button" class="section-edit-btn">✏️ Edit</button>
                </div>
                <div class="block-content">
                    <p data-editable>${projects.replace(/\n/g, '<br>')}</p>
                </div>
            </div>
        `;
    }

    if (certifications) {
        fullResume += `
            <div class="resume-block">
                <div class="block-header">
                    <h4>🏆 Certifications & Awards</h4>
                    <button type="button" class="section-edit-btn">✏️ Edit</button>
                </div>
                <div class="block-content">
                    <p data-editable>${certifications.replace(/\n/g, '<br>')}</p>
                </div>
            </div>
        `;
    }

    if (languages) {
        fullResume += `
            <div class="resume-block">
                <div class="block-header">
                    <h4>🌍 Languages</h4>
                    <button type="button" class="section-edit-btn">✏️ Edit</button>
                </div>
                <div class="block-content">
                    <p data-editable>${languages}</p>
                </div>
            </div>
        `;
    }

    const output = document.getElementById('output');
    if (isAuto) {
        output.innerHTML = fullResume;
        return;
    }

    output.innerHTML = '<p style="text-align:center; color:#667eea; font-size:1.2em; padding: 40px;">✨ Generating your professional resume...</p>';
    
    setTimeout(() => {
        output.innerHTML = fullResume;
    }, 1000);
}

function setupAutoPreview() {
    const toggle = document.getElementById('autoPreview');
    if (!toggle) {
        return;
    }

    const inputs = document.querySelectorAll('.form-input, .form-textarea');
    const handleInput = () => {
        if (!toggle.checked) {
            return;
        }
        if (autoPreviewTimer) {
            clearTimeout(autoPreviewTimer);
        }
        autoPreviewTimer = setTimeout(() => {
            generateResume({ isAuto: true });
        }, 250);
    };

    inputs.forEach(input => input.addEventListener('input', handleInput));
    toggle.addEventListener('change', () => {
        if (toggle.checked) {
            generateResume({ isAuto: true });
        }
    });
}

function setupSectionEditButtons() {
    const output = document.getElementById('output');
    if (!output) {
        return;
    }

    output.addEventListener('click', (event) => {
        const button = event.target.closest('.section-edit-btn');
        if (!button) {
            return;
        }

        const block = button.closest('.resume-block');
        if (!block) {
            return;
        }

        const content = block.querySelector('.block-content');
        if (!content) {
            return;
        }

        const isEditing = block.classList.toggle('editing');
        content.contentEditable = isEditing ? 'true' : 'false';
        button.textContent = isEditing ? '💾 Save' : '✏️ Edit';
    });
}

function setupLabelEditors() {
    const labelInputs = document.querySelectorAll('.label-edit input[data-target]');
    if (!labelInputs.length) {
        return;
    }

    labelInputs.forEach((input) => {
        const targetId = input.getAttribute('data-target');
        const target = targetId ? document.getElementById(targetId) : null;
        if (!target) {
            return;
        }

        input.addEventListener('input', () => {
            const nextText = input.value.trim();
            const fallback = target.getAttribute('data-default') || target.textContent;
            target.textContent = nextText ? nextText : fallback;
        });
    });
}

function resetForm() {
    document.querySelectorAll('.form-input, .form-textarea').forEach(input => {
        input.value = '';
    });
    document.getElementById('profileImage').value = '';
    profileImageData = null;
    document.getElementById('profileImagePreview').innerHTML = '<span>👤 No Image</span>';
    document.getElementById('output').innerHTML = 'Enter your details to see preview';
    alert('✨ Form has been reset!');
}

function downloadResume() {
    const name = document.getElementById('name').value || 'resume';
    const content = document.getElementById('output').innerHTML;
    
    if (!name || name === 'resume') {
        alert('⚠️ Please enter your name first!');
        return;
    }
    
    const printWindow = window.open('', '', 'height=800,width=800');
    printWindow.document.write('<html><head><title>' + name + ' - Resume</title>');
    printWindow.document.write(`
        <style>
            body { font-family: Arial, sans-serif; padding: 20px; background: white; color: #333; }
            h3 { color: #667eea; margin: 20px 0 5px; font-size: 28px; }
            h4 { color: #667eea; margin-top: 20px; margin-bottom: 10px; border-bottom: 2px solid #764ba2; padding-bottom: 5px; }
            p { line-height: 1.6; margin: 10px 0; }
            .profession { color: #764ba2; font-size: 16px; font-style: italic; }
            .contact { background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 15px 0; }
            .skill-tag { display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 5px 12px; border-radius: 15px; margin: 5px 5px 5px 0; font-size: 12px; }
            .profile-pic { width: 120px; height: 120px; border-radius: 10px; margin-bottom: 15px; border: 3px solid #667eea; }
        </style>
    `);
    printWindow.document.write('</head><body>');
    printWindow.document.write(content);
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    
    setTimeout(() => {
        printWindow.print();
    }, 250);
}

function printResume() {
    const printWindow = window.open('', '', 'height=800,width=800');
    const content = document.getElementById('output').innerHTML;
    
    printWindow.document.write('<html><head><title>Resume</title>');
    printWindow.document.write(`
        <style>
            body { font-family: Arial, sans-serif; padding: 20px; background: white; color: #333; }
            h3 { color: #667eea; margin: 20px 0 5px; font-size: 28px; }
            h4 { color: #667eea; margin-top: 20px; margin-bottom: 10px; border-bottom: 2px solid #764ba2; padding-bottom: 5px; }
            p { line-height: 1.6; margin: 10px 0; }
            .profession { color: #764ba2; font-size: 16px; font-style: italic; }
            .contact { background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 15px 0; }
            .skill-tag { display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 5px 12px; border-radius: 15px; margin: 5px 5px 5px 0; font-size: 12px; }
            .profile-pic { width: 120px; height: 120px; border-radius: 10px; margin-bottom: 15px; border: 3px solid #667eea; }
        </style>
    `);
    printWindow.document.write('</head><body>');
    printWindow.document.write(content);
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    
    setTimeout(() => {
        printWindow.print();
    }, 250);
}

// Initialize theme on page load
window.addEventListener('DOMContentLoaded', initializeTheme);