# 🔐 Problema: HTTPS → WS (Mixed Content)

## ❌ Problema Identificado

A aplicação está em **HTTPS** (`https://voo.waldenrique.com.br`) mas tenta conectar a **WS** (não seguro) em `ws://localhost:2048`.

**Navegadores modernos bloqueiam isso por segurança:** "Mixed Content" - você não pode usar WebSocket inseguro (WS) em um site seguro (HTTPS).

### Stack de Erros:
```
Mixed Content: The page at 'https://voo.waldenrique.com.br/atc-online' 
was loaded over HTTPS, but attempted to connect to the insecure WebSocket 
endpoint 'ws://localhost:2048/fsuipc/'. This request has been blocked.
```

## ✅ Solução: Servidor Proxy Local

Como o FSUIPC/Flight Simulator está **localmente** na sua máquina, você precisa de um servidor local que faz o "proxy" (ponte) da conexão.

### Arquitetura:

```
┌──────────────────────────────┐
│  Browser (Vercel)            │
│  https://voo.waldenrique...  │
└──────────────┬───────────────┘
               │ WSS (seguro)
               ↓
┌──────────────────────────────┐
│  Seu Computador              │
│  ┌──────────────────────────┐│
│  │ Proxy Local (Node.js)    ││
│  │ ws://localhost:3001      ││
│  └──────────┬───────────────┘│
│             │ WS (local)     │
│             ↓                │
│  ┌──────────────────────────┐│
│  │ FSUIPC WebSocket Server  ││
│  │ ws://localhost:2048      ││
│  └──────────────────────────┘│
└──────────────────────────────┘
```

## 🚀 Como Executar

### 1. Instale dependências (se não tiver):
```bash
cd d:\projeto\simbrief-dashboard
npm install ws express
```

### 2. Inicie o proxy local:
```bash
node proxy-fsuipc.js
```

Deve aparecer:
```
[PROXY] 🚀 Servidor proxy iniciado em ws://localhost:3001
[PROXY] 📊 Health check: http://localhost:3001/health
```

### 3. Verifique o status:
```bash
curl http://localhost:3001/health
```

Deve retornar:
```json
{
  "status": "ok",
  "fsuipc": "connected",
  "clients": 0
}
```

## 🔧 Próxima Etapa: Atualizar o Hook

Você precisa modificar `src/hooks/useFSUIPC.js` para se conectar ao proxy em vez de diretamente ao FSUIPC:

**De:**
```javascript
socket = new WebSocket('ws://localhost:2048/fsuipc/');
```

**Para:**
```javascript
socket = new WebSocket('ws://localhost:3001');
```

## 📋 Checklist:

- [ ] Rodar proxy: `node proxy-fsuipc.js`
- [ ] Verificar saúde: `curl http://localhost:3001/health`
- [ ] Flight Simulator rodando
- [ ] FSUIPC WebSocket Server rodando (porta 2048)
- [ ] Atualizar useFSUIPC.js para conectar ao proxy
- [ ] Fazer git push
- [ ] Esperar deploy Vercel
- [ ] Testar em https://voo.waldenrique.com.br/atc-online

## ⚠️ Importante

O proxy **precisa estar rodando sempre** quando você quer usar o site em produção. 

Para deixar rodando continuamente, você pode:

1. **Deixar terminal aberto** (simples)
2. **Usar PM2** (melhor para produção):
   ```bash
   npm install -g pm2
   pm2 start proxy-fsuipc.js --name fsuipc-proxy
   pm2 save
   pm2 startup
   ```

3. **Windows Task Scheduler** (para iniciar automaticamente)

## 🧪 Teste Local (Opcional)

Se quiser testar localmente primeiro antes de usar a versão de produção:

1. Abra `http://localhost:3000/atc-online` (desenvolvimento)
2. Console deve mostrar: `[FSUIPC] ✅ Conectado com sucesso!`
3. Dados de voo devem aparecer em tempo real

