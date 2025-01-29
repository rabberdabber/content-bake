import { JSONContent } from "@tiptap/react";

export const demoContent: JSONContent = {
  type: "doc",
  content: [
    {
      type: "heading",
      attrs: { textAlign: "left", level: 1 },
      content: [{ type: "text", text: "Welcome to Content Bake" }],
    },
    {
      type: "paragraph",
      attrs: { textAlign: "left" },
      content: [
        {
          type: "text",
          text: "This is a demo to help you explore the features of our editor.",
        },
      ],
    },
    {
      type: "heading",
      attrs: { textAlign: "left", level: 2 },
      content: [{ type: "text", text: "Introducing the Editor" }],
    },
    {
      type: "paragraph",
      attrs: { textAlign: "left" },
      content: [
        {
          type: "text",
          text: "Our editor offers three modes to suit your workflow:",
        },
      ],
    },
    {
      type: "orderedList",
      attrs: { start: 1 },
      content: [
        {
          type: "listItem",
          attrs: { color: "" },
          content: [
            {
              type: "paragraph",
              attrs: { textAlign: "left" },
              content: [
                { type: "text", marks: [{ type: "bold" }], text: "Edit Mode" },
                {
                  type: "text",
                  text: " – Focus on creating and editing your content.",
                },
              ],
            },
          ],
        },
        {
          type: "listItem",
          attrs: { color: "" },
          content: [
            {
              type: "paragraph",
              attrs: { textAlign: "left" },
              content: [
                {
                  type: "text",
                  marks: [{ type: "bold" }],
                  text: "Preview Mode",
                },
                {
                  type: "text",
                  text: " – See how your content will look to readers in real-time.",
                },
              ],
            },
          ],
        },
        {
          type: "listItem",
          attrs: { color: "" },
          content: [
            {
              type: "paragraph",
              attrs: { textAlign: "left" },
              content: [
                {
                  type: "text",
                  marks: [{ type: "bold" }],
                  text: "Split-Pane Mode",
                },
                {
                  type: "text",
                  text: " – Work smarter by editing on one side and previewing on the other.",
                },
              ],
            },
          ],
        },
        {
          type: "listItem",
          attrs: { color: "" },
          content: [
            {
              type: "paragraph",
              attrs: { textAlign: "left" },
              content: [
                {
                  type: "text",
                  marks: [{ type: "bold" }],
                  text: "Slash command",
                },
                { type: "text", text: " for suggestions" },
              ],
            },
          ],
        },
        {
          type: "listItem",
          attrs: { color: "" },
          content: [
            {
              type: "paragraph",
              attrs: { textAlign: "left" },
              content: [
                {
                  type: "text",
                  marks: [{ type: "bold" }],
                  text: "Bubble Menu",
                },
                { type: "text", text: " by selecting the text" },
              ],
            },
          ],
        },
      ],
    },
    {
      type: "paragraph",
      attrs: { textAlign: "left" },
      content: [
        { type: "hardBreak" },
        {
          type: "text",
          text: "You can create rich, interactive content with the following elements:",
        },
      ],
    },
    {
      type: "bulletList",
      content: [
        {
          type: "listItem",
          attrs: { color: "" },
          content: [
            {
              type: "paragraph",
              attrs: { textAlign: "left" },
              content: [
                { type: "text", text: "Headings to structure your content" },
              ],
            },
          ],
        },
        {
          type: "listItem",
          attrs: { color: "" },
          content: [
            {
              type: "paragraph",
              attrs: { textAlign: "left" },
              content: [
                { type: "text", text: "Bullet and numbered lists for clarity" },
              ],
            },
          ],
        },
        {
          type: "listItem",
          attrs: { color: "" },
          content: [
            {
              type: "paragraph",
              attrs: { textAlign: "left" },
              content: [
                {
                  type: "text",
                  text: "Code blocks and Code Sandbox for developers",
                },
              ],
            },
          ],
        },
        {
          type: "listItem",
          attrs: { color: "" },
          content: [
            {
              type: "paragraph",
              attrs: { textAlign: "left" },
              content: [
                {
                  type: "text",
                  text: "Embedded media like images and videos, youtube",
                },
              ],
            },
          ],
        },
      ],
    },
    {
      type: "paragraph",
      attrs: { textAlign: "left" },
      content: [{ type: "text", text: "Here's an example of a code block:" }],
    },
    {
      type: "codeBlock",
      attrs: { language: "python" },
      content: [
        {
          type: "text",
          text: 'def welcome_to_my_platform(name: str):\n\treturn f"Welcome ${name}"',
        },
      ],
    },
    {
      type: "paragraph",
      attrs: { textAlign: "left" },
      content: [{ type: "text", text: "you can also add images" }],
    },
    {
      type: "imageBlock",
      attrs: {
        src: "/demo/image_1.jpeg",
        width: "100%",
        align: "center",
      },
    },
    {
      type: "paragraph",
      attrs: { textAlign: "left" },
      content: [{ type: "text", text: "and even embed videos." }],
    },
    {
      type: "video",
      attrs: {
        src: "/demo/video_1.mp4",
      },
    },
    {
      type: "paragraph",
      attrs: { textAlign: "left" },
      content: [{ type: "text", text: "and also table" }],
    },
    {
      type: "table",
      content: [
        {
          type: "tableRow",
          content: [
            {
              type: "tableCell",
              attrs: { colspan: 1, rowspan: 1, colwidth: null, style: null },
              content: [
                {
                  type: "paragraph",
                  attrs: { textAlign: "left" },
                  content: [{ type: "text", text: "name" }],
                },
              ],
            },
            {
              type: "tableCell",
              attrs: { colspan: 1, rowspan: 1, colwidth: null, style: null },
              content: [
                {
                  type: "paragraph",
                  attrs: { textAlign: "left" },
                  content: [{ type: "text", text: "age" }],
                },
              ],
            },
            {
              type: "tableCell",
              attrs: { colspan: 1, rowspan: 1, colwidth: null, style: null },
              content: [
                {
                  type: "paragraph",
                  attrs: { textAlign: "left" },
                  content: [{ type: "text", text: "height(cm)" }],
                },
              ],
            },
          ],
        },
        {
          type: "tableRow",
          content: [
            {
              type: "tableCell",
              attrs: { colspan: 1, rowspan: 1, colwidth: null, style: null },
              content: [
                {
                  type: "paragraph",
                  attrs: { textAlign: "left" },
                  content: [{ type: "text", text: "Bereket" }],
                },
              ],
            },
            {
              type: "tableCell",
              attrs: { colspan: 1, rowspan: 1, colwidth: null, style: null },
              content: [
                {
                  type: "paragraph",
                  attrs: { textAlign: "left" },
                  content: [{ type: "text", text: "27" }],
                },
              ],
            },
            {
              type: "tableCell",
              attrs: { colspan: 1, rowspan: 1, colwidth: null, style: null },
              content: [
                {
                  type: "paragraph",
                  attrs: { textAlign: "left" },
                  content: [{ type: "text", text: "183" }],
                },
              ],
            },
          ],
        },
        {
          type: "tableRow",
          content: [
            {
              type: "tableCell",
              attrs: { colspan: 1, rowspan: 1, colwidth: null, style: null },
              content: [
                {
                  type: "paragraph",
                  attrs: { textAlign: "left" },
                  content: [{ type: "text", text: "Rabberdabber" }],
                },
              ],
            },
            {
              type: "tableCell",
              attrs: { colspan: 1, rowspan: 1, colwidth: null, style: null },
              content: [
                {
                  type: "paragraph",
                  attrs: { textAlign: "left" },
                  content: [{ type: "text", text: "29" }],
                },
              ],
            },
            {
              type: "tableCell",
              attrs: { colspan: 1, rowspan: 1, colwidth: null, style: null },
              content: [
                {
                  type: "paragraph",
                  attrs: { textAlign: "left" },
                  content: [{ type: "text", text: "190" }],
                },
              ],
            },
          ],
        },
      ],
    },
    {
      type: "paragraph",
      attrs: { textAlign: "left" },
      content: [
        { type: "text", text: "Let's explore the cream on top: AI features!" },
      ],
    },
    {
      type: "orderedList",
      attrs: { start: 1 },
      content: [
        {
          type: "listItem",
          attrs: { color: "" },
          content: [
            {
              type: "paragraph",
              attrs: { textAlign: "left" },
              content: [
                {
                  type: "text",
                  text: "Create drafts with OpenAI – generate structured and creative responses in few seconds",
                },
              ],
            },
          ],
        },
        {
          type: "listItem",
          attrs: { color: "" },
          content: [
            {
              type: "paragraph",
              attrs: { textAlign: "left" },
              content: [
                {
                  type: "text",
                  text: "Generate stunning images with Flux – bring your ideas to life with AI-powered visuals.",
                },
              ],
            },
          ],
        },
        {
          type: "listItem",
          attrs: { color: "" },
          content: [
            {
              type: "paragraph",
              attrs: { textAlign: "left" },
              content: [
                {
                  type: "text",
                  text: "Stay tuned for more – we’re always adding new features to supercharge your creativity!",
                },
              ],
            },
          ],
        },
      ],
    },
    {
      type: "paragraph",
      attrs: { textAlign: "left" },
      content: [{ type: "text", text: "The below is 100% AI generated image" }],
    },
    {
      type: "imageBlock",
      attrs: {
        src: "/demo/image_2.jpeg",
        width: "100%",
        align: "center",
      },
    },
    {
      type: "paragraph",
      attrs: { textAlign: "left" },
      content: [
        { type: "text", text: "try it out by typing " },
        { type: "text", marks: [{ type: "code" }], text: "/" },
        { type: "text", text: " " },
      ],
    },
  ],
};
