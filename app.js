/**
 * Election Creation Wizard - Complete JavaScript Logic
 * Manages multi-step form, validation, state management, and auto-save
 */

class ElectionWizard {
    constructor() {
        // State management
        this.currentStep = 1;
        this.totalSteps = 7; // Steps 1-7, Step 8 is success screen
        this.isValid = {};
        
        // Election data object
        this.electionData = {
            // Step 1: Election Basics
            electionName: '',
            electionType: '',
            description: '',
            organizationName: '',
            timeZone: '',
            
            // Step 2: Candidates
            candidates: [],
            
            // Step 3: Voters
            voters: [],
            voterInputMethod: 'manual',
            verificationMethods: [],
            
            // Step 4: Ballot Configuration
            votingType: 'single',
            allowVoteChange: false,
            anonymousVoting: true,
            
            // Step 5: Timeline
            startDateTime: '',
            endDateTime: '',
            resultVisibility: 'immediate',
            
            // Step 6: Security (Read-only, pre-enabled)
            encryptionEnabled: true,
            auditLogsEnabled: true,
            fraudDetectionEnabled: true,
            
            // Step 7: Confirmation
            confirmed: false,
            
            // Meta
            createdAt: new Date().toISOString(),
            electionId: this.generateElectionId()
        };

        this.initializeEventListeners();
        this.loadDraftFromLocalStorage();
        this.validateStep(this.currentStep);
        this.updateProgressIndicator();
    }

    /**
     * Generate unique election ID
     */
    generateElectionId() {
        const date = new Date();
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const random = Math.random().toString(36).substring(2, 9).toUpperCase();
        return `ELECTION-${year}${month}${day}-${random}`;
    }

    /**
     * Initialize all event listeners
     */
    initializeEventListeners() {
        // Step 1: Election Basics
        this.attachInputListener('electionName');
        this.attachInputListener('electionType');
        this.attachInputListener('description');
        this.attachInputListener('organizationName');
        this.attachInputListener('timeZone');

        // Step 2: Candidates
        document.getElementById('addCandidateBtn')?.addEventListener('click', (e) => this.addCandidate(e));
        document.getElementById('csvUploadZone')?.addEventListener('click', () => {
            document.getElementById('csvFile').click();
        });
        document.getElementById('csvFile')?.addEventListener('change', (e) => this.handleCSVUpload(e));
        this.setupCSVDragDrop();

        // Tab switching
        document.querySelectorAll('.tab-button').forEach(btn => {
            btn.addEventListener('click', (e) => this.switchTab(e));
        });

        // Step 3: Voters
        document.getElementById('addVoterBtn')?.addEventListener('click', (e) => this.addVoter(e));
        document.querySelectorAll('input[name="voterInputMethod"]').forEach(radio => {
            radio.addEventListener('change', () => this.updateVoterInputMethod());
        });
        document.querySelectorAll('input[name="verificationMethod"]').forEach(checkbox => {
            checkbox.addEventListener('change', () => this.validateStep(3));
        });

        // Step 4: Ballot Configuration
        document.querySelectorAll('input[name="votingType"]').forEach(radio => {
            radio.addEventListener('change', (e) => {
                this.electionData.votingType = e.target.value;
                this.autosaveDraft();
            });
        });
        document.getElementById('allowVoteChange')?.addEventListener('change', (e) => {
            this.electionData.allowVoteChange = e.target.checked;
            this.autosaveDraft();
        });
        document.getElementById('anonymousVoting')?.addEventListener('change', (e) => {
            this.electionData.anonymousVoting = e.target.checked;
            this.autosaveDraft();
        });

        // Step 5: Timeline
        this.attachInputListener('startDateTime');
        this.attachInputListener('endDateTime');
        document.querySelectorAll('input[name="resultVisibility"]').forEach(radio => {
            radio.addEventListener('change', (e) => {
                this.electionData.resultVisibility = e.target.value;
                this.autosaveDraft();
            });
        });

        // Step 7: Confirmation
        document.getElementById('confirmCheckbox')?.addEventListener('change', (e) => {
            this.electionData.confirmed = e.target.checked;
            this.validateStep(7);
        });

        // Navigation
        document.getElementById('prevBtn').addEventListener('click', () => this.previousStep());
        document.getElementById('nextBtn').addEventListener('click', () => this.nextStep());

        // Success screen actions
        document.getElementById('dashboardBtn')?.addEventListener('click', () => {
            window.location.href = 'dashboard.html';
        });
        document.getElementById('monitoringBtn')?.addEventListener('click', () => {
            window.location.href = 'monitoring.html';
        });
        document.getElementById('copyLinkBtn')?.addEventListener('click', (e) => {
            this.copyToClipboard(e);
        });

        // Exit button
        document.getElementById('exitBtn').addEventListener('click', () => {
            if (confirm('Are you sure? Your draft will be saved.')) {
                this.autosaveDraft();
                window.location.href = 'index.html';
            }
        });

        // Save draft button
        document.getElementById('saveDraftBtn')?.addEventListener('click', () => {
            this.autosaveDraft();
            this.showDraftIndicator();
        });
    }

