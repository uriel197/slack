const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: path.join(__dirname, "src", "public", "components", "main.js"),
  output: {
    path: path.join(__dirname, "dist"),
    publicPath: "/",
    filename: "bundle.js", // Fixed the typo here
  },
  mode: "production", // Set mode to production for optimization
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, "src", "views", "index.html"),
    }),
  ],
};

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
*/
