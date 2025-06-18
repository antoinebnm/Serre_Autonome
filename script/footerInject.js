fetch("/api/footer")
  .then((response) => response.text())
  .then((data) => {
    const footer = document.getElementById("footer-container");
    footer.innerHTML = data;
  })
  .catch((err) => {
    console.error("Erreur de chargement du footer:", err);
  });

//<footer id="footer-container"></footer>
//<script src="../script/footerInject.js"></script>
