export default {
    transform: {
      "^.+\\.[t|j]sx?$": "babel-jest",  // Transforme tous les fichiers .js, .jsx, .ts, .tsx avec babel-jest
    },
    testEnvironment: "node",
  };
  