var __defProp = Object.defineProperty;
var __markAsModule = (target) => __defProp(target, "__esModule", { value: true });
var __export = (target, all) => {
  __markAsModule(target);
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
__export(exports, {
  Wiki: () => Wiki
});
const axios = require("axios").default;
const Wiki = {
  name: "wiki",
  description: "\u641C\u5C0B War Thunder Wiki \u4E0A\u6A19\u984C\u5305\u542B query \u9801\u9762",
  run: async (client, interaction) => {
    const query = interaction.options.getString("query");
    const limit = interaction.options.getInteger("limit") ?? 3;
    const query_result = await axios.get("https://wiki.warthunder.com/api.php", {
      params: {
        action: "query",
        prop: "info",
        generator: "search",
        format: "json",
        utf8: "1",
        inprop: "url",
        gsrsearch: query,
        gsrlimit: limit
      }
    });
    const pages = Object.values(query_result.data.query.pages);
    const urls = pages.sort(Page.compare).map((page) => page.fullurl);
    interaction.reply(urls[0]);
  }
};
class Page {
  constructor(pageid, ns, title, index, contentmodel, pagelanguage, pagelanguagehtmlcode, pagelanguagedir, touched, lastrevid, length, fullurl, editurl, canonicalurl) {
    this.pageid = pageid;
    this.ns = ns;
    this.title = title;
    this.index = index;
    this.contentmodel = contentmodel;
    this.pagelanguage = pagelanguage;
    this.pagelanguagehtmlcode = pagelanguagehtmlcode;
    this.pagelanguagedir = pagelanguagedir;
    this.touched = touched;
    this.lastrevid = lastrevid;
    this.length = length;
    this.fullurl = fullurl;
    this.editurl = editurl;
    this.canonicalurl = canonicalurl;
  }
  static compare(a, b) {
    return a.index - b.index;
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Wiki
});
//# sourceMappingURL=wiki.js.map
