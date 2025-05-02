document.addEventListener('DOMContentLoaded', function() {
    updateAssignmentList();
});

function updateAssignmentList() {
    let assignmentList = document.querySelector('#assignmentList');
    assignmentList.innerHTML = '';

    let storedAssignments = JSON.parse(localStorage.getItem('assignments')) || [];

    if (storedAssignments.length === 0) {
        assignmentList.innerHTML = '<p class="text-muted">No assignments found.</p>';
        return;
    }

    storedAssignments.forEach(assignment => {
        let card = document.createElement('div');
        card.className = 'col-md-6 col-lg-4 mb-4';

        card.innerHTML = `
            <div class="card h-100 shadow-sm">
                <div class="card-body">
                    <h5 class="card-title text-danger">${assignment.title}</h5>
                    <p class="card-text"><strong>Class:</strong> ${assignment.class}</p>
                    <p class="card-text"><strong>Due:</strong> ${assignment.dueDate}</p>
                    <p class="card-text text-muted">${assignment.description}</p>
                    <div class="d-flex justify-content-end">
                        <button class="btn btn-sm btn-outline-danger remove-assignment" data-id="${assignment.id}">Remove</button>
                    </div>
                </div>
            </div>
        `;
        assignmentList.appendChild(card);
    });

    document.querySelectorAll('.remove-assignment').forEach(button => {
        button.addEventListener('click', function() {
            let assignmentId = parseInt(this.getAttribute('data-id'));
            removeAssignment(assignmentId);
        });
    });
}

function removeAssignment(assignmentId) {
    let storedAssignments = JSON.parse(localStorage.getItem('assignments')) || [];
    storedAssignments = storedAssignments.filter(a => a.id !== assignmentId);
    localStorage.setItem('assignments', JSON.stringify(storedAssignments));

    updateAssignmentList();
}
