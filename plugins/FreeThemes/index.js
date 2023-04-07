const persist = shelter.plugin.store;

const unloadables = [];

function getThemeType(node) {
  return Array.from(node.classList).find(i => i.startsWith("theme-"));
}

function setCurrentTheme() {
  if (!persist.themeData || !persist.themeType) return;
  
  let themeNode = document.querySelector('style[free-themes="true"]');
  
  if (!themeNode) {
    themeNode = document.createElement("style");
    themeNode.setAttribute("free-themes", "true");
    
    document.body.appendChild(themeNode);
  };
  
  themeNode.innerText = persist.themeData;
  
  document.body.classList.remove(getThemeType(document.body));
  document.body.classList.add(persist.themeType);
}

export function onLoad() {
  document.body.classList.add("custom-theme-background");
  
  unloadables.push(
    shelter.flux.intercept(e => {
      if (e?.event == "client_theme_updated") {
        setTimeout(() => {
          persist.themeData = document.querySelector('style[data-client-themes="true"]').innerText;
          persist.themeType = getThemeType(document.documentElement);
          setCurrentTheme();
        }, 100)
      };
    })
  );
  
  setCurrentTheme();
}

export function onUnload() {
  unloadables.forEach(unload => unload())
  
  document.querySelector('style[free-themes="true"]').remove();
  document.body.classList.remove(persist.themeType);
}
