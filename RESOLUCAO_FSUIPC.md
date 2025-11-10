# 🔧 Como Resolver: Conexão FSUIPC Desconectada

## ❌ O Problema

O servidor WebSocket FSUIPC na **porta 2048** não está respondendo porque:

```
❌ Flight Simulator está FECHADO
❌ FSUIPC está FECHADO
❌ Nenhuma aplicação escutando na porta 2048
```

---

## ✅ Solução em 4 Passos

### **PASSO 1: Abrir Flight Simulator**

1. Pesquise por **"Flight Simulator"** no Windows
2. Ou abra: `C:\Program Files\Microsoft Flight Simulator\FlightSimulator.exe`
3. **Deixar carregar completamente** (pode levar 2-3 minutos)
4. Esperar até ver a interface principal do simulador

**Indicador de sucesso:**
```
✅ Você vê a tela inicial do Flight Simulator
✅ Menu principal está visível
✅ Simulador está respondendo
```

---

### **PASSO 2: Abrir FSUIPC**

1. Procure por **"FSUIPC7"** no PC
2. Ou abra: `C:\Program Files\FSUIPC\FSUIPC7.exe`
3. FSUIPC vai detectar Flight Simulator automaticamente
4. Deixar rodando em background

**Indicador de sucesso:**
```
✅ FSUIPC7.exe aparece em Gerenciador de Tarefas
✅ FSUIPCWebSocketServer.exe também aparece
✅ Nenhuma mensagem de erro
```

---

### **PASSO 3: Verificar se Está Funcionando**

Abra **PowerShell** e execute:

```powershell
# Verificar se os processos estão rodando
tasklist | findstr -i "fsuipc\|flight"

# Deve mostrar:
# FSUIPC7.exe
# FSUIPCWebSocketServer.exe
# FlightSimulator.exe
```

Se não aparecer nada, volte aos passos 1-2.

---

### **PASSO 4: Testar Conexão**

**No navegador:**
1. Abrir: http://localhost:3000
2. Pressionar: **Ctrl + F5** (refresh completo)
3. Abrir o arquivo de teste: `teste_fsuipc_detalhado.html`
4. Clicar no botão **"🔌 Conectar"**

**Status esperado:**
```
✅ Status da conexão: Conectado
✅ Dados chegando em tempo real
✅ Altitude, velocidade, etc. atualizando
```

---

## ⏱️ Tempos de Espera Importantes

| Evento | Tempo de Espera |
|--------|-----------------|
| Flight Simulator abrir | 2-3 minutos |
| FSUIPC carregar | 30 segundos |
| WebSocket ficar pronto | 10-15 segundos |
| **Total** | **~5 minutos** |

**Não tente conectar enquanto estiver carregando!**

---

## 🆘 Se Ainda Não Funcionar

### Checklist de Troubleshooting:

```
☐ Flight Simulator está aberto?
☐ FSUIPC está rodando?
☐ Ambos estão no Gerenciador de Tarefas?
☐ Esperou pelo menos 3 minutos?
☐ Firewall não está bloqueando porta 2048?
☐ Navegador está em http://localhost:3000?
☐ Fez Ctrl+F5 para limpar cache?
```

### Teste TCP Básico:

```powershell
# No PowerShell:
Test-NetConnection -ComputerName localhost -Port 2048

# Esperado:
# TcpTestSucceeded : True
```

Se falhar, FSUIPC não está rodando.

---

## 🎯 Resumo Rápido

```
1. Abrir Flight Simulator
   ↓ (esperar 2-3 min)
2. Abrir FSUIPC7.exe
   ↓ (esperar 30 seg)
3. Abrir http://localhost:3000
   ↓ (Ctrl+F5)
4. Testar conexão
   ↓
✅ PRONTO!
```

---

## 💡 Dicas Úteis

1. **Flight Simulator demora para carregar**
   - É normal, especialmente na primeira vez
   - Deixe carregar até ver o menu principal

2. **FSUIPC precisa ser executado depois de Flight Simulator**
   - Ordem: Flight Simulator → Esperar → FSUIPC

3. **Reconexão automática**
   - Se desconectar, a aplicação tenta reconectar a cada 5 segundos

4. **Verificar Firewall**
   - Se nada funcionar, adicione exceção para porta 2048:
   ```powershell
   # PowerShell como Admin:
   New-NetFirewallRule -DisplayName "FSUIPC WebSocket" -Direction Inbound -LocalPort 2048 -Protocol TCP -Action Allow
   ```

---

## 📞 Documentação Relacionada

- `DIAGNOSTICO_DESCONEXAO.md` - Diagnóstico técnico
- `teste_fsuipc_detalhado.html` - Teste visual
- `GUIA_FSUIPC_DIAGNOSTICO.md` - Troubleshooting avançado

---

**Depois de seguir esses passos, a conexão deve estar ✅ FUNCIONANDO!**
