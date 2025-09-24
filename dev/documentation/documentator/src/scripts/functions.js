window.find_documentation_section = function(txt, setFocus = true) {
  const allTitles = Array.from(document.querySelectorAll("h3"));
  for(let index=0; index<allTitles.length; index++) {
    const title = allTitles[index];
    const isMatch = txt.trim() === title.textContent.trim();
    if(isMatch) {
      console.log("MATCH!");
      console.log(title);
      title.scrollIntoView({ behavior: "smooth", block: "start" });
      return true;
    }
  }
  return null;
}

window.inject_button_to_top = function() {
  const divElement = document.createElement("div");
  divElement.textContent = "📖";
  divElement.className = "topbutton";
  divElement.addEventListener("click", function() {
    document.body.scrollIntoView({ behavior: "smooth", block: "start" });
  });
  document.body.appendChild(divElement);
  const linkElement = document.createElement("style");
  linkElement.textContent = `

.topbutton {
  position: fixed;
  top: auto;
  bottom: 8px;
  left: auto;
  right: 8px;
  background-color: black;
  color: white;
  border: 1px solid blue;
  padding: 4px;
  cursor: pointer;
}

  `;
  document.head.appendChild(linkElement);
}

window.addEventListener("load", function() {
  window.inject_button_to_top();
});