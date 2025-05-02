document.addEventListener('DOMContentLoaded', function() {
    console.log("Stored Classes:", JSON.parse(localStorage.getItem('classes')));

    let classSelect = document.querySelector('#assignmentClass');

    if (!classSelect) {
        console.error("Dropdown element not found!"); // Debugging in case it's missing
        return;
    }

    populateClassDropdown();

    document.querySelector('#assignmentForm').addEventListener('submit', function(event) {
        event.preventDefault();

        let assignmentTitle = document.querySelector('#assignmentTitle').value.trim();
        let assignmentClass = classSelect.value;
        let dueDate = document.querySelector('#dueDate').value;
        let assignmentDesc = document.querySelector('#assignmentDesc').value.trim();

        if (!assignmentTitle || !assignmentClass || !dueDate) {
            alert("Please fill in all required fields.");
            return;
        }

        let storedAssignments = JSON.parse(localStorage.getItem('assignments')) || [];
        let newAssignment = {
            id: storedAssignments.length + 1,
            class: assignmentClass,
            title: assignmentTitle,
            dueDate: dueDate,
            description: assignmentDesc
        };

        storedAssignments.push(newAssignment);
        localStorage.setItem('assignments', JSON.stringify(storedAssignments));

        alert("Assignment added successfully!");
        document.querySelector('#assignmentForm').reset();
    });
});

function populateClassDropdown() {
    let classSelect = document.querySelector('#assignmentClass');
    
    if (!classSelect) {
        console.error("Dropdown element not found!");
        return;
    }

    let storedClasses = JSON.parse(localStorage.getItem('classes')) || [];
    
    console.log("Stored Classes Before Append:", storedClasses);

    if (storedClasses.length > 0 && typeof storedClasses[0] === "object") {
        storedClasses = storedClasses.map(c => c.class); // Extract class names if needed
    }

    classSelect.innerHTML = '';

    let defaultOption = document.createElement('option');
    defaultOption.value = "";
    defaultOption.textContent = "Select a class";
    defaultOption.disabled = true;
    defaultOption.selected = true;
    classSelect.appendChild(defaultOption);

    if (storedClasses.length === 0) {
        console.warn("No classes found in localStorage.");
        return;
    }

    storedClasses.forEach(cls => {
        console.log(`Attempting to add: ${cls}`);
        let option = document.createElement('option');
        option.value = cls;
        option.textContent = cls;
        classSelect.appendChild(option);
    });

    console.log("Dropdown After Population:", classSelect.innerHTML);
}
