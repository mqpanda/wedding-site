function updateClasses() {
  const styleSheet = [...document.styleSheets].find(
    (sheet) => sheet.href && sheet.href.includes("style.css")
  );

  if (!styleSheet) return;

  let newStyles = "";
  const classMap = new Map(); // Храним соответствие старых и новых классов

  document.querySelectorAll("[class]").forEach((el) => {
    el.classList.forEach((cls) => {
      if (!classMap.has(cls)) {
        const newClass = cls + "_" + Date.now().toString(36);
        classMap.set(cls, newClass);
      }
      el.classList.replace(cls, classMap.get(cls));
    });
  });

  function processRules(rules, insideMedia = "") {
    let mediaStyles = "";

    for (let rule of rules) {
      if (rule instanceof CSSStyleRule) {
        classMap.forEach((newClass, oldClass) => {
          if (rule.selectorText.includes(oldClass)) {
            mediaStyles +=
              rule.cssText.replace(
                new RegExp(`\\b${oldClass}\\b`, "g"),
                newClass
              ) + "\n";
          }
        });
      } else if (rule instanceof CSSMediaRule) {
        let innerStyles = processRules(rule.cssRules, rule.conditionText);
        if (innerStyles) {
          mediaStyles += `@media ${rule.conditionText} {\n${innerStyles}}\n`;
        }
      }
    }

    return mediaStyles;
  }

  newStyles = processRules(styleSheet.cssRules);

  if (newStyles) {
    const style = document.createElement("style");
    style.innerHTML = newStyles;
    document.head.appendChild(style);
  }
}

window.onload = updateClasses;
