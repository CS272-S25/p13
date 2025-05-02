document.addEventListener('DOMContentLoaded', function() {
    
    let assignments = JSON.parse(localStorage.getItem('assignments')) || [];
    let initialized = false;

   
    const displayName = localStorage.getItem('username');
    const welcomeElement = document.getElementById('welcome-message');
    if (welcomeElement && displayName) {
        welcomeElement.textContent = `Welcome, ${displayName}!`;
    }
   

    function makeCards() {
        if (initialized) return;
        
        let cardArea = document.querySelector('#assignment-cards');
        if (!cardArea) {
            cardArea = document.querySelector('.row');
        }
        if (!cardArea) return;
        
        
        let parentContainer = cardArea.parentNode;
        if (parentContainer && !parentContainer.querySelector('.upcoming-assignments-title')) {
            let titleElement = document.createElement('h2');
            titleElement.textContent = 'Upcoming Assignments';
            titleElement.className = 'upcoming-assignments-title mt-4 mb-3'; 
            parentContainer.insertBefore(titleElement, cardArea);
        }
       
        
        cardArea.innerHTML = '';

    
        const displayAssignments = assignments.filter(assignment => assignment.dueDate !== 'TBD');

        if (!displayAssignments || displayAssignments.length === 0) {
            cardArea.innerHTML = '<p class="text-muted">No upcoming assignments.</p>'; 
            initialized = true;
            return;
        }

        displayAssignments.forEach(assignment => {
            let card = document.createElement('div');
            card.className = 'col-md-6 col-lg-4 mb-4';
            
            card.innerHTML = `
                <div class="card h-100 shadow-sm">
                    <div class="card-body pt-3">
                        <h5 class="card-title">${assignment.class}</h5>
                        <h6 class="card-subtitle mb-2 text-muted">Due: ${assignment.dueDate}</h6>
                        <p class="card-text">${assignment.description}</p>
                        <div class="d-flex justify-content-end">
                            <button class="btn btn-sm btn-outline-primary view-details" data-id="${assignment.id}">View Details</button>
                        </div>
                    </div>
                </div>
            `;
            cardArea.appendChild(card);
        });

        document.querySelectorAll('.view-details').forEach(button => {
            button.addEventListener('click', function() {
                let id = this.getAttribute('data-id');
                showDetails(id);
            });
        });

        initialized = true;
    }

    function showDetails(id) {
        let assignment = assignments.find(a => a.id === parseInt(id));
        if (!assignment) return;

        let popup = document.createElement('div');
        popup.className = 'modal fade';
        popup.id = 'assignmentModal';
        popup.innerHTML = `
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">${assignment.class}</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <p class="mb-3"><strong>Due Date:</strong> ${assignment.dueDate}</p>
                        <p class="mb-3"><strong>Description:</strong> ${assignment.description}</p>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        <button type="button" class="btn btn-success">Mark as Complete</button>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(popup);

        let modal = new bootstrap.Modal(popup);
        modal.show();

        popup.addEventListener('hidden.bs.modal', function () {
            popup.remove();
        });
    }

    function updateNumbers() {
        let uniqueClasses = [...new Set(assignments.map(a => a.class))];
        let stats = {
            upcoming: assignments.filter(a => a.dueDate !== "TBD").length,
            dueThisWeek: assignments.filter(a => (a.dueDate === 'Tomorrow' || a.dueDate === '3 days')).length,
            classes: uniqueClasses.length
        };

        document.querySelectorAll('.card-body.text-center h3').forEach((stat, index) => {
            stat.textContent = Object.values(stats)[index];
        });
    }

    function displayClasses() {
        let classCardArea = document.querySelector('#class-cards');
        if (!classCardArea) return;

        let uniqueClasses = [...new Set(assignments.map(a => a.class))];

        if (uniqueClasses.length === 0) {
            let noClassesCol = document.createElement('div');
            noClassesCol.className = 'col-12';
            noClassesCol.innerHTML = '<p class="text-muted">No classes added yet. Go to the Classes page to add some!</p>';
            classCardArea.appendChild(noClassesCol);
            return;
        }

        uniqueClasses.forEach(cls => {
            let card = document.createElement('div');
            card.className = 'col-md-4 mb-3';

            card.innerHTML = `
                <div class="card h-100 shadow-sm">
                    <div class="card-body pt-3">
                        <h5 class="card-title">${cls}</h5>
                        <p class="card-text text-muted small">View assignments for this class.</p>
                        <a href="#" class="btn btn-sm btn-outline-secondary stretched-link" data-class-name="${cls}">View Assignments</a>
                    </div>
                </div>
            `;
            classCardArea.appendChild(card);
        });

        document.querySelectorAll('#class-cards .stretched-link').forEach(button => {
            button.addEventListener('click', function(event) {
                event.preventDefault();
                let className = this.getAttribute('data-class-name');
                console.log("Filter assignments for:", className);
                alert(`Filtering assignments for ${className} (functionality not fully implemented yet)`);
            });
        });
    }

    makeCards();
    updateNumbers();
    displayClasses();
});
