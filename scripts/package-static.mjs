// Static-export equivalent of the Sites packager for environments whose bundled
// package-site.sh supports only Worker builds.
import {mkdtempSync,cpSync,readFileSync,writeFileSync,mkdirSync,rmSync,existsSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join,resolve} from 'node:path';
import {execFileSync} from 'node:child_process';
const project=process.cwd();const archive=resolve(process.argv[2]||'/tmp/vitalife-site.tar.gz');
const manifest=JSON.parse(readFileSync(join(project,'.openai/hosting.json'),'utf8'));
if(!existsSync(join(project,'out/index.html')))throw new Error('Run npm run build first');
const stage=mkdtempSync(join(tmpdir(),'vitalife-package-'));
try{const dist=join(stage,'dist');cpSync(join(project,'out'),dist,{recursive:true});mkdirSync(join(dist,'.openai'),{recursive:true});writeFileSync(join(dist,'.openai/hosting.json'),JSON.stringify({...manifest,static:{directory:'dist'}},null,2));execFileSync('tar',['-czf',archive,'-C',stage,'dist']);const entries=execFileSync('tar',['-tzf',archive],{encoding:'utf8'});if(!entries.includes('dist/index.html')||!entries.includes('dist/.openai/hosting.json'))throw new Error('Invalid archive');console.log(archive);}finally{rmSync(stage,{recursive:true,force:true})}
