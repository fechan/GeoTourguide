"use strict";
(function() {
  document.getElementById("show-info").addEventListener("click", () => toggleModal("info-modal"));
  document.getElementById("close-info").addEventListener("click", () => toggleModal("info-modal"));
  document.getElementById("close-corsanywhere")
    .addEventListener("click", () => toggleModal("corsanywhere-modal"));
  
  /**
   * Toggles the the modal with the given ID
   * @param {String} modalId the ID of the modal to toggle
   */
  function toggleModal(modalId) {
    let modal = document.getElementById(modalId);
    if (modal.classList.contains("modal-hidden")) {
      modal.classList.remove("modal-hidden");
      modal.classList.add("modal-shown");
    } else {
      modal.classList.remove("modal-shown");
      modal.classList.add("modal-hidden");
    }
  }
})();