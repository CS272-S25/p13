document.addEventListener("DOMContentLoaded", () => {
  // Create a variable for the button
  const toggleButton = document.getElementById("darkModeToggle");

  // Create a variable for the local storage
  const prefersDarkMode = localStorage.getItem("darkMode") === "true";

  // If the user prefers dark mode, change it
  if (prefersDarkMode) {
    document.body.classList.add("dark-mode");
  }

  // Event listener for the button that changes to dark mode
  toggleButton.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    const isDarkMode = document.body.classList.contains("dark-mode");
    console.log("Dark mode toggled:", isDarkMode);

    // Saves the preference in local storage
    localStorage.setItem("darkMode", isDarkMode);
  });

  // Creating variables for the username
  const usernameInput = document.getElementById("usernameInput");
  const displayName = document.getElementById("displayName");

  // Getting the saved name from localstorage
  const savedName = localStorage.getItem("username");
  if (savedName) {
    // If there is a saved name, update the text
    displayName.textContent = savedName;
    usernameInput.value = savedName;
  }

  // Event listener for the button to set the name in local storage and text
  document.getElementById("usernameForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const name = usernameInput.value;
    localStorage.setItem("username", name);
    displayName.textContent = name;
  });
});
