"use strict";
(function() {
  const CORSANYWHERE = "https://cors-anywhere.herokuapp.com";
  const OOCITIES = "www.oocities.org";

  let hoodCache = {};
  let currentSite;

  document.getElementById("neighborhood-select").addEventListener("change", changeNeighborhoods);
  document.getElementById("get-link").addEventListener("click", showDirectLink);
  setInitialDisplay()

  /**
   * Opens a prompt containing a link to the current neighborhood and site
   */
  function showDirectLink() {
    let currentNeighborhood = document.getElementById("neighborhood-select").value;
    let params = new URLSearchParams({currentNeighborhood, currentSite});
    window.prompt("Link to current site:", location.origin + location.pathname + params.toString());
  }

  /**
   * Sets the initial display.
   * If the URL has a neighborhood set, the neighborhood selector will be set to that neighborhood
   * If the URL also has a site set, the site displayer will show that site
   */
  function setInitialDisplay () {
    document.getElementById("archive-display").src = "about:blank";

    let url = new URL(document.URL);
    //only sets value from url if it exists as an option
    let neighborhood = url.searchParams.get("neighborhood");
    if (neighborhood) {
      let selector = document.getElementById("neighborhood-select");
      let options = Array.from(selector.options).map(option => option.value);
      if (options.find(value => value === neighborhood)) { 
        selector.value = neighborhood;
        let site = url.searchParams.get("site");
        if (site) {
          let display = document.getElementById("archive-display");
          display.src = `https://${OOCITIES}/${neighborhood}/${site}`;
          currentSite = site;
        }
      }
    }
    changeNeighborhoods();
  }

  /**
   * Updates the directory of available sites in the nav.
   */
  function changeNeighborhoods() {
    let neighborhood = document.getElementById("neighborhood-select");
    neighborhood = neighborhood.value;
    let siteList = document.getElementById("site-list");
    siteList.innerHTML = "";
    siteList.textContent = "Getting site list...";
    
    if (hoodCache[neighborhood] === undefined) {
      let xhr = new XMLHttpRequest();
      xhr.onload = function() {
        siteList.innerHTML = "";
        let html = this.responseXML;
        hoodCache[neighborhood] = extractLinks(html).filter(linksToSite);
        createSiteList(hoodCache[neighborhood], neighborhood);
      }
      xhr.onerror = function() {
        siteList.innerHTML = "";
        siteList.textContent = "Failed to get site list. Oocities archive or CORS Anywhere proxy " +
          "might be down. Please try again later.";
      }
      xhr.open("GET", `${CORSANYWHERE}/${OOCITIES}/${neighborhood}`);
      xhr.responseType = "document";
      xhr.send();
    } else {
      siteList.innerHTML = "";
      createSiteList(hoodCache[neighborhood], neighborhood);
    }
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

  /**
   * Updates the site list with links to sites from an array
   * @param {Array} links array of <a> elements
   * @param {String} neighborhood neighborhood that the links belong to
   */
  function createSiteList(links, neighborhood) {
    let siteList = document.getElementById("site-list");
    for (let link of links) {
      let site = document.createElement("a");
      site.textContent = link.textContent;
      site.href = `https://${OOCITIES}/${neighborhood}/${link.getAttribute("href")}`;
      site.addEventListener("click", () => currentSite = link.getAttribute("href"));
      site.target = "archive-display";
      let listItem = document.createElement("li");
      listItem.appendChild(site);
      siteList.append(listItem);
    }
  }
})();