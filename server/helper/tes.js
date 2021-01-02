const qrcode = require("qrcode");

qrcode.toDataURL(
  "otpauth://totp/Project%202fa?secret=FA3HKYTWHBLFUSBWNVJVG2KFO55W42JDJB6VUOBXPFJVG6D2IZUQ",
  (err, data) => {
    console.log(data);
  }
);
