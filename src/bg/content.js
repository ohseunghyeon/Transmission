const LEFT_MOUSE_BUTTON = 0;

document.addEventListener("click", (e) => {

  if (e.button === LEFT_MOUSE_BUTTON) {
    const anchor = recursivelyFindAnchorAncestor(e.target);
    if (
      anchor != null &&
      anchor.href &&
      anchor.href.startsWith('magnet')
    ) {
      chrome.runtime.sendMessage(
        {
          action: 'putTorrent',
          url: anchor.href,
        },
        function (response) {
          console.log("Response: ", response);
        });
      e.preventDefault();
    }
  }
});

function recursivelyFindAnchorAncestor(
  e,
  depth,
) {
  if (e == null) {
    return undefined;
  } else if (e instanceof HTMLAnchorElement) {
    return e;
  } else if (depth === 0) {
    return undefined;
  } else {
    return recursivelyFindAnchorAncestor(e.parentElement, depth - 1);
  }
}