const fs = require('fs');
const code = fs.readFileSync('app/page.tsx', 'utf8');

// The Chayakada Gossips block starts at line 964
// We can use unique markers:
const gossipsStartStr = '<div className="panel" style={{background: \'#fef3c7\', gridColumn: \'1 / -1\', border: \'4px solid var(--ink)\', boxShadow: \'8px 8px 0 var(--ink)\', position: \'relative\'}}>';
const hitListStartStr = '<div className="panel" style={{background: \'var(--pink)\', color: \'#111\', gridColumn: \'1 / -1\'}}>';
const hitListEndStr = '{persons.length === 0 && <div className="empty" style={{gridColumn: \'1 / -1\', color: \'#111\', borderColor: \'rgba(0,0,0,0.1)\'}}>No one here yet. Someone needs to be added. 👀</div>}\n        </div>';

const gossipsStart = code.indexOf(gossipsStartStr);
const hitListStart = code.indexOf(hitListStartStr);
const hitListEnd = code.indexOf(hitListEndStr) + hitListEndStr.length;

if (gossipsStart > -1 && hitListStart > -1 && hitListEnd > -1) {
  const hitListBlock = code.substring(hitListStart, hitListEnd);
  
  // 1. Remove hitListBlock from its original position
  let newCode = code.substring(0, hitListStart) + code.substring(hitListEnd);
  
  // 2. Insert hitListBlock before gossipsStart
  const modifiedGossipsStart = newCode.indexOf(gossipsStartStr);
  newCode = newCode.substring(0, modifiedGossipsStart) + hitListBlock + '\n\n        ' + newCode.substring(modifiedGossipsStart);
  
  fs.writeFileSync('app/page.tsx', newCode);
  console.log('Swapped successfully!');
} else {
  console.log('Could not find strings');
  console.log('gossipsStart', gossipsStart);
  console.log('hitListStart', hitListStart);
  console.log('hitListEnd', hitListEnd);
}
