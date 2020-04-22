"use strict";
(function() {
  document.getElementById("show-info").addEventListener("click", toggleModal);
  document.getElementById("close-info").addEventListener("click", toggleModal);

  /**
   * Toggles the information modal
   */
  function toggleModal() {
    let modal = document.getElementById("info-modal");
    if (modal.classList.contains("modal-hidden")) {
      modal.classList.remove("modal-hidden");
      modal.classList.add("modal-shown");
    } else {
      modal.classList.remove("modal-shown");
      modal.classList.add("modal-hidden");
    }
  }
})();