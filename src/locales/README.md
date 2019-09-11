# Help us to translate PayUTC!

<p align="center">
   <img src="/assets/icon.png" alt="payutc-icon" width="150"/>
</p>

There is a lot of foreign students at UTC, and thereby a lot of different languages too! We would love to have yours within the app.

### Add a new language

- First, create a new branch called `feature/the-language-name` from develop
- Then, in this directory (`/src/locales`), create a file named `your-language-code.json`. 
    * You can find your language ISO-639.1 name [here](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes).
    * For example, if you want to add the german, just create a `de.json` file.
- Don't forget to name your language in the file `/src/locales/global.json`.
    * For example, for german, you would add the line: `"de": "Deutsche"` just after the other languages. (Always name it in its own language. If there is a conflict, then use english.)
- Translate! 
    * You'll need to get a template. We recommend to start from french or english, since they're always updated when we add a new string. Just copy and paste `fr.json` or `en.json` in your new file and replace the french or the english strings by your beautiful language!
- Commit and push into your new branch

### Update an existing language

- Create a branch called `fix/the-language-name` from develop
- Update the language file in this directory (`/src/locales`)
- Commit and push into your new branch
