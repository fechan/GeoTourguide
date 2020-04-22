"use strict";
(function() {
  const CORSANYWHERE = "https://cors-anywhere.herokuapp.com";
  const OOCITIES = "www.oocities.org";

  let hoodSelector = document.getElementById("neighborhood-select");
  hoodSelector.addEventListener("change", changeNeighborhoods);
  changeNeighborhoods();

  /**
   * Updates the directory of available sites in the nav
   */
  function changeNeighborhoods() {
    let neighborhood = document.getElementById("neighborhood-select");
    neighborhood = neighborhood.value;
    let siteList = document.getElementById("site-list");
    siteList.innerHTML = "";
    siteList.textContent = "Getting site list...";
    
    let xhr = new XMLHttpRequest();
    xhr.onload = function() {
      siteList.innerHTML = "";
      let html = this.responseXML;
      let links = extractLinks(html).filter(linksToSite);
      for (let link of links) {
        let site = document.createElement("a");
        site.textContent = link.textContent;
        site.href = `https://${OOCITIES}/${neighborhood}/${link.getAttribute("href")}`;
        site.target = "archive-display";
        let listItem = document.createElement("li");
        listItem.appendChild(site);
        siteList.append(listItem);
      }
    }
    xhr.open("GET", `${CORSANYWHERE}/${OOCITIES}/${neighborhood}`);
    xhr.responseType = "document";
    xhr.send();
  }

  /**
   * Extracts an array of <a> tags from Oocities directory for a neighborhood
   * @param {HTMLDocument} html html document to search for links in
   * @returns {Array} list of links
   */
  function extractLinks(html) {
    //this will break if oocities changes, which is why it's its own function
    return Array.from(html.querySelectorAll("a"));
  }

  /**
   * Checks if <a> link directs to an actual archived site
   * @param {HTMLElement} link the <a> to check
   * @returns {Boolean} whether link is an archived site or not
   */
  function linksToSite(link) {
    //this will break if oocities changes, which is why it's its own function
    return link.href.includes(link.textContent);
  }
})();