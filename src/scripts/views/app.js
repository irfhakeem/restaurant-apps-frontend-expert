export default class App {
  constructor({ mainContent }) {
    this._mainContent = mainContent;
  }

  async renderPage() {
    const url = window.location.hash.slice(1).toLowerCase() || "/";
    const urlsSplits = url.split("/");
    const resource = `/${urlsSplits[1] || ""}`;
    const id = urlsSplits[2] || null;

    console.log("URL:", url, "Resource:", resource, "ID:", id);

    const { page } = await import(`../routes/routes.js`);
    const renderFunction = page[resource];

    if (renderFunction) {
      const content = await renderFunction(id);
      this._mainContent.innerHTML = content;
    } else {
      this._mainContent.innerHTML = page["/404"]();
    }
  }
}
