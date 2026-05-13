/**
 * EduSync Tab System - Fixed Version
 * Properly handles tab switching and content display
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize tab system
    initializeTabs();
});

function initializeTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn, .tab-button');
    const tabContents = document.querySelectorAll('.tab-content, [class*="Content"]');

    if (tabButtons.length === 0) {
        console.warn('No tab buttons found');
        return;
    }

    // Add click event listeners to all tab buttons
    tabButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Get the tab name from data-tab attribute
            const tabName = button.getAttribute('data-tab');
            
            if (!tabName) {
                console.warn('Tab button missing data-tab attribute');
                return;
            }

            // Switch to the selected tab
            switchTab(tabName);
            
            // Update active button state
            tabButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
        });
    });

    // Set first tab as active by default
    if (tabButtons.length > 0) {
        tabButtons[0].classList.add('active');
    }
}

function switchTab(tabName) {
    // Hide all tab contents
    const allContents = document.querySelectorAll('.tab-content, [id*="Content"]');
    allContents.forEach(content => {
        content.classList.remove('active');
        content.style.display = 'none';
    });

    // Show the selected tab content
    // Try multiple selectors to find the content
    let targetContent = document.getElementById(tabName + 'Content');
    
    if (!targetContent) {
        targetContent = document.querySelector(`[data-tab="${tabName}"]`);
    }
    
    if (!targetContent) {
        targetContent = document.querySelector(`.${tabName}-content`);
    }
    
    if (!targetContent) {
        // Try to find by tab-content class and data attribute
        const contents = document.querySelectorAll('.tab-content');
        for (let content of contents) {
            if (content.id.includes(tabName)) {
                targetContent = content;
                break;
            }
        }
    }

    if (targetContent) {
        targetContent.classList.add('active');
        targetContent.style.display = 'block';
    } else {
        console.warn(`Tab content not found for tab: ${tabName}`);
    }
}

/**
 * Legacy support: openTab function for backward compatibility
 */
function openTab(tabName) {
    switchTab(tabName);
    
    // Update button states
    const tabButtons = document.querySelectorAll('.tab-btn, .tab-button');
    tabButtons.forEach(btn => {
        if (btn.getAttribute('data-tab') === tabName) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
}

/**
 * Initialize tab navigation for admin panel
 */
function initializeAdminTabs() {
    const adminTabButtons = document.querySelectorAll('.admin-tab-btn');
    
    adminTabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabId = button.getAttribute('data-tab');
            
            // Remove active class from all buttons
            adminTabButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            button.classList.add('active');
            
            // Hide all tab contents
            const allTabContents = document.querySelectorAll('.admin-tab-content');
            allTabContents.forEach(content => content.classList.remove('active'));
            
            // Show selected tab content
            const selectedContent = document.getElementById(`tab-${tabId}`);
            if (selectedContent) {
                selectedContent.classList.add('active');
            }
        });
    });
}

// Initialize admin tabs if they exist
if (document.querySelector('.admin-tab-btn')) {
    document.addEventListener('DOMContentLoaded', initializeAdminTabs);
}