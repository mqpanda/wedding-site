function updateClasses() {
  const styleSheet = [...document.styleSheets].find(
    (sheet) => sheet.href && sheet.href.includes("style.css")
  );

  if (styleSheet) {
    let newStyles = "";
    document.querySelectorAll("[class]").forEach((el) => {
      el.classList.forEach((cls) => {
        const newClass = cls + "_" + Date.now().toString(36);
        el.classList.replace(cls, newClass);

        // Копируем старые стили и применяем к новому классу
        [...styleSheet.cssRules].forEach((rule) => {
          if (rule.selectorText?.includes(cls)) {
            newStyles += rule.cssText.replace(cls, newClass) + "\n";
          }
        });
      });
    });

    // Добавляем новые стили в документ
    const style = document.createElement("style");
    style.innerHTML = newStyles;
    document.head.appendChild(style);
  }
}

window.onload = updateClasses;
