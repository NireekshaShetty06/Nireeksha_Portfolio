/* ==========================================================================
   PORTFOLIO JAVASCRIPT (script.js)
   Clean, beginner-friendly Vanilla JavaScript.
   ========================================================================== */

// This function runs automatically once the entire HTML document is parsed and loaded.
document.addEventListener("DOMContentLoaded", () => {
    console.log("Welcome to Nireeksha Shetty's Portfolio website!");
    console.log("script.js has loaded successfully.");

    // --------------------------------------------------------------------------
    // 1. SELECTING DOM ELEMENTS
    // Grab key elements from the HTML using ID and class selectors.
    // --------------------------------------------------------------------------
    const navToggle = document.getElementById("navToggle");
    const navMenu = document.querySelector(".nav-menu");
    const navLinks = document.querySelectorAll(".nav-link");
    const sections = document.querySelectorAll("section[id]");

    // --------------------------------------------------------------------------
    // 2. MOBILE MENU TOGGLE
    // When the user clicks the hamburger button, toggle the "active" class on the menu.
    // --------------------------------------------------------------------------
    if (navToggle && navMenu) {
        navToggle.addEventListener("click", () => {
            navMenu.classList.toggle("active");
        });
    }

    // --------------------------------------------------------------------------
    // 3. CLOSE MOBILE MENU ON LINK CLICK
    // Automatically close the mobile navigation menu when a link is clicked.
    // --------------------------------------------------------------------------
    navLinks.forEach((link) => {
        link.addEventListener("click", () => {
            if (navMenu && navMenu.classList.contains("active")) {
                navMenu.classList.remove("active");
            }
        });
    });

    // --------------------------------------------------------------------------
    // 4. ACTIVE NAVIGATION LINK ON SCROLL
    // Updates which navigation link is highlighted based on the current scroll position.
    // --------------------------------------------------------------------------
    const updateActiveNavLink = () => {
        const scrollY = window.pageYOffset;

        sections.forEach((section) => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 120; // Offset accounts for sticky header
            const sectionId = section.getAttribute("id");

            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navLinks.forEach((link) => {
                    link.classList.remove("active");
                    if (link.getAttribute("href") === `#${sectionId}`) {
                        link.classList.add("active");
                    }
                });
            }
        });
    };

    // Listen for scroll events to update active navigation link
    window.addEventListener("scroll", updateActiveNavLink);
});
