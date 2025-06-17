fetch('../vue/header.html')
  .then(response => response.text())
  .then(data => {
    const nav = document.getElementById('nav-container');
    nav.innerHTML = data;

    // Apply saved theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      document.body.classList.add('dark-mode');
    } else if (savedTheme === 'light') {
      document.body.classList.remove('dark-mode');
    } else {
      // Optional: use system preference if nothing saved
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) {
        document.body.classList.add('dark-mode');
        localStorage.setItem('theme', 'dark');
      }
    }

    // Toggle listener
    const toggle = document.getElementById('theme-toggle');
    if (toggle) {
      toggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        const isDark = document.body.classList.contains('dark-mode');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
      });
    }
  })
  .catch(err => {
    console.error('Erreur de chargement du nav:', err);
  });

//---- Easy access below without having to read the code ----
//<nav id="nav-container"></nav>
//<script src="../script/headerInject.js"></script>
