const { src, dest } = require('gulp');
const rename = require('gulp-rename');

function copyIcons() {
  return src('nodes/**/*.svg')
    .pipe(rename((path) => {
      // Flatten the directory structure
      path.dirname = path.dirname.replace(/^nodes\//, 'nodes/');
    }))
    .pipe(dest('dist/'));
}

exports['build:icons'] = copyIcons;
