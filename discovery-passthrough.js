// Helper function to get the value of a url parameter
function getURLParameter(name) {
    return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search) || [null, ''])[1].replace(/\+/g, '%20')) || null;
}

// Transform an EDS query string into Encore's format
// Note that the two systems do not share the same indexes
// so queries will not map smoothly. The behavior will drop
// index types not recognized in Encore and make them keyword
function tranformEDSQuery(query) {
    var queryStr = query;
    //clean up double parens, non-alpha
    queryStr = queryStr.replace(/\({1,}(.*?)\){1,}/g, "($1)");
    queryStr = queryStr.replace(/[^a-zA-z0-9\(\)]/g, " ");
    // Swap AND/OR for Encore equivalents
    queryStr = queryStr.replace(/ OR /g, "|");
    queryStr = queryStr.replace(/ AND /g, " ");
    // remove outer parens from supported indexes
    queryStr = queryStr.replace(/\((?!TI|SU|AU)(\w*?)\)/g, "$1");
    // swap EDS index names for Encore format
    queryStr = queryStr.replace(/\(TI (.*)\)/g, "t:($1)");
    queryStr = queryStr.replace(/\(SU (.*)\)/g, "d:($1)");
    queryStr = queryStr.replace(/\(AU (.*)\)/g, "a:($1)");
    // If it isn't an index supported by Encore, drop it
    queryStr = queryStr.replace(/\((?:SO\s|TX\s|IS\s|IN\s|AB\s)/gm, "(");

    return queryStr;
}

function genButton(searchHref) {
  var button = "\
  <div style='text-align:center; margin-bottom: 10px;'>\
  <a href='" + searchHref + "'> \
  <img src='//classic.searchmobius.org/screens/mobius.png'\
  alt='MOBIUS logo'\
  style='width:100%'>\
  <span>Search this in MOBIUS</span>  \
  </a>\
  </div>\
  ";
  return button;
}


(function createPassthrough() {
  // This will run on EBSCO EDS only. Initially we thought we'd make this work
  // with Summon also, but that turned out to be less important.
  if (document.querySelector("body.eds")) {
    var query = getURLParameter("bquery"),
      encoreQuery = encodeURI(tranformEDSQuery(query)),
      searchHref = "https://searchmobius.org/iii/encore/search/C__S" + encoreQuery + "__Orightresult__U?lang=eng&suite=cobalt",
      // Get a reference to the sidebar element
      parentElement = document.getElementById('column2'),
      // We want our button to be at the top, so select the first child
      theFirstChild = parentElement.firstChild,
      // Make our div and create the button inside
      mobiusDiv = document.createElement("div");
    mobiusDiv.id = "mobius-div";
    mobiusDiv.innerHTML = genButton(searchHref);
    // Insert the button/div before the first child
    parentElement.insertBefore(mobiusDiv, theFirstChild);
  }
})();
