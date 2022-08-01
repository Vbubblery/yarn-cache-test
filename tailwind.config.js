const customTheme = require("./src/assets/styles/tailwind/theme.js");

module.exports = {
  content: ["./src/**/*.{vue,ts,js}"],
  future: {
    removeDeprecatedGapUtilities: true,
    purgeLayersByDefault: true
  },
  theme: {
    extend: {
      fontFamily: {
        body: ["Titillium", "sans-serif"]
      },
      gridTemplateRows: {
        // Simple 8 row grid
        10: "repeat(10, minmax(0, 1fr))"
      },
      gridTemplateColumns: {
        24: "repeat(24, minmax(0, 1fr))"
      },
      gridColumn: {
        "span-13": "span 13 / span 13",
        "span-14": "span 14 / span 14",
        "span-15": "span 15 / span 15",
        "span-16": "span 16 / span 16",
        "span-17": "span 17 / span 17",
        "span-18": "span 18 / span 18",
        "span-19": "span 19 / span 19",
        "span-20": "span 20 / span 20",
        "span-21": "span 21 / span 21",
        "span-22": "span 22 / span 22",
        "span-23": "span 23 / span 23",
        "span-24": "span 24 / span 24"
      },
      gridRow: {
        "span-7": "span 7 / span 7",
        "span-8": "span 8 / span 8",
        "span-9": "span 9 / span 9",
        "span-10": "span 10 / span 10"
      },
      ...customTheme
    },
    inset: {
      0: 0,
      auto: "auto",
      4: "1rem"
    }
  },
  // #TODO: To remove before merge into preprod
  // variants: {
  //   opacity: ["disabled"],
  //   cursor: ["disabled"],
  //   display: ["responsive", "hover", "focus", "group-hover"],
  //   extend: {
  //     opacity: ["disabled"]
  //   },
  //   borderWidth: ["hover", "focus", "active"],
  //   borderColor: ["hover", "focus", "active", "focus-within"],
  //   textColor: ["group-hover"]
  // },
  plugins: []
};
