var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// main.ts
var main_exports = {};
__export(main_exports, {
  default: () => AlwaysNewTabPlugin
});
module.exports = __toCommonJS(main_exports);
var import_obsidian = require("obsidian");
var AlwaysNewTabPlugin = class extends import_obsidian.Plugin {
  async onload() {
    console.log("Loading Always New Tab plugin");
    this.registerMonkeyPatches();
  }
  onunload() {
    console.log("Unloading Always New Tab plugin");
    if (this.originalOpenFile) {
      import_obsidian.WorkspaceLeaf.prototype.openFile = this.originalOpenFile;
    }
    if (this.originalOpenLinkText) {
      import_obsidian.Workspace.prototype.openLinkText = this.originalOpenLinkText;
    }
  }
  registerMonkeyPatches() {
    const plugin = this;
    this.originalOpenFile = import_obsidian.WorkspaceLeaf.prototype.openFile;
    import_obsidian.WorkspaceLeaf.prototype.openFile = async function(file, openState) {
      const leaf = this;
      const viewType = leaf.view.getViewType();
      if (viewType !== "empty") {
        const newLeaf = plugin.app.workspace.getLeaf("tab");
        return plugin.originalOpenFile.call(newLeaf, file, openState);
      }
      return plugin.originalOpenFile.call(this, file, openState);
    };
    this.originalOpenLinkText = import_obsidian.Workspace.prototype.openLinkText;
    import_obsidian.Workspace.prototype.openLinkText = async function(linktext, sourcePath, newLeaf, openViewState) {
      if (!newLeaf) {
        newLeaf = true;
      }
      return plugin.originalOpenLinkText.call(this, linktext, sourcePath, newLeaf, openViewState);
    };
  }
};