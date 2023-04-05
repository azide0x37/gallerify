chrome.commands.onCommand.addListener(function (command) {
  if (command === "open_new_tab") {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      const activeTab = tabs[0];
      chrome.scripting.executeScript(
        {
          target: { tabId: activeTab.id },
          function: redirectToTopPosts,
        },
        (results) => {
          const newUrl = results[0]?.result;
          if (newUrl) {
            chrome.tabs.update(activeTab.id, { url: newUrl });
          }
        }
      );
    });
  }
});

function redirectToTopPosts() {
  const regexPost = /^https:\/\/www\.reddit\.com\/r\/[^/]+\/comments\/[^/]+\/.*$/;
  const regexSubreddit = /^https:\/\/www\.reddit\.com\/r\/[^/]+\/?$/;

  if (regexPost.test(location.href) || regexSubreddit.test(location.href)) {
    const subredditPath = location.pathname.split("/").slice(0, 3).join("/");
    return `https://www.redditp.com${subredditPath}/top/?t=all`;
  }
  return null;
}
