const colors = {
  indigo: [
    "#ebf4ff",
    "#c3dafe",
    "#a3bffa",
    "#7f9cf5",
    "#667eea",
    "#5a67d8",
    "#4c51bf",
    "#434190",
    "#3c366b"
  ],
  green: [
    "#f0fff4",
    "#c6f6d5",
    "#9ae6b4",
    "#68d391",
    "#48bb78",
    "#38a169",
    "#2f855a",
    "#276749",
    "#22543d"
  ],
  orange: [
    "#fffaf0",
    "#feebc8",
    "#fbd38d",
    "#f6ad55",
    "#ed8936",
    "#dd6b20",
    "#c05621",
    "#9c4221",
    "#7b341e"
  ],
  pink: [
    "#fff5f7",
    "#fed7e2",
    "#fbb6ce",
    "#f687b3",
    "#ed64a6",
    "#d53f8c",
    "#b83280",
    "#97266d",
    "#702459"
  ],
  blue: [
    "#ebf8ff",
    "#bee3f8",
    "#90cdf4",
    "#63b3ed",
    "#4299e1",
    "#3182ce",
    "#2b6cb0",
    "#2c5282",
    "#2a4365"
  ],
  teal: [
    "#e6fffa",
    "#b2f5ea",
    "#81e6d9",
    "#4fd1c5",
    "#38b2ac",
    "#319795",
    "#2c7a7b",
    "#285e61",
    "#234e52"
  ],
  red: [
    "#fff5f5",
    "#fed7d7",
    "#feb2b2",
    "#fc8181",
    "#f56565",
    "#e53e3e",
    "#c53030",
    "#9b2c2c",
    "#742a2a"
  ]
};

const homeInventoryChartColors = [
  "rgba(13,152,240,0.2)",
  "rgba(0,0,255,0.2)",
  "rgba(176,196,222,0.2)",
  "rgba(176,224,230,0.2)",
  "rgba(173,216,230,0.2)",
  "rgba(135,206,235,0.2)",
  "rgba(135,206,250,0.2)",
  "rgba(0,191,255,0.2)"
];

export default {
  homeInventoryChartColors(index) {
    return homeInventoryChartColors[index % homeInventoryChartColors.length];
  },
  dataChartColors(index, shade = 3) {
    const colorName = Object.keys(colors)[index % Object.keys(colors).length];
    return colors[colorName][shade];
  }
};
