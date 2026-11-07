import {readFileSync,writeFileSync} from 'node:fs';
import {withoutCplus} from './focus-source.mjs';
const file=new URL('../index.html',import.meta.url),css=readFileSync(new URL('nino-cplus.css',import.meta.url),'utf8');
let html=withoutCplus(readFileSync(file,'utf8'));
if(!process.argv.includes('--remove'))html=html.replace('</head>','<style>/* BEGIN NINO CPLUS */\n'+css+'/* END NINO CPLUS */\n</style></head>').replace('<title>Topo Italië · leer de kaart</title>','<title>NINO · La Grande Avventura · Topografie Italië</title>');
writeFileSync(file,html);
