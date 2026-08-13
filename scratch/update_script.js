const fs = require('fs');
const file = '/home/ramadhani/UMKM/app/admin/products/page.jsx';
let c = fs.readFileSync(file, 'utf8');

c = c.replace('imagePreview: ',
