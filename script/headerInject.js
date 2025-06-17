fetch('../vue/header.html')
  .then(response => response.text())
  .then(data => {
    const nav = document.getElementById('nav-container');
    nav.innerHTML = data;

    const toggle = document.getElementById('theme-toggle');
    if (toggle) {
      toggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
      });
    }
  })
  .catch(err => {
    console.error('Erreur de chargement du nav:', err);
  });

//---- Easy access below without having to read the code ----
//<nav id="nav-container"></nav>
//<script src="../script/headerInject.js"></script>
