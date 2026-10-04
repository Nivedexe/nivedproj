import bcrypt from 'bcryptjs';
console.log(await bcrypt.hash('adminpassword123', 10));
