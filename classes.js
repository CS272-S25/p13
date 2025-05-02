document.addEventListener('DOMContentLoaded', function() {
    let storedClasses = JSON.parse(localStorage.getItem('classes')) || [];
    localStorage.setItem('classes', JSON.stringify(storedClasses)); // Ensure it initializes storage
    updateClassList();
});

document.querySelector('#classForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
    let className = document.querySelector('#className').value.trim();
    let storedClasses = JSON.parse(localStorage.getItem('classes')) || [];

    if (className && !storedClasses.includes(className)) {
        storedClasses.push(className);
        localStorage.setItem('classes', JSON.stringify(storedClasses)); // Store separately
        updateClassList();
        document.querySelector('#className').value = '';
    }
});

function updateClassList() {
    let classList = document.querySelector('#classList');
    classList.innerHTML = '';

    let storedClasses = JSON.parse(localStorage.getItem('classes')) || [];

    storedClasses.forEach(cls => {
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
    let storedClasses = JSON.parse(localStorage.getItem('classes')) || [];
    let storedAssignments = JSON.parse(localStorage.getItem('assignments')) || [];

    storedClasses = storedClasses.filter(cls => cls !== className);
    localStorage.setItem('classes', JSON.stringify(storedClasses));

    storedAssignments = storedAssignments.filter(a => a.class !== className);
    localStorage.setItem('assignments', JSON.stringify(storedAssignments));

    updateClassList();
}
