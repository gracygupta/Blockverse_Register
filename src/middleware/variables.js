const expireTime = 1000 * 60 * 60;

const booleanCreate = (req, res, next) => {
  try {
    console.log("inside variables");
    const boolean = { signin_status: "true", payment_status: "false" };
    console.log(boolean);
    res.cookie("variables", boolean, {
      expires: new Date(Date.now() + expireTime),
      httpOnly: true,
      secure: false,
      overwrite: true,
    });
  } catch (e) {
    console.log(e);
    res.send("Error");
  }
};

module.exports = { booleanCreate };
