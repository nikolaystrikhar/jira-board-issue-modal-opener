// ==UserScript==
// @name         Jira Board Issue Modal Opener
// @description  Fakes a modal view on a board page.
// @namespace    http://tampermonkey.net/
// @version      0.1
// @match        https://*.atlassian.net/jira/software/c/projects/*/boards/*/backlog*
// @grant        none
// ==/UserScript==

// Modal.

const style = `
[data-testid="issue.views.issue-details.issue-layout.compact-layout"] {
 position: fixed;
 top: 60px;
 left: 50%;
 transform: translateX(-50%);
 z-index: 510;
 width: calc(-120px + 100vw);
 max-height: calc(-119px + 100vh);
 background: var(--ds-surface-overlay, white);
 border-radius: 3px;
 box-shadow: var(--ds-shadow-overlay, 0 0 0 1px rgba(9, 30, 66, 0.08), 0 2px 1px rgba(9, 30, 66, 0.08), 0 0 20px -6px rgba(9, 30, 66, 0.31));
}
`;

const styleElement = document.createElement("style");
styleElement.textContent = style;
document.head.appendChild(styleElement);

// Overlay.

function addOverlayOnIssueSelect() {
  const urlParams = new URLSearchParams(window.location.search);
  const selectedIssue = urlParams.get('selectedIssue');
  const existingStyle = document.getElementById('jira-overlay-style');

  if (selectedIssue && !existingStyle) {
    const newStyleElement = document.createElement('style');
    newStyleElement.id = 'jira-overlay-style';
    newStyleElement.textContent = `
      html::before {
          content: '';
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: #10121499;
          z-index: 509;
      }`;
    document.head.appendChild(newStyleElement);
  } else if (!selectedIssue && existingStyle) {
    existingStyle.remove();
  }
}

// Run on initial load and URL changes
addOverlayOnIssueSelect();

const observer = new MutationObserver(() => {
  addOverlayOnIssueSelect();
});

observer.observe(document.body, {
  childList: true,
  subtree: true
});
