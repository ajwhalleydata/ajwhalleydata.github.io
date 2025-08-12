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
              requestAnimationFrame(() => {
                document.body.classList.add('sidebar-hidden');
                sidebar.classList.add('hidden');
                document.removeEventListener('click', outsideClickListener);
                console.log('Mobile sidebar closed via close button');
              });
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
  
    // Set initial sidebar state based on device
    const setSidebarState = () => {
      const body = document.body;
      const sidebar = document.getElementById('sidebar');
      const isMobile = window.matchMedia('(max-width: 768px)').matches;
      if (sidebar) {
        if (isMobile) {
          body.classList.add('sidebar-hidden');
          sidebar.classList.add('hidden');
        } else {
          body.classList.remove('sidebar-hidden');
          sidebar.classList.remove('hidden');
        }
      }
    };
    setSidebarState();
  
    // Handle window resize to maintain sidebar state
    window.addEventListener('resize', () => {
      requestAnimationFrame(setSidebarState);
    });
  
    // Attach mobile toggle event
    const attachMobileToggle = () => {
      const mobileToggle = document.getElementById('mobile-toggle');
      if (mobileToggle) {
        mobileToggle.addEventListener('click', () => {
          requestAnimationFrame(() => {
            const body = document.body;
            const sidebar = document.getElementById('sidebar');
            body.classList.toggle('sidebar-hidden');
            sidebar.classList.toggle('hidden');
            console.log('Mobile sidebar toggled:', body.classList.contains('sidebar-hidden') ? 'Hidden' : 'Visible');
            if (body.classList.contains('sidebar-hidden')) {
              document.removeEventListener('click', outsideClickListener);
            } else {
              setTimeout(() => document.addEventListener('click', outsideClickListener), 100);
            }
          });
        });
      } else {
        console.warn('Mobile toggle (#mobile-toggle) not found, retrying...');
        setTimeout(attachMobileToggle, 100);
      }
    };
    attachMobileToggle();
  
    // Outside click listener to close sidebar on mobile
    function outsideClickListener(event) {
      const sidebar = document.getElementById('sidebar');
      const mobileToggle = document.getElementById('mobile-toggle');
      if (sidebar && mobileToggle && !sidebar.contains(event.target) && !mobileToggle.contains(event.target)) {
        requestAnimationFrame(() => {
          document.body.classList.add('sidebar-hidden');
          sidebar.classList.add('hidden');
          document.removeEventListener('click', outsideClickListener);
          console.log('Mobile sidebar toggled: Hidden (outside click)');
        });
      }
    }
  });
  
  function attachToggleEvent(toggleButton) {
    const sidebar = document.getElementById('sidebar');
    const body = document.body;
    toggleButton.addEventListener('click', () => {
      requestAnimationFrame(() => {
        body.classList.toggle('sidebar-hidden');
        sidebar.classList.toggle('hidden');
        const icon = toggleButton.querySelector('i');
        icon.classList.toggle('fa-chevron-left');
        icon.classList.toggle('fa-chevron-right');
        console.log('Sidebar toggled:', body.classList.contains('sidebar-hidden') ? 'Hidden' : 'Visible');
      });
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