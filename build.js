const StyleDictionary = require('style-dictionary');
// const { registerTransforms, transformDimension } = require('@tokens-studio/sd-transforms')
// registerTransforms(StyleDictionary);
// const tokens = require("./tokens/tokens.json")
const path = require('path');
const fs = require('fs');

var dsm_dir = 'build/';

var currentdate = new Date(); 
var datetime = "Last Sync: " + currentdate.getDate() + "/"
                + (currentdate.getMonth()+1)  + "/" 
                + currentdate.getFullYear() + " @ "  
                + currentdate.getHours() + ":"  
                + currentdate.getMinutes() + ":" 
                + currentdate.getSeconds();

StyleDictionary.registerFileHeader({
  name: 'mySPHHeader',
  fileHeader: (defaultMessage) => { 
    return [`mySPH tokens generated do not edit`, `on ${datetime}`];
  },
});


StyleDictionary.registerFilter({
  name: 'baseFilter',
  matcher: function (token) { 
    return (
      token.type === 'color' ||
      token.type === 'size'
      // token.type === 'Gradient' ||
      // token.type === 'Greyscale' ||
      // token.type === 'fontSizes' ||
      // token.type === 'fontFamilies' ||
      // token.type === 'fontWeights' ||
      // token.type === 'lineHeights' ||
      // token.type === 'letterSpacing' ||
      // token.type === 'borderWidth' ||
      // token.type === 'borderRadius'
    );
  },
});


StyleDictionary.registerFilter({
  name: 'dsFilter',
  matcher: function (token) { 
    return (
      token.type === 'alias'   ||
      token.type === 'size'
      // token.type === 'Gradient' ||
      // token.type === 'Greyscale' ||
      // token.type === 'fontSizes' ||
      // token.type === 'fontFamilies' ||
      // token.type === 'fontWeights' ||
      // token.type === 'lineHeights' ||
      // token.type === 'letterSpacing' ||
      // token.type === 'borderWidth' ||
      // token.type === 'borderRadius'
    );
  },
});

StyleDictionary.registerFormat({
  name: 'baseFormat',
  formatter: function ({ dictionary }) {
    let strTokens = `//base styles \n`;

    const obj = dictionary.tokens.identities;
    // console.log(obj, 'identites');

    strTokens += `const identities = {\n\t `;
    for (let x in obj) {

      strTokens += `\t\t${x}:{\n`
      let designTokens = obj[x];
      
      // console.log(designTokens, 'design tokens');

      for (let it in designTokens) {
        if(designTokens[it].type === 'color'){
        strTokens += `\t\t\t\t${it}: '${designTokens[it].value.slice(0, -2)}',\n`
        }
        if(designTokens[it].type === 'size'){
          strTokens += `\t\t\t\t${it}: '${designTokens[it].value}px',\n`
          }

      }


      strTokens += `\t\t},\n`;
    }
    strTokens += `}`;
    return strTokens;
  },
});

 
StyleDictionary.registerFormat({
  name: 'dtFormate',
  formatter: function ({ dictionary }) {
    let strTokens = `//base styles \n`;

    const obj = dictionary.tokens.designtokens;
    // console.log(obj, 'identites');

    strTokens += `const theme = {\n\t `;
    for (let x in obj) {

      strTokens += `\t\t${x}:{\n`
      let designTokens = obj[x];
      
      // console.log(designTokens, 'design tokens');

      for (let it in designTokens) {
        
        if(designTokens[it].type === 'size'){
          strTokens += `\t\t\t\t${it}: '${designTokens[it].value}px',\n`
          }else {
            strTokens += `\t\t\t\t${it}: ${designTokens[it].value},\n`
       
          }
      }


      strTokens += `\t\t},\n`;
    }
    strTokens += `}`;
    dictionary.allTokens.map((tkn) => {
      if (dictionary.usesReference(tkn.original.value)) {
        // Note: make sure to use `token.original.value` because
        // `token.value` is already resolved at this point.
        const refs = dictionary.getReferences(tkn.original.value);
        refs.forEach((ref) => {
          // styleVal = ref;
          strTokens = strTokens.replace(ref.value, function () {
            return `${ref.name.replaceAll('-','.')}`;
          });
        });
      }
    });
    return strTokens;
  },
});

 

const myStyleDictionary = StyleDictionary.extend({
  // configuration
  source: ['tokens/**/*.json'],
  platforms: {
    'js/base': {
      transforms: [
        'attribute/cti', 
        'size/px',
        'color/hex',
        'name/cti/camel',
      ],
      buildPath: `${dsm_dir}js/`,
      files: [
        {
          destination: `_base.js`,  
          filter: 'baseFilter',
          format: 'baseFormat',
          options: {
            outputReferences: true, 
          }, 
        },
      ],
    },
    'js/designTokens': {
      transforms: [
        'attribute/cti',
        'name/cti/kebab', 
        'size/px',
        'color/hex',
      ],
      buildPath: `${dsm_dir}js/`,
      files: [
        {
          destination: `_designTokens.js`,  
          filter: 'dsFilter',
          format: 'dtFormate',
          options: {
            outputReferences: true, 
          }, 
        },
      ],
    },
  },
});

myStyleDictionary.buildAllPlatforms();