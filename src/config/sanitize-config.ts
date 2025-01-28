export const ALLOWED_TAGS = ["livecodeblock", "iframe"];

export const ALLOWED_ATTRIBUTES = [
  // YouTube iframe attributes
  "allowfullscreen",
  "frameborder",
  "src",
  "width",
  "height",
  "autoplay",
  "disablekbcontrols",
  "enableiframeapi",
  "endtime",
  "ivloadpolicy",
  "loop",
  "modestbranding",
  "origin",
  "playlist",
  "start",
  // Custom data attributes
  "data-youtube-video",
  "data-is-widget", // for live-code-block
  "data-id", // for live-code-block
  "data-files", // for live-code-block
  "data-template", // for live-code-block
  "data-language", // for live-code-block
];

export const sanitizeConfig = {
  ADD_TAGS: ALLOWED_TAGS,
  ADD_ATTR: ALLOWED_ATTRIBUTES,
};
