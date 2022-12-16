var GoogleStrategy = require("passport-google-oauth2").Strategy;
// const passport = require("passport");
// const Student = require("../model/student");
require("dotenv").config();

const jwtStrategy = require("passport-jwt").Strategy;
const { ExtractJwt } = require("passport-jwt");

const clientID = process.env.clientID;
const clientSecret = process.env.clientSecret;
const url = process.env.URL;

// passport.serializeUser((user, done) => {
//   done(null, user);
// });
// passport.deserializeUser(function (user, done) {
//   done(null, user);
// });

// passport.use(
//   new GoogleStrategy(
//     {
//       clientID: clientID,
//       clientSecret: clientSecret,
//       callbackURL: url,
//       passReqToCallback: true,
//     },
//     async function (request, accessToken, refreshToken, profile, done) {
//       var user = profile;
//       console.log("user: ", user);
//       console.log("profile: ", profile);
//       return done(null, profile);
//     }
//   )
// );

module.exports = (passport) => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: clientID,
        clientSecret: clientSecret,
        callbackURL: url,
        passReqToCallback: true,
      },
      async (request, accessToken, refreshToken, profile, done) => {
        try {
          // request.user = profile;
          // console.log(request.user);
          const user = profile;
          return done(null, user);
        } catch (e) {
          console.log(e);
          return done(error, false);
        }
      }
    )
  ),
    passport.use(
      new jwtStrategy(
        {
          jwtFromRequest: ExtractJwt.fromHeader("authorization"),
          secretOrKey: "secretKey",
        },
        async (jwtPayload, done) => {
          try {
            // Extract user
            const user = jwtPayload.user;
            console.log(user);
            done(null, user);
          } catch (error) {
            done(error, false);
          }
        }
      )
    );
};