    /**
     * Attach input listener to form fields
     */
    attachInputListener(fieldId) {
        const field = document.getElementById(fieldId);
        if (field) {
            field.addEventListener('input', (e) => {
                this.electionData[fieldId] = e.target.value;
                this.validateStep(this.currentStep);
                this.autosaveDraft();
            });
            field.addEventListener('change', (e) => {
                this.electionData[fieldId] = e.target.value;
                this.validateStep(this.currentStep);
                this.autosaveDraft();
            });
        }
    }

    /**
     * Add candidate
     */
    addCandidate(e) {
        e.preventDefault();
        const nameInput = document.getElementById('candidateName');
        const idInput = document.getElementById('candidateId');

        if (!nameInput.value.trim() || !idInput.value.trim()) {
            alert('Please fill in both candidate name and ID');
            return;
        }

        const candidate = {
            id: idInput.value.trim(),
            name: nameInput.value.trim(),
            photoUrl: ''
        };

        // Check for duplicate IDs
        if (this.electionData.candidates.some(c => c.id === candidate.id)) {
            alert('Candidate ID already exists');
            return;
        }

        this.electionData.candidates.push(candidate);
        nameInput.value = '';
        idInput.value = '';
        nameInput.focus();

        this.renderCandidatesList();
        this.validateStep(2);
        this.autosaveDraft();
    }

    /**
     * Remove candidate
     */
    removeCandidate(candidateId) {
        this.electionData.candidates = this.electionData.candidates.filter(c => c.id !== candidateId);
        this.renderCandidatesList();
        this.validateStep(2);
        this.autosaveDraft();
    }

    /**
     * Render candidates list UI
     */
    renderCandidatesList() {
        const list = document.getElementById('candidatesList');
        list.innerHTML = '';

        this.electionData.candidates.forEach(candidate => {
            const card = document.createElement('div');
            card.className = 'candidate-card dark';
            card.innerHTML = `
                <div class="flex-1">
                    <p class="font-bold text-sm">${this.escapeHtml(candidate.name)}</p>
                    <p class="text-xs text-gray-500 dark:text-gray-400">ID: ${this.escapeHtml(candidate.id)}</p>
                </div>
                <button type="button" class="text-red-500 hover:text-red-700 transition-colors" onclick="wizard.removeCandidate('${candidate.id}')">
                    <span class="material-symbols-outlined text-[18px]">delete</span>
                </button>
            `;
            list.appendChild(card);
        });
    }

