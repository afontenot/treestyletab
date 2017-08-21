/*
# This Source Code Form is subject to the terms of the Mozilla Public
# License, v. 2.0. If a copy of the MPL was not distributed with this
# file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

var gTabs;
var gInternalMovingCount = 0;

function init() {
  window.addEventListener('unload', destroy, { once: true });
  gTabs = document.getElementById('tabs');
  gTabs.addEventListener('mousedown', omMouseDown);
  chrome.tabs.onActivated.addListener(onSelect);
  chrome.tabs.onUpdated.addListener(onUpdated);
  chrome.tabs.onCreated.addListener(onCreated);
  chrome.tabs.onRemoved.addListener(onRemoved);
  chrome.tabs.onMoved.addListener(onMoved);
  chrome.tabs.onAttached.addListener(onAttached);
  chrome.tabs.onDetached.addListener(onDetached);
  rebuildAll();
}

function destroy() {
  chrome.tabs.onActivated.removeListener(onSelect);
  chrome.tabs.onUpdated.removeListener(onUpdated);
  chrome.tabs.onCreated.removeListener(onCreated);
  chrome.tabs.onRemoved.removeListener(onRemoved);
  chrome.tabs.onMoved.removeListener(onMoved);
  chrome.tabs.onAttached.removeListener(onAttached);
  chrome.tabs.onDetached.removeListener(onDetached);
  gTabs.removeEventListener('mousedown', omMouseDown);
  gTabs = undefined;
}

function rebuildAll() {
  chrome.tabs.query({ currentWindow: true }, (aTabs) => {
    clear();
    for (let tab of aTabs) {
      gTabs.appendChild(buildTabItem(tab));
    }
  });
}

function buildTabItem(aTab) {
  let item = document.createElement('li');
  item.tab = aTab;
  item.setAttribute('id', `tab-${aTab.windowId}-${aTab.id}`);
  item.setAttribute('data-child-ids', '|');
  item.appendChild(document.createTextNode(aTab.title));
  item.setAttribute('title', aTab.title);
  if (aTab.active)
    item.classList.add('active');
  return item;
}

function clear() {
  var range = document.createRange();
  range.selectNodeContents(gTabs);
  range.deleteContents();
  range.detach();
}
