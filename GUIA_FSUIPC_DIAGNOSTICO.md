# 🔍 Script de Diagnóstico FSUIPC Completo

## ✅ Status Confirmado

```powershell
# Processos rodando:
FSUIPC7.exe                  (PID: 32832)  ✅
FSUIPCWebSocketServer.exe    (PID: 29756)  ✅
FlightSimulator.exe          (PID: 19764)  ✅

# Portas ativas:
TCP 0.0.0.0:2048            LISTENING ✅
TCP [::]:2048                LISTENING ✅

# Teste de conexão:
TcpTestSucceeded: True ✅
```

---

## 📊 O Que Fazer Agora

### 1. **Testar WebSocket manualmente**
   - Abrir arquivo: `teste_fsuipc_detalhado.html`
   - Clicar em "🔌 Conectar"
   - Ver se consegue conexão em `ws://localhost:2048/fsuipc/`

### 2. **Se não conectar, verificar:**

```powershell
# Verificar se FSUIPCWebSocketServer está realmente escutando em 2048
netstat -ano | findstr ":2048"

# Ver logs de FSUIPC
# Pasta típica: C:\Users\<seu_usuario>\AppData\Local\Packages\Microsoft.FlightSimulator_8wekyb3d8bbwe\SystemAppData\Wgs\

# Verificar firewall
# Windows Defender pode estar bloqueando WebSocket
```

---

## 🚨 Possíveis Problemas

1. **FSUIPCWebSocketServer não está em modo WebSocket**
   - Pode estar em modo TCP simples
   - Solução: Reconfigurar FSUIPC

2. **Firewall bloqueando**
   - Windows Defender pode bloquear conexão WebSocket
   - Solução: Liberar porta 2048 no firewall

3. **FSUIPC esperando autenticação**
   - Pode requerer token/chave
   - Solução: Verificar configurações de FSUIPC

4. **Flight Simulator não ligado corretamente**
   - FSUIPC só funciona quando FS está 100% carregado
   - Solução: Esperar FS carregar completamente

---

## 🧪 Teste no Navegador

Abra em http://localhost:3000 e no DevTools (F12) → Console:

```javascript
// Teste simples de WebSocket
const ws = new WebSocket('ws://localhost:2048/fsuipc/');

ws.onopen = () => {
    console.log('✅ Conectado!');
    ws.send(JSON.stringify({
        command: 'subscribe',
        arguments: ['A:PLANE ALTITUDE']
    }));
};

ws.onmessage = (e) => {
    console.log('📡 Dados:', e.data);
};

ws.onerror = (e) => {
    console.error('❌ Erro:', e);
};
```

---

## 📞 Próximas Ações

1. ✅ **Teste o arquivo HTML** (`teste_fsuipc_detalhado.html`)
2. ⏳ **Verifique o console do navegador** para erros
3. ⏳ **Tente conectar** clicando no botão
4. ⏳ **Compartilhe o erro** que aparecer

Qualquer mensagem de erro vai nos ajudar a resolver!
