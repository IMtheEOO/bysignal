// Function to get URL parameters
function getUrlParameter(name) {
  name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
  var regex = new RegExp("[\\?&]" + name + "=([^&#]*)");
  var results = regex.exec(location.search);
  return results === null
    ? ""
    : decodeURIComponent(results[1].replace(/\+/g, " "));
}

function getCookie(name) {
  var cookieArr = document.cookie.split(";");
  for (var i = 0; i < cookieArr.length; i++) {
    var cookiePair = cookieArr[i].split("=");
    if (name == cookiePair[0].trim()) {
      return decodeURIComponent(cookiePair[1]);
    }
  }
  return null;
}

var websiteURL = window.location.origin;

// var scriptTag = document.querySelector('script[src="bysignal-tracker.js"]');

// Retrieve the value of the custom attribute
// var customAttribute = scriptTag.getAttribute("data-bysignal");

// Function to fetch data from an API
function sendResponseData(via, apiKey, currentUser) {
  var formdata = new FormData();
  formdata.append("via", via);
  formdata.append("api-key", apiKey);
  formdata.append("current-user", currentUser);
  formdata.append("website-url", websiteURL);

  var requestOptions = {
    method: "POST",
    body: formdata,
    redirect: "follow",
  };

  fetch(
    "https://bysignal.bubbleapps.io/version-test/api/1.1/wf/tracker",
    requestOptions
  )
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      console.log("Data from API:", data);

      var referralUser = data.response.current_user;
      var referral = data.response.referral_id;

      document.cookie =
        "referral_source=" +
        referral +
        "; expires=Thu, 18 Dec 2025 12:00:00 UTC; path=/";

      document.cookie =
        "referral_user=" +
        referralUser +
        "; expires=Thu, 18 Dec 2025 12:00:00 UTC; path=/";
    })
    .catch((error) => {
      console.error("There was a problem with the fetch operation:", error);
    });
}

// Function to track referral information
function trackReferral() {
  var referralSource = getUrlParameter("via");
  var currentUser = getCookie("referral_user");

  sendResponseData(
    referralSource,
    "1710247533583x687487790298431500",
    currentUser
  );
}

// Call the tracking function when the page loads
window.onload = function () {
  trackReferral();
};