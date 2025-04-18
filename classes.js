document.addEventListener('DOMContentLoaded', updateClassList);
document.querySelector('#classForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
    let className = document.querySelector('#className').value.trim();
    let storedAssignments = JSON.parse(localStorage.getItem('assignments')) || [];

    if (className && !storedAssignments.some(a => a.class === className)) {
        storedAssignments.push({ id: storedAssignments.length + 1, class: className, dueDate: "TBD", description: "No assignments yet." });
        localStorage.setItem('assignments', JSON.stringify(storedAssignments));
        updateClassList();
        document.querySelector('#className').value = '';
    }
});

function updateClassList() {
    let classList = document.querySelector('#classList');
    classList.innerHTML = '';

    let storedAssignments = JSON.parse(localStorage.getItem('assignments')) || [];
    let classes = [...new Set(storedAssignments.map(a => a.class))];

    classes.forEach(cls => {
        let card = document.createElement('div');
        card.className = 'col-md-6 col-lg-4 mb-4';

        card.innerHTML = `
            <div class="card h-100 shadow-sm">
                <div class="card-body">
                    <h5 class="card-title text-danger">${cls}</h5>
                    <p class="card-text text-muted">Assignments will appear here.</p>
                    <div class="d-flex justify-content-end">
                        <button class="btn btn-sm btn-outline-danger remove-class" data-class="${cls}">Remove</button>
                    </div>
                </div>
            </div>
        `;
        classList.appendChild(card);
    });

    document.querySelectorAll('.remove-class').forEach(button => {
        button.addEventListener('click', function() {
            let className = this.getAttribute('data-class');
            removeClass(className);
        });
    });
}

function removeClass(className) {
    let storedAssignments = JSON.parse(localStorage.getItem('assignments')) || [];
    storedAssignments = storedAssignments.filter(a => a.class !== className);
    localStorage.setItem('assignments', JSON.stringify(storedAssignments));
    updateClassList();
}
