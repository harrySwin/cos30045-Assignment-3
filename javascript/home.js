// Object to hold country information
const countryInfo = {
    australia: {
        text: '<p>You clicked on Australia! In 1992 the Labor Government led by Prime Minister Paul Keating introduced the <strong>Superannuation Guarantee (SG)</strong>. This created compulsory retirement savings where employers were to pay 3-4% of their worker\'s salary into a super fund (a retirement account)</p><p>In 2002 the percentage of a worker\'s salary to be committed to their super fund increased to 9%, and is set to increase to 12% by 2025. (Australian Retirement Trust, 2023)</p>',
        image: 'assets/australia.png' // Update with the actual image path
    },
    denmark: {
        text: '<p>You clicked on Denmark! To help reduce the cost of an ageing population and increase the productivity of their workforce, Denmark has linked retirement age to life expectancy at 65. The intention behind reforms like this is to divide years gained from improvements to life expectancy between work and retirement rather than just retirement as most current systems do (Aaskoven et al., 2024).</p><p>The current policy would see the 2022 retirement age of 67 increase to 74 by 2070, this bad news for workers is always provided with assurances that each successive generation that must retire later will also enjoy a proportionate improvement in life expectancy (European Commission, 2023)</p>',
        image: 'assets/denmark.png' // Update with the actual image path
    },
    unitedkingdom: {
        text: '<p>You clicked on the UK! In 2022 the UK Government passed the Health and Care Act with the intent of fostering collaboration between different levels of healthcare, from hospitals to GPs, from GPs to social care. (Dunn et al., 2022)</p><p> This is known as Integrated Healthcare, which intends to reduce healthcare costs and improve outcomes for patients by enabling earlier, more localised, and more individual health care (NHS England, n.d.). The UK\'s investments in Integrated Healthcare will aid in managing increasing healthcare costs in the face of an ageing population</p>',
        image: 'assets/uk.png' // Update with the actual image path
    },
    china: {
        text: '<p>You clicked on The People\'s Republic of China! In 1979 the Chinese Government introduced a series of punishments and incentives to prevent Chinese families having more than one child. This One Child Polciy resulted in the prevention of 400 million births (Hayes, 2024)!</p><p>Declining fertility rates resulted in the revisal of the One Child Policy at the end of 2015 (Hayes, 2024) into a Two Child Policy. As of 2021 the Chinese Government has now allowed Chinese families to have three kids, a response to a declining birth rate and ageing population (BBC News, 2021)</p>',
        image: 'assets/china.png' // Update with the actual image path
    },
    canada: {
        text: '<p>You clicked on Canada! As of 2023, an acute shortage in skilled employees has led the Canadian Government\'s Immigration, Refugees and Citizenship agency to make substantial changes to their immigration program by implementing \'category-based selection\'.</p><p>To overcome shortages in particular industries, the Canadian Government has proritized the migration of workers with that have strong French proficiency, or work experience in fields such as: healthcare, STEM, trades, transport, and argriculture. (Immigration, Refugees and Citizenship Canada, 2023)</p>',
        image: 'assets/canada.png' // Update with the actual image path
    }
};

// Function to open modal with specific content
function openModal(country) {
    const modalText = document.getElementById("modalText");
    const modalImage = document.getElementById("modalImage");
    const modal = document.querySelector(".modal"); // Correct modal selector

    modalText.innerHTML = countryInfo[country].text; // Set the modal text content
    modalImage.src = countryInfo[country].image; // Set the modal image source
    modal.style.display = "flex"; // Show the modal
    document.getElementById("navbar").style.display = "none"; // Hide the navbar when modal is open

    // Disable scroll on background when modal is open
    document.body.style.overflow = 'hidden';

    // Add scroll event listener to close modal on scroll
    window.addEventListener('scroll', closeModalOnScroll);
}

// Function to close the modal
function closeModal() {
    const modal = document.querySelector(".modal"); // Correct modal selector
    modal.style.display = "none"; // Hide the modal
    document.getElementById("navbar").style.display = "flex"; // Show navbar when modal is closed

    // Enable scroll on background when modal is closed
    document.body.style.overflow = 'auto';

    // Remove scroll event listener
    window.removeEventListener('scroll', closeModalOnScroll);
}

// Function to close modal on scroll
function closeModalOnScroll() {
    closeModal();
}

// Event listener for closing modal
document.getElementById("closeModal").addEventListener('click', closeModal);

// Add event listeners for countries
document.querySelector('.australia').addEventListener('click', function() {
    openModal('australia');
});

document.querySelector('.denmark').addEventListener('click', function() {
    openModal('denmark');
});

document.querySelector('.unitedkingdom').addEventListener('click', function() {
    openModal('unitedkingdom');
});

document.querySelector('.china').addEventListener('click', function() {
    openModal('china');
});

document.querySelector('.canada').addEventListener('click', function() {
    openModal('canada');
});

// Add click event to the button to trigger scrollDown function
document.getElementById('scrollButton').addEventListener('click', function() {
    if (document.querySelector(".modal").style.display === "flex") {
        closeModal(); // Close modal if it is open
    } else {
        scrollDown(); // Otherwise, perform the scroll down action
    }
});

// Prevent scrolling with the mouse
window.addEventListener('wheel', function(event) {
    event.preventDefault();
}, { passive: false });

// Other functions like scrollDown, handleArrowScroll, etc. remain unchanged


// When the user clicks anywhere outside of the modal, close it
window.addEventListener("click", function(event) {
    if (event.target == modal) {
        closeModal();
    }
});

