export const mentionsStyles = {
  control: {
    minHeight: 44,
    border: "none",
    outline: "none",
    background: "transparent",
    width: "100%",
  },
  "&multiLine": {
    highlighter: {
      padding: "12px 20px",
      fontSize: 14,
      lineHeight: 1.6,
      maxHeight: 180,
      overflow: "hidden",
    },
    input: {
      padding: "12px 20px",
      outline: "none",
      fontSize: 14,
      lineHeight: 1.6,
      minHeight: 44,
      maxHeight: 180,
      overflowY: "auto",
      resize: "none",
      boxSizing: "border-box",
    },
  },
  "&singleLine": {
    highlighter: {
      padding: "12px 20px",
      fontSize: 14,
      lineHeight: 1.6,
    },
    input: {
      padding: "12px 20px",
      outline: "none",
      fontSize: 14,
      lineHeight: 1.6,
    },
  },
} as const;