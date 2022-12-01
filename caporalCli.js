const fs = require('fs')
const colors = require('colors');

const vg = require('vega');
const vegalite = require('vega-lite');

const cli = require("@caporal/core").default;

cli
    .version('gift-parser-cli')
    .version('0.07')
    // check Vpf