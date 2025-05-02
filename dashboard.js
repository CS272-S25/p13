document.addEventListener('DOMContentLoaded', function() {
    
    let assignments = JSON.parse(localStorage.getItem('assignments')) || [];
    let initialized = false;

    
    function parseDueDate(dueDate) {
        if (!dueDate || dueDate === 'TBD') {
            
            return new Date(8640000000000000); 
        }
        try {
            
            const parts = dueDate.split('-');
            if (parts.length === 3) {
                
                return new Date(parts[0], parts[1] - 1, parts[2]);
            }
            
            const parsed = new Date(dueDate);
            return isNaN(parsed) ? new Date(8640000000000000) : parsed;
        } catch (e) {
            console.error("Error parsing date:", dueDate, e);
            return new Date(8640000000000000); 
        }
    }

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

        
        displayAssignments.sort((a, b) => parseDueDate(a.dueDate) - parseDueDate(b.dueDate));
        

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
                        <h5 class="card-title text-danger">${assignment.title}</h5>
                        <h6 class="card-subtitle mb-2 text-muted">Class: ${assignment.class}</h6>
                        <p class="card-text mb-1"><small>Due: ${assignment.dueDate}</small></p>
                        <p class="card-text text-muted"><small>${assignment.description || ''}</small></p>
                        <div class="d-flex justify-content-end mt-2">
                            <button class="btn btn-sm btn-outline-danger view-details" data-id="${assignment.id}">View Details</button>
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

       
        const markCompleteButton = popup.querySelector('.btn-success'); 
        if (markCompleteButton) {
            markCompleteButton.addEventListener('click', function() {
                removeAssignmentById(assignment.id);
                modal.hide(); 
                makeCards(); 
                updateNumbers();
                displayClasses(); 
            });
        }

        popup.addEventListener('hidden.bs.modal', function () {
            popup.remove();
        });
    }

    function updateNumbers() {
        
        const currentAssignments = JSON.parse(localStorage.getItem('assignments')) || [];
        const classList = JSON.parse(localStorage.getItem('classes')) || []; 

        let stats = {
            upcoming: currentAssignments.filter(a => a.dueDate !== "TBD").length,
            
            dueThisWeek: currentAssignments.filter(a => {
                 if (!a.dueDate || a.dueDate === 'TBD') return false;
                 
                 const dueDateObj = parseDueDate(a.dueDate);
                 if (isNaN(dueDateObj.getTime())) return false; 

                 const today = new Date();
                 today.setHours(0, 0, 0, 0); 
                 const oneWeekFromToday = new Date(today);
                 oneWeekFromToday.setDate(today.getDate() + 7);

                 return dueDateObj >= today && dueDateObj < oneWeekFromToday;
            }).length,
            classes: classList.length 
        };

        
        const statElements = document.querySelectorAll('.col-lg-4 .card-body.text-center h3');
        if (statElements.length === 3) { 
             statElements[0].textContent = stats.upcoming;
             statElements[1].textContent = stats.dueThisWeek;
             statElements[2].textContent = stats.classes;
        } else {
            console.error("Could not find all stat elements to update.");
           
            document.querySelectorAll('.card-body.text-center h3').forEach((stat, index) => {
                 if (index < Object.values(stats).length) { 
                     stat.textContent = Object.values(stats)[index];
                 }
            });
        }
    }

    function displayClasses() {
        let classCardArea = document.querySelector('#class-cards');
        if (!classCardArea) return;

       
        let uniqueClasses = JSON.parse(localStorage.getItem('classes')) || []; 

        
        const existingCards = classCardArea.querySelectorAll('.col-md-4.mb-3');
        existingCards.forEach(card => card.remove());
        const noClassesMsg = classCardArea.querySelector('#no-classes-message');
        if (noClassesMsg) noClassesMsg.remove();

        if (uniqueClasses.length === 0) {
            let noClassesCol = document.createElement('div');
            noClassesCol.className = 'col-12';
            noClassesCol.id = 'no-classes-message'; 
            noClassesCol.innerHTML = '<p class="text-muted">No classes added yet. Go to the Classes page to add some!</p>';
           
            if (classCardArea.children[0]) { 
                 classCardArea.insertBefore(noClassesCol, classCardArea.children[0].nextSibling);
            } else {
                 classCardArea.appendChild(noClassesCol);
            }
            return;
        }

        
        uniqueClasses.forEach(cls => {
            let card = document.createElement('div');
            card.className = 'col-md-4 mb-3';

            card.innerHTML = `
                <div class="card h-100 shadow-sm">
                    <div class="card-body pt-3">
                        <h5 class="card-title text-danger">${cls}</h5>
                        <p class="card-text text-muted small">View assignments for this class.</p>
                        <a href="#" class="btn btn-sm btn-outline-danger stretched-link" data-class-name="${cls}">View Assignments</a>
                    </div>
                </div>
            `;
            classCardArea.appendChild(card);
        });

       
        document.querySelectorAll('#class-cards .stretched-link').forEach(button => {
            button.addEventListener('click', function(event) {
                event.preventDefault();
                let className = this.getAttribute('data-class-name');
                
                showClassAssignmentsModal(className);
            });
        });
    }

   
    function showClassAssignmentsModal(className) {
        const allAssignments = JSON.parse(localStorage.getItem('assignments')) || [];
        const classAssignments = allAssignments.filter(a => a.class === className && a.dueDate !== 'TBD'); 

        let modalBodyContent;
        if (classAssignments.length === 0) {
            modalBodyContent = '<p class="text-muted">No active assignments found for this class.</p>';
        } else {
            modalBodyContent = '<ul class="list-group list-group-flush">';
            classAssignments
                .sort((a, b) => parseDueDate(a.dueDate) - parseDueDate(b.dueDate)) 
                .forEach(assignment => {
                    modalBodyContent += `
                        <li class="list-group-item d-flex justify-content-between align-items-center">
                           ${assignment.title || 'Untitled Assignment'} 
                           <span class="badge bg-secondary rounded-pill">${assignment.dueDate}</span>
                        </li>
                    `;
            });
            modalBodyContent += '</ul>';
        }

        let popup = document.createElement('div');
        popup.className = 'modal fade';
        popup.id = `classAssignmentsModal-${className.replace(/\s+/g, '-')}`;
        popup.innerHTML = `
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Assignments for ${className}</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        ${modalBodyContent}
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
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
   

   
    function removeAssignmentById(idToRemove) {
        let currentAssignments = JSON.parse(localStorage.getItem('assignments')) || [];
        currentAssignments = currentAssignments.filter(a => a.id !== idToRemove);
        localStorage.setItem('assignments', JSON.stringify(currentAssignments));
        assignments = currentAssignments; 
    }
   

    makeCards();
    updateNumbers();
    displayClasses();
});