// Function to scroll down or back to the top
function scrollDown() {
    const viewportHeight = window.innerHeight - 56; // Adjusted for navbar height (56px)

    // Disable inputs during scrolling
    disableInputs(true);

    if (document.body.scrollHeight - window.innerHeight - window.scrollY < 1) {
        // If at the bottom, scroll to the top
        window.scrollTo({ top: 0, behavior: 'smooth' });
        // Re-enable inputs after scrolling
        disableInputs(false);
    } else {
        // Scroll down by the height of the viewport minus navbar
        const duration = 300;  // Duration in milliseconds
        const start = window.scrollY;
        const startTime = performance.now();

        function scrollAnimation(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);  // Progress capped at 1
            window.scrollTo(0, start + progress * viewportHeight);

            if (progress < 1) {
                requestAnimationFrame(scrollAnimation);
            } else {
                // Re-enable inputs after scrolling
                disableInputs(false);
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

// Function to handle scroll with arrow keys
function handleArrowScroll(delta) {
    const viewportHeight = window.innerHeight - 56; // Adjusted for navbar height
    let targetScroll;

    if (window.innerHeight + window.scrollY >= document.body.scrollHeight - 1 && delta > 0) {
        // If at the bottom and scrolling down, scroll to the top
        targetScroll = 0;
    } else {
        targetScroll = window.scrollY + (delta * viewportHeight);
    }

    const duration = 300;  // Duration in milliseconds
    const start = window.scrollY;
    const startTime = performance.now();

    // Disable inputs during scrolling
    disableInputs(true);

    function scrollAnimation(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);  // Progress capped at 1
        window.scrollTo(0, start + progress * (targetScroll - start));

        if (progress < 1) {
            requestAnimationFrame(scrollAnimation);
        } else {
            // Re-enable inputs after scrolling
            disableInputs(false);
        }
    }

    requestAnimationFrame(scrollAnimation);
}

// Function to disable or enable inputs
function disableInputs(disable) {
    const inputs = document.querySelectorAll('input, button'); // Select all input and button elements
    inputs.forEach(input => {
        input.disabled = disable; // Disable or enable each input
    });
}

// Prevent scrolling with the mouse
window.addEventListener('wheel', function(event) {
    event.preventDefault();
}, { passive: false });

// Disable scrollbar
document.documentElement.style.overflow = 'hidden';

// Add scroll event listener to update button text and color based on scroll position
window.addEventListener('scroll', toggleButtonText);

// Add click event to the button to trigger scrollDown function
document.getElementById('scrollButton').addEventListener('click', scrollDown);

// Arrow key event listener
window.addEventListener('keydown', function(event) {
    if (event.key === 'ArrowDown') {
        handleArrowScroll(1);  // Scroll down
        event.preventDefault();
    } else if (event.key === 'ArrowUp') {
        handleArrowScroll(-1); // Scroll up
        event.preventDefault();
    }
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

// Setup hover effects for points and links
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
});

// Load references on page load
let references = [];
let currentPage = 0;
const itemsPerPage = 3; // Number of references per page (adjust based on space)

// Function to fetch and load references from the text file
function loadReferences() {
    fetch('references.txt') // Path to the references file (hardcoded)
        .then(response => response.text())
        .then(text => {
            // Split the file contents by newlines into an array of references
            references = text.split('\n').filter(line => line.trim() !== '');
            renderPage();
            updateButtons(); // Initially update button visibility
        })
        .catch(error => {
            console.error('Error loading the references file:', error);
        });
}


// Function to format a single reference with hyperlink
function formatReference(reference) {
    // Replace the placeholder with an apostrophe
    reference = reference.replace(/<<apostrophe>>/g, "'");

    // Extract the URL using a regular expression
    const urlPattern = /(https?:\/\/[^\s]+)/g;
    const urlMatch = reference.match(urlPattern);
    
    if (urlMatch) {
        const url = urlMatch[0];
        const beforeUrl = reference.split(url)[0].trim(); // Everything before the URL

        // Remove any asterisks used for titles
        const formattedReference = beforeUrl.replace(/\*(.*?)\*/g, '$1');

        // Append the hyperlink
        return `${formattedReference} <a href="${url}" target="_blank">${url}</a>`;
    }

    // Return the unmodified reference if no URL is found
    return reference; // Return the reference without any modification
}


// Function to render the current page of references
function renderPage() {
    const start = currentPage * itemsPerPage;
    const end = start + itemsPerPage;
    const pageReferences = references.slice(start, end);

    const container = document.getElementById('referencesContainer');
    container.innerHTML = ''; // Clear previous content

    pageReferences.forEach(ref => {
        const refItem = document.createElement('div');
        refItem.classList.add('reference-item', 'mb-3');
        // Format the reference text with hyperlink
        refItem.innerHTML = `<p class="reference-text">${formatReference(ref)}</p>`;
        container.appendChild(refItem);
    });

    // Update button visibility based on the current page and total references
    updateButtons();
}

// Function to update the visibility of the Next/Previous buttons
function updateButtons() {
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');

    // Previous button visibility
    if (currentPage === 0) {
        prevBtn.classList.add('hidden');
    } else {
        prevBtn.classList.remove('hidden');
    }

    // Next button visibility
    if ((currentPage + 1) * itemsPerPage >= references.length) {
        nextBtn.classList.add('hidden');
    } else {
        nextBtn.classList.remove('hidden');
    }
}

// Pagination button event listeners
document.getElementById('prevBtn').addEventListener('click', function() {
    if (currentPage > 0) {
        currentPage--;
        renderPage();
    }
});

document.getElementById('nextBtn').addEventListener('click', function() {
    if ((currentPage + 1) * itemsPerPage < references.length) {
        currentPage++;
        renderPage();
    }
});

// Load references on page load
window.onload = function() {
    loadReferences(); // Load the references from the file
};

