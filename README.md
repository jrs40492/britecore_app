# BriteCore Engineering Application

## Questions

### How long did you spend on the test? Would you do anything differently if you had more time?

- I spent around 40 hours over the course of 2 weeks on the project. If I had more time, I would add user authentication, the ability to delete reports/records, and better error handling.

### In what ways would you adapt your component so that it could be used in many different scenarios where a data table is required?

- The DataTable component I built can handle any CSV file as long as the headers in the first row. It will dynamically pull the headers out and allow you to set the name, visibility, order, data type, and filtering of each column individually.
- Given more time, I'd like to expand on the data types and column options like allowing specific column widths and add e-mail, number, and address types.

### What is your favorite CSS property? Why?

- My favorite CSS property is display flex and it's associated properties. It makes building responsive websites so much easier, especially when it's combined with SASS and SASS mixins.

### What is your favorite modern Javascript feature? Why?

- My favorite Javascript feature is the .forEach loop. It allows me to easily loop through collections by name versus the older way of by index. This makes reading through code a lot easier in my opinion.

### What is your favorite third-party Vue.js library? Why?

- I don't have a favorite Vue.js library at this point because this was my first time using Vue. I think Vuetify would have made this task a lot simpler if I decided to use it.

## Project setup

```
1. Rename .env.example to .env.dev
2. Plug in firestore config values
3. npm install
```

### Compiles and hot-reloads for development

```
npm run serve
```

### Compiles and minifies for production

```
npm run build
```

### Run your tests

```
npm run test
```

### Lints and fixes files

```
npm run lint
```

### Run your unit tests

```
npm run test:unit
```

### Customize configuration

See [Configuration Reference](https://cli.vuejs.org/config/).
