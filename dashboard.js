let assignments = [
    {
        id: 1,
        class: "Class 1",
        dueDate: "Tomorrow",
        description: "Assignment Description"
    },
    {
        id: 2,
        class: "Class 2",
        dueDate: "3 days",
        description: "Assignment Description"
    },
    {
        id: 3,
        class: "Class 3",
        dueDate: "1 week",
        description: "Assignment Description"
    }
];

let initialized = false;

function makeCards() {
    if (initialized) return;
    
    let cardArea = document.querySelector('#assignment-cards');
    if (!cardArea) {
        cardArea = document.querySelector('.row');
    }
    if (!cardArea) return;
    
    cardArea.innerHTML = '';

    assignments.forEach(assignment => {
        let card = document.createElement('div');
        card.className = 'col-md-6 col-lg-4 mb-4';
        
        card.innerHTML = `
            <div class="card h-100 shadow-sm">
                <div class="card-body">
                    <h5 class="card-title">${assignment.class}</h5>
                    <h6 class="card-subtitle mb-2 text-muted">Due: ${assignment.dueDate}</h6>
                    <p class="card-text">${assignment.description}</p>
                    <div class="d-flex justify-content-end">
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
                    <p><strong>Due Date:</strong> ${assignment.dueDate}</p>
                    <p><strong>Description:</strong> ${assignment.description}</p>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    <button type="button" class="btn btn-danger">Mark as Complete</button>
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
    let stats = {
        upcoming: assignments.length,
        dueThisWeek: assignments.filter(a => a.dueDate === 'Tomorrow' || a.dueDate === '3 days').length,
        classes: new Set(assignments.map(a => a.class)).size
    };

    document.querySelectorAll('.card-body.text-center h3').forEach((stat, index) => {
        stat.textContent = Object.values(stats)[index];
    });
}

document.addEventListener('DOMContentLoaded', function() {
    makeCards();
    updateNumbers();
});
