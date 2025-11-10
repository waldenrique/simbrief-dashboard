# 🔧 Correção do Protocolo FSUIPC WebSocket

## Resumo das Mudanças

As correções implementadas transformam a comunicação WebSocket de um padrão incorreto (`subscribe` com argumentos) para o protocolo oficial FSUIPC WebSocket Server conforme documentado em http://fsuipcwebsockets.paulhenty.com/

## Problema Original

O código estava tentando usar:
```javascript
{
  command: 'subscribe',
  arguments: ['A:PLANE LATITUDE', 'A:PLANE LONGITUDE', ...]
}
```

**Resultado:** WebSocket conectava (TCP handshake bem-sucedido), mas os comandos não eram reconhecidos pelo servidor FSUIPC, causando silêncio (sem erro explícito).

## Solução Implementada

### Novo Fluxo de Comunicação

1. **Declarar Variáveis** (`vars.declare`)
```javascript
{
  command: 'vars.declare',
  definitions: [
    { name: 'latitude', type: 'f64', varname: 'PLANE LATITUDE' },
    { name: 'longitude', type: 'f64', varname: 'PLANE LONGITUDE' },
    { name: 'altitude', type: 'f64', varname: 'PLANE ALTITUDE' },
    { name: 'speed', type: 'i32', varname: 'AIRSPEED INDICATED' },
    { name: 'heading', type: 'i32', varname: 'HEADING INDICATOR' }
  ]
}
```

2. **Ler Variáveis Continuamente** (`vars.read`)
```javascript
{
  command: 'vars.read'
}
```

3. **Resposta do Servidor** (format dos dados retornados)
```javascript
{
  data: [
    { name: 'latitude', value: 47.234567 },
    { name: 'longitude', value: -122.345678 },
    { name: 'altitude', value: 5000.0 },
    { name: 'speed', value: 120 },
    { name: 'heading', value: 270 }
  ]
}
```

## Arquivos Modificados

### 1. **src/hooks/useFSUIPC.js**

**Alteração 1: Connection Handler**
- Substitui comando `subscribe` por `vars.declare` com type definitions
- Adiciona delay para garantir que `vars.declare` seja processado antes de `vars.read`

```javascript
socket.onopen = () => {
  console.log('[FSUIPC] ✅ Conectado com sucesso!');
  setStatus('conectado');
  setError(null);
  setConnectionAttempts(0);

  // Declarar variáveis com tipos corretos
  socket.send(JSON.stringify({
    command: 'vars.declare',
    definitions: [
      { name: 'latitude', type: 'f64', varname: 'PLANE LATITUDE' },
      { name: 'longitude', type: 'f64', varname: 'PLANE LONGITUDE' },
      { name: 'altitude', type: 'f64', varname: 'PLANE ALTITUDE' },
      { name: 'speed', type: 'i32', varname: 'AIRSPEED INDICATED' },
      { name: 'heading', type: 'i32', varname: 'HEADING INDICATOR' }
    ]
  }));

  // Iniciar leitura contínua após 100ms
  setTimeout(() => {
    socket.send(JSON.stringify({
      command: 'vars.read'
    }));
  }, 100);
};
```

**Alteração 2: Message Handler**
- Atualiza para processar resposta de `vars.read`
- Extrai dados do array `msg.data`
- Mapeia nome da variável para seu valor

```javascript
socket.onmessage = (event) => {
  try {
    const msg = JSON.parse(event.data);
    
    // Resposta de vars.read
    if (msg.data && Array.isArray(msg.data)) {
      const mapped = {};
      msg.data.forEach(item => {
        mapped[item.name] = item.value;
      });
      setData(mapped);
      
      // Continuar lendo
      socket.send(JSON.stringify({
        command: 'vars.read'
      }));
    }
    // Resposta de vars.declare
    else if (msg.command === 'vars.declare') {
      console.log('[FSUIPC] Variáveis declaradas com sucesso');
    }
  } catch (e) {
    console.error('[FSUIPC] Erro ao parsear mensagem:', e);
  }
};
```

### 2. **src/pages/ATCOnline.js**

**Alteração 1: Connection Handler**
- Mesma mudança que em `useFSUIPC.js`
- Usa `vars.declare` + `vars.read` em vez de `subscribe`

**Alteração 2: Message Handler**
- Processa resposta de `vars.read`
- Acessa dados via nomes de variável declaradas: `mapped.latitude`, `mapped.longitude`, etc.

