export const ALLOWED_TAGS = ["live-code-block", "iframe"];

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
];

export const sanitizeConfig = {
  ADD_TAGS: ALLOWED_TAGS,
  ADD_ATTR: ALLOWED_ATTRIBUTES,
};
