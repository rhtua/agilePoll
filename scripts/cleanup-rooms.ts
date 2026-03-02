import * as admin from 'firebase-admin'
import * as readline from 'readline'
import { readFileSync, existsSync } from 'fs'
import { resolve } from 'path'

// ─── Load service account ───
const keyPath = resolve(__dirname, '..', 'serviceAccountKey.json')

if (!existsSync(keyPath)) {
  console.error('\n❌ Arquivo serviceAccountKey.json não encontrado na raiz do projeto!')
  console.error('\nPara obtê-lo:')
  console.error('  1. Acesse console.firebase.google.com')
  console.error('  2. Projeto → Configurações → Contas de serviço')
  console.error('  3. Clique em "Gerar nova chave privada"')
  console.error('  4. Salve como serviceAccountKey.json na raiz do projeto\n')
  process.exit(1)
}

const serviceAccount = JSON.parse(readFileSync(keyPath, 'utf-8'))

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: serviceAccount.project_id
    ? `https://${serviceAccount.project_id}-default-rtdb.firebaseio.com`
    : undefined,
})

const db = admin.database()

// ─── Interactive prompt ───
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

function ask(question: string): Promise<string> {
  return new Promise((resolve) => rl.question(question, resolve))
}

async function main() {
  console.log('\n🧹 AgilePoll — Limpeza de salas\n')

  const daysStr = await ask('Deletar salas mais velhas que quantos dias? ')
  const days = parseInt(daysStr, 10)

  if (isNaN(days) || days < 0) {
    console.error('❌ Valor inválido. Informe um número inteiro positivo.')
    rl.close()
    process.exit(1)
  }

  const cutoff = Date.now() - days * 24 * 60 * 60 * 1000
  const cutoffDate = new Date(cutoff)

  console.log(`\n🔍 Buscando salas criadas antes de ${cutoffDate.toLocaleString('pt-BR')}...\n`)

  const snapshot = await db.ref('rooms').once('value')
  const rooms = snapshot.val()

  if (!rooms) {
    console.log('Nenhuma sala encontrada no banco.')
    rl.close()
    process.exit(0)
  }

  const staleRooms: { code: string; name: string; createdAt: string }[] = []

  for (const [code, room] of Object.entries<any>(rooms)) {
    const createdAt = new Date(room.createdAt).getTime()
    if (createdAt < cutoff) {
      staleRooms.push({
        code,
        name: room.name || '(sem nome)',
        createdAt: new Date(room.createdAt).toLocaleString('pt-BR'),
      })
    }
  }

  if (staleRooms.length === 0) {
    console.log(`✅ Nenhuma sala com mais de ${days} dia(s) encontrada.`)
    rl.close()
    process.exit(0)
  }

  console.log(`Encontradas ${staleRooms.length} sala(s) para deletar:\n`)
  for (const room of staleRooms) {
    console.log(`  • [${room.code}] ${room.name} — criada em ${room.createdAt}`)
  }

  const confirm = await ask(`\n⚠️  Confirma a exclusão de ${staleRooms.length} sala(s)? (s/N) `)

  if (confirm.toLowerCase() !== 's') {
    console.log('Operação cancelada.')
    rl.close()
    process.exit(0)
  }

  console.log('\n🗑️  Deletando...')

  let deleted = 0
  for (const room of staleRooms) {
    await db.ref(`rooms/${room.code}`).remove()
    deleted++
    process.stdout.write(`  ${deleted}/${staleRooms.length}\r`)
  }

  console.log(`\n✅ ${deleted} sala(s) deletada(s) com sucesso!\n`)

  rl.close()
  process.exit(0)
}

main().catch((err) => {
  console.error('Erro:', err)
  rl.close()
  process.exit(1)
})
