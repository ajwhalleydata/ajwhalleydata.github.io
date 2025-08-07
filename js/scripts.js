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
          const mobileClose = document.getElementById('mobile-close');
          if (mobileClose) {
            mobileClose.addEventListener('click', () => {
              document.body.classList.add('sidebar-hidden');
              sidebar.classList.add('hidden');
              document.removeEventListener('click', outsideClickListener);
            });
          }
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

    // Ensure sidebar is hidden by default on mobile
    const body = document.body;
    const sidebar = document.getElementById('sidebar');
    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    if (isMobile) {
      body.classList.add('sidebar-hidden');
      if (sidebar) {
        sidebar.classList.add('hidden');
        // Set display: flex to enable transitions after initial render
        setTimeout(() => {
          sidebar.style.display = 'flex';
        }, 0);
      }
    } else {
      body.classList.remove('sidebar-hidden');
      if (sidebar) sidebar.classList.remove('hidden');
    }

    // Attach mobile toggle event with retry for robustness
    const attachMobileToggle = () => {
      const mobileToggle = document.getElementById('mobile-toggle');
      if (mobileToggle) {
        mobileToggle.addEventListener('click', () => {
          const isHidden = body.classList.contains('sidebar-hidden');
          if (isHidden) {
            body.classList.remove('sidebar-hidden');
            sidebar.classList.remove('hidden');
            console.log('Mobile sidebar toggled: Visible');
            setTimeout(() => {
              document.addEventListener('click', outsideClickListener);
            }, 0);
          } else {
            body.classList.add('sidebar-hidden');
            sidebar.classList.add('hidden');
            document.removeEventListener('click', outsideClickListener);
            console.log('Mobile sidebar toggled: Hidden');
          }
        });
      } else {
        console.warn('Mobile toggle (#mobile-toggle) not found, retrying...');
        setTimeout(attachMobileToggle, 100);
      }
    };
    attachMobileToggle();

    // Outside click listener to close sidebar on mobile
    function outsideClickListener(event) {
      if (!sidebar.contains(event.target) && !document.getElementById('mobile-toggle').contains(event.target)) {
        body.classList.add('sidebar-hidden');
        sidebar.classList.add('hidden');
        document.removeEventListener('click', outsideClickListener);
        console.log('Mobile sidebar toggled: Hidden (outside click)');
      }
    }
});

function attachToggleEvent(toggleButton) {
    const sidebar = document.getElementById('sidebar');
    const body = document.body;
    toggleButton.addEventListener('click', () => {
        body.classList.toggle('sidebar-hidden');
        sidebar.classList.toggle('hidden');
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