```javascript
socket.onmessage = (event) => {
  try {
    const msg = JSON.parse(event.data);

    // Resposta de vars.read com dados
    if (msg.data && Array.isArray(msg.data)) {
      const mapped = {};
      msg.data.forEach(item => {
        mapped[item.name] = item.value;
      });

      setMessages(prev => [...prev, event.data]);

      const flightData = {
        type: 'position',
        callsign: 'PLAYER',
        lat: mapped.latitude || 0,
        lon: mapped.longitude || 0,
        altitude: mapped.altitude || 0,
        speed: mapped.speed || 0,
        heading: mapped.heading || 0
      };

      setPlanes([flightData]);
      setSelectedPlane(flightData);

      // Continuar lendo
      socket.send(JSON.stringify({
        command: 'vars.read'
      }));
    }
  } catch (error) {
    console.error('[ATCOnline] Erro ao processar mensagem:', error);
  }
};
```

### 3. **src/components/painel.js**

**Alteração: Data Access**
- Muda de chaves antigas `data['A:PLANE LATITUDE']` para nomes simples
- Agora acessa: `data.latitude`, `data.longitude`, `data.altitude`, `data.speed`, `data.heading`

```javascript
{status === 'conectado' && data ? (
  <div className="bg-white rounded-lg shadow p-6">
    <h2 className="text-xl font-semibold mb-4">✈️ Dados em Tempo Real</h2>
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      <div className="bg-blue-50 p-4 rounded">
        <p className="text-sm text-gray-600">Latitude</p>
        <p className="text-2xl font-bold">{data.latitude?.toFixed(4) || '—'}</p>
      </div>
      <div className="bg-blue-50 p-4 rounded">
        <p className="text-sm text-gray-600">Longitude</p>
        <p className="text-2xl font-bold">{data.longitude?.toFixed(4) || '—'}</p>
      </div>
      <div className="bg-green-50 p-4 rounded">
        <p className="text-sm text-gray-600">Altitude (ft)</p>
        <p className="text-2xl font-bold">{Math.round(data.altitude || 0)}</p>
      </div>
      <div className="bg-green-50 p-4 rounded">
        <p className="text-sm text-gray-600">Velocidade (knots)</p>
        <p className="text-2xl font-bold">{Math.round(data.speed || 0)}</p>
      </div>
      <div className="bg-yellow-50 p-4 rounded">
        <p className="text-sm text-gray-600">Rumo (graus)</p>
        <p className="text-2xl font-bold">{Math.round(data.heading || 0)}</p>
      </div>
    </div>
  </div>
)
```

## Tipos de Dados Suportados pelo FSUIPC

| Tipo | Descrição | Exemplo |
|------|-----------|---------|
| `f64` | Float 64-bit | Latitude, Longitude, Altitude |
| `i32` | Integer 32-bit | Speed, Heading, etc |
| `i16` | Integer 16-bit | Pequenos valores inteiros |
| `i8` | Integer 8-bit | Booleanos (0/1) |

## Estrutura de Dados Agora Retornada

**Antes (esperado mas não funcionando):**
```javascript
{
  'A:PLANE LATITUDE': 47.234567,
  'A:PLANE LONGITUDE': -122.345678,
  'A:PLANE ALTITUDE': 5000.0,
  'A:AIRSPEED INDICATED': 120,
  'A:HEADING INDICATOR': 270
}
```

**Depois (atual, correto):**
```javascript
{
  latitude: 47.234567,
  longitude: -122.345678,
  altitude: 5000.0,
  speed: 120,
  heading: 270
}
```

## Testes Realizados

✅ **npm start** - Servidor rodando sem erros
✅ **Port 3000** - React Dev Server ativo
✅ **Port 2048** - FSUIPC WebSocket respondendo
✅ **Compilação** - Zero erros de compilação
✅ **Syntax** - Todas as alterações sintaticamente corretas

## Como Testar a Conexão

1. **Certifique-se que está rodando:**
   - Flight Simulator 2024
   - FSUIPC WebSocket Server (porta 2048)
   - React Dev Server (porta 3000)

2. **Abra no navegador:**
   - `http://localhost:3000/atc-online` - Página principal
   - `http://localhost:3000/painel` - Painel com dados detalhados

3. **Verifique o console do navegador (F12):**
   - Deve aparecer: `[FSUIPC] ✅ Conectado com sucesso!`
   - Deve aparecer: `[FSUIPC] Variáveis declaradas com sucesso`
   - Dados devem atualizar continuamente

## Referências

- **Documentação FSUIPC WebSocket:** http://fsuipcwebsockets.paulhenty.com/
- **Especificação de Comandos:** vars.declare, vars.read
- **Tipos de Variáveis:** f64 (double), i32 (int), i16 (short), i8 (char)
