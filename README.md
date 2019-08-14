# Payutc-mobile
PayUTC mobile Application 

## Specifications

Specifications are defined in `SPECIFICATIONS.md`

## Installation

- Install expo-cli with the following command: `npm install -g expo-cli`
- Installer JS dependecies: `npm i`

## Application run

- Run expo for Android: `npm run android`
- Run expo for iOS: `npm run ios`

## Application build
### iOS
iOS build requires Xcode. In order to use Xcode, you should update your pods using theses commands:
- `cd ios`
- `pod install`

And then, open `PayUTC.xcworkspace` in Xcode and build the app.

## Develop
 
- We use the workflow `gitflow` as described [here](https://nvie.com/files/Git-branching-model.pdf) but without the `release` branch. It means:
    * All Pull Requests (PR) are merged into the branch `develop`.
    * From `develop` we release versions on `master`.
    * The branches are named as following:
      * `feature/<issue shortname>` for enhancements.
      * `fix/<issue shortname>` for bug fixes.
      * `hot/<issue shortname>` for hot bug fixes (Ex: bug affecting security on production).
- Respect the JS linter.
- Before pushing your code run `npm run test`. The linter will check the code and the tests we built will run. Correct possible errors and push.
- Finally don't hesitate to ask questions and enjoy!