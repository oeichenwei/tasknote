import { Extension } from "@tiptap/core";
import { PluginKey } from "prosemirror-state";
import ReactDOM from "react-dom";
import rootStyles from "../../root.module.css";
import { createBubbleMenuPlugin } from "./BubbleMenuPlugin";
import { BubbleMenu } from "./component/BubbleMenu";

/**
 * The menu that is displayed when selecting a piece of text.
 */
export const BubbleMenuExtension = Extension.create<{}>({
  name: "BubbleMenuExtension",

  addProseMirrorPlugins() {
    const element = document.createElement("div");
    element.className = rootStyles.bnRoot;
    ReactDOM.render(<BubbleMenu editor={this.editor} />, element);
    return [
      createBubbleMenuPlugin({
        editor: this.editor,
        element,
        pluginKey: new PluginKey("BubbleMenuPlugin"),
        tippyOptions: {
          appendTo: document.body,
        },
      }),
    ];
  },
});