    /**
     * Setup CSV drag and drop
     */
    setupCSVDragDrop() {
        const zone = document.getElementById('csvUploadZone');
        if (!zone) return;

        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            zone.addEventListener(eventName, (e) => {
                e.preventDefault();
                e.stopPropagation();
            });
        });

        ['dragenter', 'dragover'].forEach(eventName => {
            zone.addEventListener(eventName, () => {
                zone.classList.add('dragover');
            });
        });

        ['dragleave', 'drop'].forEach(eventName => {
            zone.addEventListener(eventName, () => {
                zone.classList.remove('dragover');
            });
        });

        zone.addEventListener('drop', (e) => {
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                this.handleCSVFile(files[0]);
            }
        });
    }

    /**
     * Handle CSV upload
     */
    handleCSVUpload(e) {
        if (e.target.files.length > 0) {
            this.handleCSVFile(e.target.files[0]);
        }
    }

    /**
     * Parse CSV file
     */
    handleCSVFile(file) {
        if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
            alert('Please upload a valid CSV file');
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            alert('File size must be less than 5MB');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const csv = e.target.result;
                const lines = csv.split('\n').filter(line => line.trim());
                const candidates = [];

                lines.forEach((line, index) => {
                    if (index === 0) return; // Skip header if exists
                    const [name, id, photoUrl] = line.split(',').map(s => s.trim());
                    if (name && id) {
                        candidates.push({
                            id: id,
                            name: name,
                            photoUrl: photoUrl || ''
                        });
                    }
                });

                // Check for duplicates
                const ids = new Set();
                candidates.forEach(c => {
                    if (ids.has(c.id)) {
                        throw new Error('Duplicate candidate IDs found in CSV');
                    }
                    ids.add(c.id);
                });

                this.electionData.candidates = candidates;
                this.renderCandidatesList();
                this.validateStep(2);
                this.autosaveDraft();
                alert(`${candidates.length} candidates imported successfully`);
            } catch (error) {
                alert('Error parsing CSV: ' + error.message);
            }
        };
        reader.readAsText(file);
    }

    /**
     * Switch between tabs
     */
    switchTab(e) {
        const tabButton = e.target.closest('.tab-button');
        const tabName = tabButton.dataset.tab;
        
        // Update tab button states
        document.querySelectorAll('.tab-button').forEach(btn => {
            btn.classList.remove('text-primary', 'border-b-primary');
            btn.classList.add('text-gray-500', 'dark:text-gray-400', 'border-b-transparent');
        });
        tabButton.classList.add('text-primary', 'border-b-primary');
        tabButton.classList.remove('text-gray-500', 'dark:text-gray-400', 'border-b-transparent');

        // Update tab content visibility
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.add('hidden');
        });
        document.getElementById(`tab-${tabName}`)?.classList.remove('hidden');
    }

    /**
     * Update voter input method
     */
    updateVoterInputMethod() {
        const methodRadio = document.querySelector('input[name="voterInputMethod"]:checked');
        if (!methodRadio) return;
        
        const method = methodRadio.value;
        this.electionData.voterInputMethod = method;
        
        // Show/hide sections based on selected method
        const manualVotersSection = document.getElementById('manual-voters');
        if (manualVotersSection) {
            manualVotersSection.classList.toggle('hidden', method !== 'manual');
        }
        
        this.autosaveDraft();
        this.validateStep(3);
    }

    /**
     * Add voter
     */
    addVoter(e) {
        e.preventDefault();
        const emailInput = document.getElementById('voterEmail');
        const email = emailInput.value.trim();

        if (!this.validateEmail(email)) {
            alert('Please enter a valid email address');
            return;
        }

        if (this.electionData.voters.some(v => v.email === email)) {
            alert('Voter email already added');
            return;
        }

        this.electionData.voters.push({
            id: `VOTER-${Date.now()}`,
            email: email,
            verificationStatus: 'pending'
        });

        emailInput.value = '';
        emailInput.focus();

        this.renderVotersList();
        this.validateStep(3);
        this.autosaveDraft();
    }

    /**
     * Remove voter
     */
    removeVoter(voterId) {
        this.electionData.voters = this.electionData.voters.filter(v => v.id !== voterId);
        this.renderVotersList();
        this.validateStep(3);
        this.autosaveDraft();
    }

    /**
     * Render voters list
     */
    renderVotersList() {
        const list = document.getElementById('votersList');
        list.innerHTML = '';

        this.electionData.voters.forEach(voter => {
            const item = document.createElement('div');
            item.className = 'flex items-center justify-between p-3 bg-gray-50 dark:bg-[#252525] rounded border border-gray-200 dark:border-[#444]';
            item.innerHTML = `
                <div class="flex-1">
                    <p class="text-sm font-medium">${this.escapeHtml(voter.email)}</p>
                    <p class="text-xs text-gray-500">Added just now</p>
                </div>
                <button type="button" class="text-red-500 hover:text-red-700" onclick="wizard.removeVoter('${voter.id}')">
                    <span class="material-symbols-outlined text-[18px]">delete</span>
                </button>
            `;
            list.appendChild(item);
        });

        // Update voter count
        const count = this.electionData.voters.length;
        const countText = count === 0 ? 'No voters added' : `${count} voter${count !== 1 ? 's' : ''} added`;
        
        const countDisplay = list.previousElementSibling?.querySelector('.voter-count');
        if (countDisplay) {
            countDisplay.textContent = countText;
        }
    }

    /**
     * Validate email format
     */
    validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    /**
     * Validate current step
     */
    validateStep(step) {
        let isValid = true;
        const errors = [];

        switch(step) {
            case 1: // Election Basics
                isValid = this.electionData.electionName?.trim() !== '' &&
                         this.electionData.electionType?.trim() !== '' &&
                         this.electionData.description?.trim() !== '' &&
                         this.electionData.organizationName?.trim() !== '' &&
                         this.electionData.timeZone?.trim() !== '';
                
                const electionNameError = document.getElementById('electionNameError');
                if (electionNameError) electionNameError.classList.toggle('hidden', !!this.electionData.electionName);
                
                const electionTypeError = document.getElementById('electionTypeError');
                if (electionTypeError) electionTypeError.classList.toggle('hidden', !!this.electionData.electionType);
                
                const descriptionError = document.getElementById('descriptionError');
                if (descriptionError) descriptionError.classList.toggle('hidden', !!this.electionData.description);
                
                const organizationError = document.getElementById('organizationNameError');
                if (organizationError) organizationError.classList.toggle('hidden', !!this.electionData.organizationName);
                
                const timeZoneError = document.getElementById('timeZoneError');
                if (timeZoneError) timeZoneError.classList.toggle('hidden', !!this.electionData.timeZone);
                break;

            case 2: // Candidates
                isValid = this.electionData.candidates.length >= 2;
                const candidatesError = document.getElementById('candidatesError');
                if (candidatesError) candidatesError.classList.toggle('hidden', isValid);
                break;

            case 3: // Voters
                const verificationMethods = Array.from(
                    document.querySelectorAll('input[name="verificationMethod"]:checked')
                ).map(cb => cb.value);
                this.electionData.verificationMethods = verificationMethods;
                isValid = verificationMethods.length > 0;
                const verificationError = document.getElementById('verificationError');
                if (verificationError) verificationError.classList.toggle('hidden', isValid);
                break;

            case 4: // Ballot - always valid
                isValid = true;
                break;

            case 5: // Timeline
                const startTime = new Date(this.electionData.startDateTime);
                const endTime = new Date(this.electionData.endDateTime);
                isValid = this.electionData.startDateTime !== '' &&
                         this.electionData.endDateTime !== '' &&
                         endTime > startTime;
                
                const timelineError = document.getElementById('timelineError');
                if (timelineError) {
                    timelineError.classList.toggle('hidden', isValid);
                }
                break;

            case 6: // Security - always valid (read-only)
                isValid = true;
                break;

            case 7: // Review & Confirm
                isValid = this.electionData.confirmed === true;
                const confirmError = document.getElementById('confirmError');
                if (confirmError) confirmError.classList.toggle('hidden', isValid);
                break;
        }

        this.isValid[step] = isValid;
        this.updateNavigationButtons();
        return isValid;
    }

    /**
     * Update navigation buttons state
     */
    updateNavigationButtons() {
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');

        if (!prevBtn || !nextBtn) return;

        prevBtn.disabled = this.currentStep === 1;
        
        if (this.currentStep === this.totalSteps) {
            nextBtn.innerHTML = 'Create Election <span class="material-symbols-outlined">check_circle</span>';
        } else {
            nextBtn.innerHTML = 'Continue <span class="material-symbols-outlined">arrow_forward</span>';
        }

        nextBtn.disabled = !this.isValid[this.currentStep];
    }

    /**
     * Move to next step
     */
    nextStep() {
        if (!this.validateStep(this.currentStep)) {
            return;
        }

        if (this.currentStep === this.totalSteps) {
            this.createElection();
            return;
        }

        this.currentStep++;
        this.showStep(this.currentStep);
    }

    /**
     * Move to previous step
     */
    previousStep() {
        if (this.currentStep > 1) {
            this.currentStep--;
            this.showStep(this.currentStep);
        }
    }

    /**
     * Show specific step
     */
    showStep(stepNum) {
        document.querySelectorAll('.form-step').forEach(step => {
            step.classList.add('hidden');
        });

        const targetStep = document.getElementById(`step-${stepNum}`);
        if (targetStep) {
            targetStep.classList.remove('hidden');
        }

        this.updateProgressIndicator();
        this.validateStep(stepNum);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    /**
     * Update progress indicator
     */
    updateProgressIndicator() {
        const percentage = (this.currentStep / this.totalSteps) * 100;
        document.getElementById('progressBar').style.width = percentage + '%';

        document.querySelectorAll('.step-indicator').forEach((indicator, index) => {
            const stepNum = index + 1;
            indicator.classList.remove('active', 'completed');

            if (stepNum < this.currentStep) {
                indicator.classList.add('completed');
                indicator.querySelector('.step-circle').innerHTML = '<span class="material-symbols-outlined">check</span>';
                indicator.querySelector('.step-circle').classList.add('bg-green-600', 'border-green-600', 'text-white');
                indicator.querySelector('.step-circle').classList.remove('border-gray-300', 'dark:border-[#444]', 'text-gray-500', 'dark:text-gray-400');
            } else if (stepNum === this.currentStep) {
                indicator.classList.add('active');
                indicator.querySelector('.step-circle').textContent = stepNum;
                indicator.querySelector('.step-circle').classList.add('border-primary', 'text-primary', 'font-bold');
                indicator.querySelector('.step-circle').classList.remove('border-gray-300', 'dark:border-[#444]', 'text-gray-500', 'dark:text-gray-400');
            } else {
                indicator.querySelector('.step-circle').textContent = stepNum;
                indicator.querySelector('.step-circle').classList.remove('border-primary', 'text-primary', 'bg-green-600', 'border-green-600', 'text-white');
            }
        });
    }

    /**
     * Create election
     */
    createElection() {
        // Final validation
        if (!this.validateStep(7)) {
            alert('Please confirm all details before creating the election');
            return;
        }

        // Simulate API call
        console.log('Creating election with data:', this.electionData);

        // Clear draft from localStorage
        localStorage.removeItem('electionDraft');

        // Show success screen
        this.currentStep = 8;
        document.querySelectorAll('.form-step').forEach(step => step.classList.add('hidden'));
        document.getElementById('step-8').classList.remove('hidden');
        document.getElementById('prevBtn').style.display = 'none';
        document.getElementById('nextBtn').style.display = 'none';

        // Populate success screen
        document.getElementById('successElectionId').textContent = this.electionData.electionId;
        document.getElementById('voterLinkInput').value = `https://vote.votesecure.io/${this.electionData.electionId}`;

        // Update progress to 100%
        document.getElementById('progressBar').style.width = '100%';

        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    /**
     * Populate review screen
     */
    populateReview() {
        // Election info
        const reviewElectionName = document.getElementById('reviewElectionName');
        if (reviewElectionName) reviewElectionName.textContent = this.electionData.electionName || '-';
        
        const reviewElectionType = document.getElementById('reviewElectionType');
        if (reviewElectionType) reviewElectionType.textContent = this.formatElectionType(this.electionData.electionType) || '-';
        
        const reviewOrganization = document.getElementById('reviewOrganization');
        if (reviewOrganization) reviewOrganization.textContent = this.electionData.organizationName || '-';

        // Candidates
        const reviewCandidateCount = document.getElementById('reviewCandidateCount');
        if (reviewCandidateCount) reviewCandidateCount.textContent = this.electionData.candidates.length;
        
        const candidateList = document.getElementById('reviewCandidateList');
        if (candidateList) {
            candidateList.innerHTML = this.electionData.candidates
                .map(c => `<div>• ${this.escapeHtml(c.name)}</div>`)
                .join('');
        }

        // Timeline
        const startDate = new Date(this.electionData.startDateTime).toLocaleString();
        const endDate = new Date(this.electionData.endDateTime).toLocaleString();
        
        const reviewStartTime = document.getElementById('reviewStartTime');
        if (reviewStartTime) reviewStartTime.textContent = startDate;
        
        const reviewEndTime = document.getElementById('reviewEndTime');
        if (reviewEndTime) reviewEndTime.textContent = endDate;

        // Voters
        const reviewVoterCount = document.getElementById('reviewVoterCount');
        if (reviewVoterCount) reviewVoterCount.textContent = this.electionData.voters.length;
        
        const reviewVerification = document.getElementById('reviewVerification');
        if (reviewVerification) reviewVerification.textContent = this.electionData.verificationMethods.join(', ') || '-';
    }

    /**
     * Format election type for display
     */
    formatElectionType(type) {
        const typeMap = {
            'student': 'Student Election',
            'corporate': 'Corporate Board',
            'housing': 'Housing Society',
            'custom': 'Custom'
        };
        return typeMap[type] || type;
    }

    /**
     * Auto-save draft to localStorage
     */
    autosaveDraft() {
        // Update review screen when on that step
        if (this.currentStep === 7) {
            this.populateReview();
        }

        try {
            localStorage.setItem('electionDraft', JSON.stringify(this.electionData));
            localStorage.setItem('electionDraftTimestamp', new Date().toISOString());
        } catch (error) {
            console.error('Failed to save draft:', error);
        }
    }

    /**
     * Load draft from localStorage
     */
    loadDraftFromLocalStorage() {
        try {
            const saved = localStorage.getItem('electionDraft');
            if (saved) {
                const draft = JSON.parse(saved);
                
                // Restore form fields
                if (draft.electionName) document.getElementById('electionName').value = draft.electionName;
                if (draft.electionType) document.getElementById('electionType').value = draft.electionType;
                if (draft.description) document.getElementById('description').value = draft.description;
                if (draft.organizationName) document.getElementById('organizationName').value = draft.organizationName;
                if (draft.timeZone) document.getElementById('timeZone').value = draft.timeZone;
                
                // Restore candidates
                if (draft.candidates && draft.candidates.length > 0) {
                    this.electionData.candidates = draft.candidates;
                    this.renderCandidatesList();
                }

                // Restore voters
                if (draft.voters && draft.voters.length > 0) {
                    this.electionData.voters = draft.voters;
                    this.renderVotersList();
                }

                // Restore other fields
                this.electionData = { ...this.electionData, ...draft };

                // Restore radio/checkbox states
                if (draft.votingType) {
                    document.querySelector(`input[name="votingType"][value="${draft.votingType}"]`).checked = true;
                }
                if (draft.allowVoteChange) {
                    document.getElementById('allowVoteChange').checked = draft.allowVoteChange;
                }
                if (draft.anonymousVoting) {
                    document.getElementById('anonymousVoting').checked = draft.anonymousVoting;
                }
                if (draft.startDateTime) {
                    document.getElementById('startDateTime').value = draft.startDateTime;
                }
                if (draft.endDateTime) {
                    document.getElementById('endDateTime').value = draft.endDateTime;
                }
                if (draft.resultVisibility) {
                    document.querySelector(`input[name="resultVisibility"][value="${draft.resultVisibility}"]`).checked = true;
                }

                console.log('Draft loaded successfully');
            }
        } catch (error) {
            console.error('Failed to load draft:', error);
        }
    }

    /**
     * Show draft saved indicator
     */
    showDraftIndicator() {
        const indicator = document.getElementById('draftIndicator');
        indicator.classList.add('show');
        setTimeout(() => {
            indicator.classList.remove('show');
        }, 3000);
    }

    /**
     * Copy link to clipboard
     */
    copyToClipboard(e) {
        const input = document.getElementById('voterLinkInput');
        input.select();
        document.execCommand('copy');
        
        const btn = e.target.closest('button');
        const originalText = btn.innerHTML;
        btn.innerHTML = '<span class="material-symbols-outlined">check</span>';
        setTimeout(() => {
            btn.innerHTML = originalText;
        }, 2000);
    }

    /**
     * Escape HTML special characters
     */
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

/**
 * Initialize wizard when DOM is ready
 */
let wizard;
document.addEventListener('DOMContentLoaded', () => {
    wizard = new ElectionWizard();
});
