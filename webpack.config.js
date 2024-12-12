const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  entry: path.join(__dirname, "src", "public", "components", "main.js"),
  output: {
    path: path.join(__dirname, "dist"),
    publicPath: "/",
    filename: "bundle.js",
  },
  mode: "production", // Optimization for production builds
  module: {
    rules: [
      {
        test: /\.css$/i, // Match CSS files
        use: [MiniCssExtractPlugin.loader, "css-loader"], // Extract CSS and process it
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, "src", "views", "main.html"),
      filename: "main.html",
    }),
    new MiniCssExtractPlugin({
      filename: "main.css", // Output CSS file
    }),
  ],
};

// const path = require("path");
// const HtmlWebpackPlugin = require("html-webpack-plugin");

// module.exports = {
//   entry: path.join(__dirname, "src", "public", "components", "main.js"),
//   output: {
//     path: path.join(__dirname, "dist"),
//     publicPath: "/",
//     filename: "bundle.js", // Fixed the typo here
//   },
//   mode: "production", // Set mode to production for optimization
//   plugins: [
//     new HtmlWebpackPlugin({
//       template: path.join(__dirname, "src", "views", "index.html"),
//     }),
//   ],
// };

/*
     -----------------------------------------------
              COMMENTS- COMMENTS- COMMENTS
     -----------------------------------------------

Webpack:

In web development, a bundler is a tool that packages multiple files and assets of your application (JavaScript, CSS, HTML, images, etc.) into fewer files or even a single file. This helps optimize web applications for faster loading and better performance by reducing the number of requests a browser needs to make to a server.

Key Functions of a Bundler:
Combining Files:
Combines multiple files into fewer files to reduce HTTP requests.
Example: Bundling many JavaScript files into one.

Dependency Management:
Analyzes the dependencies of your files (e.g., import or require statements) and ensures they are loaded in the correct order.

Minification:
Removes unnecessary characters (like whitespace and comments) to reduce file size.

Code Splitting:
Splits the code into smaller chunks that are loaded only when needed, improving initial load times.

Transpilation:
Converts modern JavaScript (ES6+ or TypeScript) into older versions that are compatible with older browsers.

Asset Management:
Processes and optimizes other assets like images, fonts, and CSS files.
Popular Bundlers in Web Development:

Webpack:
One of the most popular and powerful bundlers.
Allows custom configuration through plugins and loaders.

Parcel:
A simpler, zero-configuration bundler suitable for smaller projects.

Rollup:
Focused on smaller, library-focused projects.
Great for creating optimized libraries or modules.

Vite:
A modern bundler that leverages ES modules and focuses on development speed.

Esbuild:
Extremely fast bundler written in Go, used for performance-critical tasks.
In modern web development, bundlers are essential for preparing applications for deployment, ensuring they are fast and optimized for end-users.

    WHICH FILES RUN FIRST:
    ======================
Here's a detailed breakdown of how the flow works from start to end when you run your application using npm start, along with where Webpack fits in:

1. npm start Execution:
Your package.json specifies:

"scripts": {
  "start": "node server.js"
}
This command runs server.js using Node.js.

2. server.js Execution:
server.js is the entry point for the backend. It:
Sets up the server (e.g., Express).
Imports and uses app.js to define routes and middleware.
Listens for incoming requests, such as API calls or static file requests.

3. app.js Execution:
app.js contains middleware, routes, and other logic.
It doesn't run in parallel to server.js; instead, it is executed as part of server.js when it's imported and invoked.
The server uses it to handle incoming requests (e.g., /api/v1/channels).

4. Where Webpack Comes In:
Webpack is not automatically run by npm start.
Webpack is a build tool that processes your frontend files (JavaScript, CSS, HTML) and generates a production-ready bundle. This is usually done before deploying the server or before running the application if you're in development.
Webpack Build Process:
When you run Webpack (via webpack or a script in package.json like npm run build):

Webpack starts from the entry file specified in webpack.config.js:

entry: path.join(__dirname, "src", "public", "components", "main.js")

This is your frontend's starting point.
Webpack follows all import/require statements to bundle the entire dependency graph into bundle.js.
It outputs:
A JavaScript bundle (bundle.js) in the dist directory.
A processed CSS file (main.css).
A generated HTML file (based on index.html).
The output files (bundle.js, main.css) are then served as static assets by your backend.

Summary of File Execution:
Backend Execution (when npm start runs):

server.js runs first.
It imports and uses app.js.
Frontend Build (Webpack):

Webpack processes your frontend files (main.js), but only when you run Webpack (e.g., npm run build or npx webpack).
Webpack's output (bundle.js, main.css) is served by server.js.
Complete Flow:

You typically run Webpack first to build the frontend.
Then, start the backend with npm start, which serves the static assets generated by Webpack.
*/
