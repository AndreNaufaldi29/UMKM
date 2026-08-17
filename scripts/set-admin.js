import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import readline from 'readline';

const prisma = new PrismaClient();

async function askQuestion(query) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  return new Promise((resolve) =>
    rl.question(query, (ans) => {
      rl.close();
      resolve(ans.trim());
    })
  );
}

async function main() {
  console.log('═══════════════════════════════════════════════');
  console.log('   🔐 PENGATURAN KREDENSIAL ADMIN WEBSITE UMKM  ');
  console.log('═══════════════════════════════════════════════\n');

  // Check if arguments passed via CLI: node scripts/set-admin.js <username> <password> <fullName>
  const args = process.argv.slice(2);
  let username = args[0];
  let password = args[1];
  let fullName = args[2];

  if (!username) {
    username = await askQuestion('👤 Masukkan Username Baru [default: admin]: ') || 'admin';
  }
  if (!password) {
    password = await askQuestion('🔑 Masukkan Password Baru [min 6 karakter]: ');
  }
  if (!password || password.length < 6) {
    console.error('❌ Error: Password minimal harus 6 karakter.');
    process.exit(1);
  }
  if (!fullName) {
    fullName = await askQuestion('🏷️  Masukkan Nama Lengkap [default: Administrator]: ') || 'Administrator';
  }

  const cleanUsername = username.trim().toLowerCase();
  console.log('\n⏳ Menghash password & menyimpan ke database...');

  const passwordHash = await bcrypt.hash(password, 10);

  // Check if admin exists
  const existingAdmin = await prisma.adminUser.findFirst();

  if (existingAdmin) {
    const updated = await prisma.adminUser.update({
      where: { id: existingAdmin.id },
      data: {
        username: cleanUsername,
        passwordHash,
        fullName,
      },
    });
    console.log('\n✅ Identitas Admin BERHASIL DIPERBARUI:');
    console.log(`   • ID        : ${updated.id}`);
    console.log(`   • Username  : ${updated.username}`);
    console.log(`   • Nama      : ${updated.fullName}`);
    console.log(`   • Password  : (Tersimpan aman dengan enkripsi bcrypt)`);
  } else {
    const created = await prisma.adminUser.create({
      data: {
        username: cleanUsername,
        passwordHash,
        fullName,
        role: 'admin',
      },
    });
    console.log('\n✅ Akun Admin Baru BERHASIL DIBUAT:');
    console.log(`   • Username : ${created.username}`);
    console.log(`   • Nama     : ${created.fullName}`);
  }

  console.log('\n🎉 Anda sekarang dapat login ke /admin dengan kredensial baru tersebut.\n');
}

main()
  .catch((err) => {
    console.error('❌ Terjadi kesalahan:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
