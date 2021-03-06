function includeHTML() {
  const elements = document.getElementsByTagName("*");

  //for (const element of document.getElementsByTagName("*")) {
  for (let index = 0; index < elements.length; index++) {
    const element = elements[index];
    const file = element.getAttribute("include-html");

    if (file) {
      const http = new XMLHttpRequest();

      http.onreadystatechange = function () {
        if (this.readyState == 4) {
          if (this.status == 200) {
            let innerHTML = this.responseText;

            for (let index = 0; index < element.attributes.length; index++) {
              const attribute = element.attributes.item(index);
              const matches = attribute.name.match(/^\[(.*)\]$/);

              if (matches !== null) {
                const attributeName = matches[1];
                const expression = new RegExp('{{' + attributeName + '}}', 'g');

                innerHTML = innerHTML.replace(expression, attribute.value);
              }
            }

            element.innerHTML = innerHTML;
          }

          if (this.status == 404) { element.innerHTML = "Page not found."; }

          element.removeAttribute("include-html");

          includeHTML();
        }
      }

      http.open("GET", file, true);
      http.send();

      return;
    }
  }
}
