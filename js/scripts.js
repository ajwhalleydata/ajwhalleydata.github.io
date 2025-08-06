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
          console.error('Sidebar element not found');
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
          attachToggleEvent();
        } else {
          console.error('SidebarButton element not found');
        }
      })
      .catch(error => console.error('Error loading sidebar button:', error));
  
    // Ensure sidebar is visible by default
    const body = document.body;
    body.classList.remove('sidebar-hidden');
    const sidebar = document.getElementById('sidebar');
    if (sidebar) {
      sidebar.classList.remove('hidden');
    }
  });
  
  function attachToggleEvent() {
    const sidebar = document.getElementById('sidebar');
    const toggleButton = document.getElementById('toggle-sidebar');
    const body = document.body;
  
    if (toggleButton) {
      toggleButton.addEventListener('click', () => {
        body.classList.toggle('sidebar-hidden');
        sidebar.classList.toggle('hidden');
        toggleButton.innerHTML = body.classList.contains('sidebar-hidden') ? '▶' : '◀';
      });
    } else {
      console.error('Toggle button not found. Ensure inc/sidebar-button.html contains <button id="toggle-sidebar">');
    }
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