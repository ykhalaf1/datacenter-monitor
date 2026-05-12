function updateClock() {
    document.getElementById('ts').textContent = new Date().toLocaleString(undefined, {
      year:'numeric', month:'short', day:'numeric',
      hour:'2-digit', minute:'2-digit', second:'2-digit'
    });
  }
  updateClock();
  setInterval(updateClock, 1000);
  