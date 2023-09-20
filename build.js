const StyleDictionary = require('style-dictionary');
// const { registerTransforms, transformDimension } = require('@tokens-studio/sd-transforms')
// registerTransforms(StyleDictionary);
// const tokens = require("./tokens/tokens.json")
const path = require('path');
const fs = require('fs');

var dsm_dir = 'build/';

function kebabToCC(str) {
  // console.log(str.match(/-./g));
  return str.replace(/-./g, match => match[1].toUpperCase());
}

30

const kebabize = str => {
   return str.split('').map((letter, idx) => {
     return letter.toUpperCase() === letter
      ? `${idx !== 0 ? '-' : ''}${letter.toLowerCase()}`
      : letter;
   }).join('');
}

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
      token.type === 'dimension'
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
      token.type === 'color' ||
      // token.attributes.category == 'sizes'
      token.type === 'dimension' ||
      token.type === 'string' 
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
  name: 'tsFilter',
  matcher: function (token) { 
    return ( 
      // token.type === 'color' ||
      token.attributes.category == 'typography'
      // token.type === 'dimension' ||
      // token.type === 'string' 
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

      strTokens += `\t\t${kebabToCC(x)}:{\n`
      let designTokens = obj[x];
       
      // console.log(designTokens, 'design tokens');

      for (let it in designTokens) {
        if(designTokens[it].type === 'color'){
        strTokens += `\t\t\t\t${kebabToCC(it)}: '${designTokens[it].value.slice(0, -2)}',\n`
        }
        if(designTokens[it].type === 'dimension'){
          switch(x){
            case 'font-weight':
              strTokens += `\t\t\t\t${kebabToCC(it)}: '${designTokens[it].value}',\n`
              break;
            case 'line-height':
              strTokens += `\t\t\t\t${kebabToCC(it)}: '${designTokens[it].value}%',\n`
              break;
            default:
              strTokens += `\t\t\t\t${kebabToCC(it)}: '${designTokens[it].value}px',\n`
              break;
          }
        }
      }
      strTokens += `\t\t},\n`;
    }
    strTokens += `}`;
    return strTokens;
  },
});


