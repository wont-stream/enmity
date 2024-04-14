import { Plugin, registerPlugin } from "enmity/managers/plugins";
import {
  ApplicationCommandInputType,
  ApplicationCommandOptionType,
  ApplicationCommandType,
  Command,
} from "enmity/api/commands";
import { Image } from "enmity/components";
import { create } from "enmity/patcher";
import manifest from "../manifest.json";
import { sendReply } from "enmity/api/clyde";

const status_code = [
  "100",
  "101",
  "102",
  "103",
  "200",
  "201",
  "202",
  "203",
  "204",
  "205",
  "206",
  "207",
  "208",
  "214",
  "226",
  "300",
  "301",
  "302",
  "303",
  "304",
  "305",
  "307",
  "308",
  "400",
  "401",
  "402",
  "403",
  "404",
  "405",
  "406",
  "407",
  "408",
  "409",
  "410",
  "411",
  "412",
  "413",
  "414",
  "415",
  "416",
  "417",
  "418",
  "420",
  "421",
  "422",
  "423",
  "424",
  "425",
  "426",
  "428",
  "429",
  "431",
  "444",
  "450",
  "451",
  "497",
  "498",
  "499",
  "500",
  "501",
  "502",
  "503",
  "504",
  "506",
  "507",
  "508",
  "509",
  "510",
  "511",
  "521",
  "522",
  "523",
  "525",
  "530",
  "599",
];

const Patcher = create("HTTPCatPlugin");
const HTTPCatPlugin: Plugin = {
  ...manifest,
  name: "HTTPCat",
  commands: [],

  onStart() {
    const command: Command = {
      id: "HTTPCat-command",

      name: "cat",
      displayName: "cat",

      description: "Sends the cat image for an http status code.",
      displayDescription: "Sends the cat image for an http status code.",

      type: ApplicationCommandType.Chat,
      inputType: ApplicationCommandInputType.BuiltInText,

      options: [
        {
          name: "code",
          displayName: "code",

          description: "HTTP Status Code",
          displayDescription: "HTTP Status Code",

          type: ApplicationCommandOptionType.String,
          required: true,
          choices: status_code.map((x) => ({
            name: x,
            displayName: x,
            value: x,
          })),
        },
        {
          name: "quiet",
          displayName: "quiet",

          description: "Quietly send the image so only yourself can see it.",
          displayDescription:
            "Quietly send the image so only yourself can see it.",

          type: ApplicationCommandOptionType.Boolean,
          required: false,
        },
      ],

      execute: async function (args, message) {
        const statusCode = args[0].value;
        const url = `https://http.cat/${statusCode}`;
        if (args[1]?.value ?? true) {
          const embed = {
            type: "rich",
            title: `HTTP ${statusCode} Cat Image`,
            image: {
              proxy_url: `https://external-content.duckduckgo.com/iu/?u=${url}`,
              url: url,
              width: 750,
              height: 600,
            },
            footer: {
              text: "http.cat",
            },
          };
          const component = {
            type: 1,
            components: [
              {
                type: 2,
                style: 5,
                label: "View image",
                url: url,
              },
            ],
          };
          sendReply(
            message?.channel.id ?? "0",
            {
              embeds: [embed],
              components: [component],
            },
            "HTTP Cats",
            "https://github.com/httpcats.png"
          );
        } else {
          return {
            content: url,
          };
        }
      },
    };

    this.commands.push(command);
  },

  onStop() {
    Patcher.unpatchAll();
    this.commands = [];
  },
};

registerPlugin(HTTPCatPlugin);
