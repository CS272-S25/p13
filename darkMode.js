// Event listener to see check if dark mode should be used
document.addEventListener("DOMContentLoaded", () => {
  const prefersDarkMode = localStorage.getItem("darkMode") === "true";
  if (prefersDarkMode) {
    document.body.classList.add("dark-mode");
  }
});
