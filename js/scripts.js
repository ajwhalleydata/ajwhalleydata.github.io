document.addEventListener('DOMContentLoaded', () => {
    // Load sidebar content
    fetch('inc/sidebar-content.html')
      .then(response => {
        if (!response.ok) throw new Error(`Failed to load sidebar-content.html: ${response.status}`);
        return response.text();
      })
      .then(html => {
        const sidebar = document.getElementById('sidebar');
        if (sidebar) {
          sidebar.innerHTML = html;
          highlightActiveLink();
        } else {
          console.error('Sidebar element (#sidebar) not found in DOM');
        }
      })
      .catch(error => console.error('Error loading sidebar content:', error));
  
    // Load sidebar button
    fetch('inc/sidebar-button.html')
      .then(response => {
        if (!response.ok) throw new Error(`Failed to load sidebar-button.html: ${response.status}`);
        return response.text();
      })
      .then(html => {
        const sidebarButton = document.getElementById('sidebarButton');
        if (sidebarButton) {
          sidebarButton.innerHTML = html;
          const toggleButton = document.getElementById('toggle-sidebar');
          if (toggleButton) {
            attachToggleEvent(toggleButton);
            console.log('Toggle button bound successfully');
          } else {
            console.error('Toggle button (#toggle-sidebar) not found in sidebar-button.html');
          }
        } else {
          console.error('SidebarButton element (#sidebarButton) not found in DOM');
        }
      })
      .catch(error => console.error('Error loading sidebar button:', error));
  
    // Ensure sidebar is visible by default
    const body = document.body;
    body.classList.remove('sidebar-hidden');
    const sidebar = document.getElementById('sidebar');
    if (sidebar) {
      sidebar.classList.remove('hidden');
    } else {
      console.error('Sidebar element (#sidebar) not found on load');
    }
});

function attachToggleEvent(toggleButton) {
    const sidebar = document.getElementById('sidebar');
    const body = document.body;

    toggleButton.addEventListener('click', () => {
        body.classList.toggle('sidebar-hidden');
        sidebar.classList.toggle('hidden');
        // Update toggle button icon
        const icon = toggleButton.querySelector('.material-icons-outlined');
        icon.textContent = body.classList.contains('sidebar-hidden') ? 'chevron_right' : 'chevron_left';
        console.log('Sidebar toggled:', body.classList.contains('sidebar-hidden') ? 'Hidden' : 'Visible');
    });
}

function highlightActiveLink() {
    const path = window.location.pathname.toLowerCase();
    const links = document.querySelectorAll('#sidebar nav ul li a');
  
    links.forEach(link => {
        const href = link.getAttribute('href').toLowerCase();
        if (
            (path === '/' || path.includes('index.html')) && href.includes('index.html') ||
            path.includes('/projects/') && href.includes('projects/') ||
            path.includes('/videos/') && href.includes('videos/')
        ) {
            link.classList.add('active');
        }
    });
}