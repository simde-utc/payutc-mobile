# PayUTC Mobile Application

<p align="center">
   <img src="/assets/icon.png" alt="payutc-icon" width="150"/>
</p>

PayUTC is an individual cashless wallet available for all members of the University of Technology of Compiègne and its partner schools. With this app, you will be able to view your balance, refill your account on a securised platform and transfer money to others members. It is also possible to check your history, get personalized stats on your purchases and to lock your badge for increased safety.

Development began in July 2019.
The app is developed for both Android and iOS, thanks to React Native.

The app is available in French, English and Chinese.

### iOS version

<p align="center">
   <img src="/assets/screenshots/ios/connect.jpg" alt="connect-screen-ios" width="200"/>
   <img src="/assets/screenshots/ios/home.jpg" alt="home-screen-ios" width="200"/>
   <img src="/assets/screenshots/ios/transfer.jpg" alt="transfer-screen-ios" width="200"/>
   <img src="/assets/screenshots/ios/stats.jpg" alt="stats-screen-ios" width="200"/>
</p>

### Android version

<p align="center">
   <img src="/assets/screenshots/android/connect.png" alt="connect-screen-android" width="200"/>
   <img src="/assets/screenshots/android/home.png" alt="home-screen-android" width="200"/>
   <img src="/assets/screenshots/android/transfer.png" alt="transfer-screen-android" width="200"/>
   <img src="/assets/screenshots/android/stats.png" alt="stats-screen-android" width="200"/>
</p>

## Installation

- Install expo-cli with the following command: `npm install -g expo-cli`
- Install JavaScript dependencies: `npm install`

## Run with Expo

- Run expo for Android: `npm run android`
- Run expo for iOS: `npm run ios`

## Build on a device

### iOS
- iOS build requires Xcode. In order to use Xcode, you should update your pods using theses commands:
    * `cd ios`
    * `pod install`
- And then, open `PayUTC.xcworkspace` in Xcode and build the app.

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

## License

[GNU General Public License v3.0](./LICENSE)