StyleDictionary.registerFormat({
  name: 'baseSCSSFormat',
  formatter: function ({ dictionary }) {
    let strTokens = `//base styles \n`;

    const obj = dictionary.tokens.identities;
    // console.log(obj, 'identites');

    // strTokens += `const identities = {\n\t `;
    for (let x in obj) {

      strTokens += `// styles for ${kebabToCC(x)}\n`
      let designTokens = obj[x];
       
      // console.log(designTokens, 'design tokens');

      for (let it in designTokens) {
        if(designTokens[it].type === 'color'){
        strTokens += `$${kebabToCC(it)}: '${designTokens[it].value.slice(0, -2)}';\n`
        }
        if(designTokens[it].type === 'dimension'){
          switch(x){
            case 'font-weight':
              strTokens += `$${kebabToCC(it)}: '${designTokens[it].value}';\n`
              break;
            case 'line-height':
              strTokens += `$${kebabToCC(it)}: '${designTokens[it].value}%';\n`
              break;
            default:
              strTokens += `$${kebabToCC(it)}: '${designTokens[it].value}px';\n`
              break;
          }
        }
      }
      strTokens += `\n`;
    }
    // strTokens += `}`;
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

      strTokens += `\t\t${kebabToCC(x)}:{\n`
      let designTokens = obj[x];
      
      // console.log(designTokens, 'design tokens');

      for (let it in designTokens) {

        if(designTokens[it].type === 'dimension'){
          strTokens += `\t\t\t\t${kebabToCC(it)}: '${designTokens[it].value}px', ${designTokens[it].description ? '/**' + designTokens[it].description+ ' **/' : ''}\n`
          }else {

            switch(x){
              case 'charts':
                let chartTokens = designTokens[it];
                // console.log(chartTokens, it);
                for (let ct in chartTokens){
                  // console.log(ct, '-',it);
                  if(chartTokens[ct].type === 'dimension'){
                  strTokens += `\t\t\t\t${kebabToCC(it+'-'+ct)}: '${chartTokens[ct].value}px', ${chartTokens[ct].description ? '/**  hello **/' : ''}  \n`
                  }else{
                  strTokens += `\t\t\t\t${kebabToCC(it+'-'+ct)}: ${chartTokens[ct].value},\n`
                  }
                }
                // strTokens += `\t\t\t\t${it}: ${designTokens[it].value},\n`
                break;
              case 'sizes':
                strTokens += `\t\t\t\t${kebabToCC(it)}: '${designTokens[it].value}',  ${designTokens[it].description ? '/**  hello **/' : ''}\n`
                break;
              default: 
                strTokens += `\t\t\t\t${kebabToCC(it)}: ${designTokens[it].value},\n`
                break;

            } 
       
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


StyleDictionary.registerFormat({
  name: 'dtSCSSFormat',
  formatter: function ({ dictionary }) {
    let strTokens = `//design tokens \n`;

    const obj = dictionary.tokens.designtokens; 

    // strTokens += `const theme = {\n\t `;
    for (let x in obj) {

      strTokens += `\n//${kebabToCC(x)} tokens\n`
      let designTokens = obj[x];
      
      for (let it in designTokens) {

        if(designTokens[it].type === 'dimension'){
          strTokens += `$${kebabToCC(it)}: '${designTokens[it].value}px'; ${designTokens[it].description ? '/**' + designTokens[it].description+ ' **/' : ''}\n`
          }else {

            switch(x){
              case 'charts':
                let chartTokens = designTokens[it];
                // console.log(chartTokens, it);
                for (let ct in chartTokens){
                  // console.log(ct, '-',it);
                  if(chartTokens[ct].type === 'dimension'){
                  strTokens += `$${kebabToCC(it+'-'+ct)}: '${chartTokens[ct].value}px'; ${chartTokens[ct].description ? '/**  **/' : ''}  \n`
                  }else{
                  strTokens += `$${kebabToCC(it+'-'+ct)}: $${chartTokens[ct].value};\n`
                  }
                }
                break;
              case 'sizes':
                strTokens += `$${kebabToCC(it)}: '$${designTokens[it].value}';  ${designTokens[it].description ? '/**  **/' : ''}\n`
                break;
              default: 
                strTokens += `$${kebabToCC(it)}: $${designTokens[it].value};\n`
                break;

            } 
       
          }
           
      }
      // strTokens += `\t\t},\n`;
    }
    // strTokens += `}`;
    dictionary.allTokens.map((tkn) => {
      if (dictionary.usesReference(tkn.original.value)) {
        // Note: make sure to use `token.original.value` because
        // `token.value` is already resolved at this point.
        const refs = dictionary.getReferences(tkn.original.value);
        refs.forEach((ref) => { 
          // styleVal = ref;
          strTokens = strTokens.replace(ref.value, function () {
            return `${ref.path[2]}`;
          });
        });
      }
    });
    return strTokens;
  },
});


StyleDictionary.registerFormat({
  name: 'tsSCSSFormat',
  formatter: function ({ dictionary }) {
    let strTokens = `//design tokens \n`;

    const obj = dictionary.tokens.typography; 

    // strTokens += `const theme = {\n\t `;
    for (let x in obj) {
 
      strTokens += `\n.${kebabToCC(x)} {\n`
      let designTokens = obj[x];
      
      for (let it in designTokens) {  

        switch(it){
          case 'fontSize':
            strTokens += `\t${kebabize(it)}: ${designTokens[it].value}px; ${designTokens[it].description ? '/**' + designTokens[it].description+ ' **/' : ''}\n`
          break;
          case 'textDecoration':
            strTokens += `\t${kebabize(it)}: ${designTokens[it].value}; ${designTokens[it].description ? '/**' + designTokens[it].description+ ' **/' : ''}\n`
          break;
          case 'fontFamily':
            strTokens += `\t${kebabize(it)}: '${designTokens[it].value}', Helvetica, Arial, sans-serif; ${designTokens[it].description ? '/**' + designTokens[it].description+ ' **/' : ''}\n`
          break;
          case 'fontStyle':
            strTokens += `\t${kebabize(it)}: ${designTokens[it].value}; ${designTokens[it].description ? '/**' + designTokens[it].description+ ' **/' : ''}\n`
          break;
          case 'letterSpacing':
            strTokens += `\t${kebabize(it)}: ${designTokens[it].value}px; ${designTokens[it].description ? '/**' + designTokens[it].description+ ' **/' : ''}\n`
          break;
          case 'lineHeight':
            strTokens += `\t${kebabize(it)}: ${designTokens[it].value}px; ${designTokens[it].description ? '/**' + designTokens[it].description+ ' **/' : ''}\n`
          break;
          case 'textCase':
            strTokens += `\ttext-decoration: ${designTokens[it].value}; ${designTokens[it].description ? '/**' + designTokens[it].description+ ' **/' : ''}\n`
          break;

          default: 
          break;
        }

      }
      strTokens += `}\n`;
    }
    // strTokens += `}`;
    dictionary.allTokens.map((tkn) => {
      if (dictionary.usesReference(tkn.original.value)) {
        // Note: make sure to use `token.original.value` because
        // `token.value` is already resolved at this point.
        const refs = dictionary.getReferences(tkn.original.value);
        refs.forEach((ref) => { 
         
          strTokens = strTokens.replace(ref.value, function () {
            return `${ref.path[2]}`;
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
        'name/cti/kebab',
        'size/px',
        'color/hex',
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
    'scss/base': {
      transforms: [
        'attribute/cti', 
        'name/cti/kebab',
        'size/px',
        'color/hex',
      ],
      buildPath: `${dsm_dir}scss/`,
      files: [
        {
          destination: `_base.scss`,  
          filter: 'baseFilter',
          format: 'baseSCSSFormat',
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
    'scss/designTokens': {
      transforms: [
        'attribute/cti',
        'name/cti/kebab', 
        'size/px',
        'color/hex',
      ],
      buildPath: `${dsm_dir}scss/`,
      files: [
        {
          destination: `_designTokens.scss`,  
          filter: 'dsFilter',
          format: 'dtSCSSFormat',
          options: {
            outputReferences: true, 
          }, 
        },
      ],
    },
    'scss/textStyles': {
      transforms: [
        'attribute/cti',
        'name/cti/kebab', 
        // 'size/px',
        'color/hex',
      ],
      buildPath: `${dsm_dir}scss/`,
      files: [
        {
          destination: `_typography.scss`,  
          filter: 'tsFilter',
          format: 'tsSCSSFormat',
          options: {
            outputReferences: true, 
          }, 
        },
      ],
    },
  },
});

myStyleDictionary.buildAllPlatforms();