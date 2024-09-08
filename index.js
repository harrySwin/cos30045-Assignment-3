// Function to scroll down or back to the top
function scrollDown() {
    if (document.body.scrollHeight - window.innerHeight - window.scrollY < 1) {
        // If at the bottom, scroll to the top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
        // Scroll down by the height of the viewport minus navbar
        const scrollHeight = window.innerHeight - 56; // Adjusted for navbar height (56px)
        const duration = 300;  // Duration in milliseconds
        const start = window.scrollY;
        const startTime = performance.now();

        function scrollAnimation(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);  // Progress capped at 1
            window.scrollTo(0, start + progress * scrollHeight);

            if (progress < 1) {
                requestAnimationFrame(scrollAnimation);
            }
        }

        requestAnimationFrame(scrollAnimation);
    }
}

// Function to toggle the button text and color
function toggleButtonText() {
    const button = document.getElementById('scrollButton');  // Use the button id to target it
    if (window.innerHeight + window.scrollY >= document.body.scrollHeight - 1) {
        // Near the bottom of the page, change text and button style to 'Back to the Top'
        button.textContent = 'Back to the Top';
        button.classList.remove('btn-primary');
        button.classList.add('btn-danger'); // Change to red for 'Back to the Top'
    } else {
        // Not at the bottom, set it back to 'Scroll Down'
        button.textContent = 'Scroll Down';
        button.classList.remove('btn-danger');
        button.classList.add('btn-primary'); // Change back to the original color
    }
}

// Add scroll event listener to update button text and color based on scroll position
window.addEventListener('scroll', toggleButtonText);

// Smooth scrolling by viewport height on mouse wheel
document.addEventListener('DOMContentLoaded', function() {
    const scrollAmount = window.innerHeight - 56; // Viewport height minus navbar height (56px)

    function scrollHandler(event) {
        event.preventDefault(); // Prevent default scrolling
        if (event.deltaY > 0) {
            // Scroll down
            window.scrollBy({
                top: scrollAmount,
                behavior: 'smooth'
            });
        } else {
            // Scroll up
            window.scrollBy({
                top: -scrollAmount,
                behavior: 'smooth'
            });
        }
    }

    // Add event listener for mouse wheel
    window.addEventListener('wheel', scrollHandler, { passive: false }); // `passive: false` to allow `event.preventDefault()`
});

// Fade-in effect for elements
document.addEventListener('DOMContentLoaded', function() {
    const fadeElements = document.querySelectorAll('.fade-in');

    function handleScroll() {
        fadeElements.forEach(element => {
            const rect = element.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                // Element is in view
                element.classList.add('visible');
            } else {
                // Element is out of view
                element.classList.remove('visible');
            }
        });
    }

    // Run on page load and scroll
    handleScroll();
    window.addEventListener('scroll', handleScroll);
});

document.addEventListener('DOMContentLoaded', function() {
    function setupHoverEffect(pointId, linkId) {
        const point = document.getElementById(pointId);
        const link = document.getElementById(linkId);

        if (point && link) {
            link.addEventListener('mouseover', function() {
                point.classList.add('simulate-hover');
            });

            link.addEventListener('mouseout', function() {
                point.classList.remove('simulate-hover');
            });
        }
    }

    // Call the setup function for each point-link pair
    setupHoverEffect('point1', 'link1');
    setupHoverEffect('point2', 'link2');
    setupHoverEffect('point3', 'link3');
    // Add more pairs as needed
});





