const fs = require('fs');
const code = fs.readFileSync('app/page.tsx', 'utf8');

// The Hit List block starts at line 964 currently
const hitListStartStr = '<div className="panel" style={{background: \'var(--pink)\', color: \'#111\', gridColumn: \'1 / -1\'}}>';
const hitListEndStr = '{persons.length === 0 && <div className="empty" style={{gridColumn: \'1 / -1\', color: \'#111\', borderColor: \'rgba(0,0,0,0.1)\'}}>No one here yet. Someone needs to be added. 👀</div>}\n        </div>';
const gossipsStartStr = '<div className="panel" style={{background: \'#fef3c7\', gridColumn: \'1 / -1\', border: \'4px solid var(--ink)\', boxShadow: \'8px 8px 0 var(--ink)\', position: \'relative\'}}>';
// Gossips ends with:
// {gossips.length === 0 && <div className="empty" style={{width: '100%', background: 'rgba(255,255,255,0.5)', color: 'var(--ink)', border: '2px dashed var(--ink)'}}>Nattukarude karyam ariyande irikkunnu? Aaraa e ee thengil keriyathu? 🤔 (No gossips yet!)</div>}
//           </div>
//         </div>
const gossipsEndStr = '{gossips.length === 0 && <div className="empty" style={{width: \'100%\', background: \'rgba(255,255,255,0.5)\', color: \'var(--ink)\', border: \'2px dashed var(--ink)\'}}>Nattukarude karyam ariyande irikkunnu? Aaraa e ee thengil keriyathu? 🤔 (No gossips yet!)</div>}\n          </div>\n        </div>';

const hitListStart = code.indexOf(hitListStartStr);
const hitListEnd = code.indexOf(hitListEndStr) + hitListEndStr.length;
const gossipsStart = code.indexOf(gossipsStartStr);
const gossipsEnd = code.indexOf(gossipsEndStr) + gossipsEndStr.length;

if (hitListStart > -1 && gossipsStart > -1) {
  // Extract both blocks
  const hitListBlock = code.substring(hitListStart, hitListEnd);
  const gossipsBlock = code.substring(gossipsStart, gossipsEnd);
  
  // Replace the combined area
  let newCode = code.substring(0, hitListStart) + gossipsBlock + '\n\n        ' + hitListBlock + code.substring(gossipsEnd);
  
  fs.writeFileSync('app/page.tsx', newCode);
  console.log('Swapped back successfully!');
} else {
  console.log('Could not find strings');
}
