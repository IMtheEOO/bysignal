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

function getWebsiteUrl() {
  var url = window.location.origin;
  return url;
}

var scriptTag = document.getElementById("bysignalscript");

var customAttribute = scriptTag.getAttribute("data-bysignal");

console.log(customAttribute)

function sendResponseData(via, apiKey, currentUser, websiteURL) {
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
      var days = data.response.duration;

      var expires = "";

      var date = new Date();
      date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
      expires = "; expires=" + date.toUTCString();

      document.cookie = "referral_source=" + referral + "; expires=" + date.toUTCString() + "; path=/";

      document.cookie = "referral_user=" + referralUser + expires + "; path=/";

      console.log(expires);
    })
    .catch((error) => {
      console.error("There was a problem with the fetch operation:", error);
    });
}

function trackReferral() {
  var referralSource = getUrlParameter("via");
  var currentUser = getCookie("referral_user");
  var websiteUrl = getWebsiteUrl();

  sendResponseData(
    referralSource,
    "1710247533583x687487790298431500",
    currentUser,
    websiteUrl
  );
}

window.onload = function () {
  trackReferral();
};
