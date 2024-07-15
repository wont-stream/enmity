import { Plugin, registerPlugin } from "enmity/managers/plugins";
import { create } from "enmity/patcher";
import { Messages } from "enmity/metro/common";
import { get } from "enmity/api/settings";
import manifest from "../manifest.json";

get("GrammarNazi", "customText", "");
const Patcher = create("GrammarNazi");
const GrammarNazi: Plugin = {
  ...manifest,

  async onStart() {
    const dictionary = await (
      await fetch("https://wont-stream.github.io/dictionary/index.min.json")
    ).json();

    const re = new RegExp(
      `(^|(?<=[^A-Z0-9]+))(${Object.keys(dictionary)
        .map((k) => k.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
        .join("|")})((?=[^A-Z0-9]+)|$)`,
      "gi"
    );

    Patcher.before(Messages, "sendMessage", (self, args, orig) => {
      args[1]["content"] = args[1]["content"].trim();
      if (
        !args[1]["content"].includes("```") &&
        /\w/.test(args[1]["content"].charAt(0))
      ) {
        if (re !== null) {
          args[1]["content"] = args[1]["content"].replace(re, (match) => {
            return dictionary[match.toLowerCase()] || match;
          });
        }

        if (
          /[A-Z0-9]/i.test(
            args[1]["content"].charAt(args[1]["content"].length - 1)
          )
        ) {
          if (
            !args[1]["content"].startsWith(
              "http",
              args[1]["content"].lastIndexOf(" ") + 1
            )
          )
            args[1]["content"] += ".";
        }

        // Ensure sentences are capitalized after punctuation
        args[1]["content"] = args[1]["content"].replace(
          /([.!?])\s*(\w)/g,
          (match) => match.toUpperCase()
        );

        // Ensure the first character of the entire message is capitalized
        if (!args[1]["content"].startsWith("http")) {
          args[1]["content"] =
            args[1]["content"].charAt(0).toUpperCase() +
            args[1]["content"].slice(1);
        }
      }
    });
  },
  onStop() {
    Patcher.unpatchAll();
  },
};
registerPlugin(GrammarNazi);
