import FastAverageColor from 'fast-average-color';
const fac = new FastAverageColor();

/**
 * Sets the body style to the given values
 * @param {*} r red value 
 * @param {*} g green value
 * @param {*} b blue value
 * @param {*} alpha alpha value
 */
function setBodyStyle(r, g, b, alpha) {
  const body = document.getElementsByTagName('body')[0];

  body.style.setProperty('--secondary-color', `rgba(${r},${g},${b}, ${alpha[0]})`);
  body.style.setProperty('--light-secondary', `rgba(${r},${g},${b},${alpha[1]})`);
  // body.style.setProperty('--very-light-secondary', `rgba(${r},${g},${b},${alpha[2]})`);
  body.style.setProperty('--secondary-r', `${r}`);
  body.style.setProperty('--secondary-g', `${g}`);
  body.style.setProperty('--secondary-b', `${b}`);
}

/**
 * Gets the album art and sets the contrasting colors
 */
export function updateContrastingColors() {
  let imgAlbumArt = document.getElementById('album-art');
  setContrastingColors(imgAlbumArt.src);
}

/**
 * Sets the style based on the average color of the album art image
 * @param {string} albumArt The image source link
 */
export function setContrastingColors(albumArt) {
  fac.getColorAsync(albumArt)
    .then(color => {
      const { value } = color;
      const r = value[0], g = value[1], b = value[2];
      const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b;
      const bodyClassName = document.getElementsByTagName('body').className;
      if (bodyClassName !== 'light-theme' && luma > 225) {
        setBodyStyle(30, 30, 30, [1, .2, .1]);
      } else if (bodyClassName === 'light-theme' && luma < 90) {
        setBodyStyle(247, 247, 247, [1, 8, .7]);
      } else {
        setBodyStyle(r, g, b, [1, .3, .15]);
      }
    });
}
