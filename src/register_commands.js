require('dotenv').config();
const { REST, Routes, SlashCommandBuilder } = require('discord.js');

const commands = [
  {
    name: 'bind',
    description: 'Vincula o bot à um canal específico.',
    type: 1, // Slash command
    options: [
      {
        name: 'canal',
        type: 7, // Channel type
        description: 'Selecione o canal para vincular o bot.',
        required: true,
      }
    ]
  },
  {
    name: 'teste-perícias',
    description: 'Realiza um teste de perícia com dados aprendidos da sua ficha.',
    type: 1, // Slash command
    options: [
      {
        name: 'pericias',
        type: 3, // String type
        description: 'Escolha uma perícia.',
        required: true,
        choices: [
          { name: 'acrobacia', value: 'Acrobacia' },
          { name: 'atletismo', value: 'Atletismo' },
          { name: 'corpo-a-corpo-1', value: 'CAC 1' },
          { name: 'corpo-a-corpo-2', value: 'CAC 2' },
          { name: 'corpo-a-corpo-3', value: 'CAC 3' },
          { name: 'enganação', value: 'Enganação' },
          { name: 'especialidade-1', value: 'Especialidade 1' },
          { name: 'especialidade-2', value: 'Especialidade 2' },
          { name: 'especialidade-3', value: 'Especialidade 3' },
          { name: 'especialidade-4', value: 'Especialidade 4' },
          { name: 'furtividade', value: 'Furtividade' },
          { name: 'intimidação', value: 'Intimidação' },
          { name: 'intuição', value: 'Intuição' },
          { name: 'investigação', value: 'Investigação' },
          { name: 'percepção', value: 'Percepção' },
          { name: 'combate-a-distância-1', value: 'CAD 1' },
          { name: 'combate-a-distância-2', value: 'CAD 2' },
          { name: 'combate-a-distância-3', value: 'CAD 3' },
          { name: 'persuasão', value: 'Persuasão' },
          { name: 'prestidigitação', value: 'Prestidigitação' },
          { name: 'tecnologia', value: 'Tecnologia' },
          { name: 'tratamento', value: 'Tratamento' },
          { name: 'veículos', value: 'Veículos' }
        ]
      }
    ]
  },
  {
    name: 'teste-habilidades',
    description: 'Realiza um teste de habilidade com dados aprendidos da sua ficha.',
    type: 1, // Slash command
    options: [
      {
        name: 'habilidades',
        type: 3, // String type
        description: 'Escolha uma habilidade.',
        required: true,
        choices: [
          { name: 'força', value: 'Forca' },
          { name: 'agilidade', value: 'Agi' },
          { name: 'luta', value: 'Luta' },
          { name: 'vigor', value: 'Vigor' },
          { name: 'prontidão', value: 'Pro' },
          { name: 'destreza', value: 'Des' },
          { name: 'presença', value: 'Pre' },
          { name: 'intelecto', value: 'Int' },
          { name: 'iniciativa', value: 'Iniciativa' }
        ]
      }
    ]
  },
  {
    name: 'teste-defesa',
    description: 'Realiza um teste de defesa com dados aprendidos da sua ficha.',
    type: 1, // Slash command
    options: [
      {
        name: 'defesas',
        type: 3, // String type
        description: 'Escolha uma defesa.',
        required: true,
        choices: [
          { name: 'esquiva', value: 'Esq' },
          { name: 'aparar', value: 'Apr' },
          { name: 'resistência', value: 'Res' },
          { name: 'vontade', value: 'Von' },
          { name: 'fortitude', value: 'Fort' }
        ]
      }
    ]
  },
  {
    name: 'teste-dano',
    description: 'Realiza um teste de dano.',
    type: 1, // Slash command
    options: [
      {
        name: 'dano',
        type: 4, // String type
        description: 'Escolha o nível de dano.',
        required: true,
        choices: [
          { name: 'dano-1', value: 1 },
          { name: 'dano-2', value: 2 },
          { name: 'dano-3', value: 3 },
          { name: 'dano-4', value: 4 },
          { name: 'dano-5', value: 5 },
          { name: 'dano-6', value: 6 },
          { name: 'dano-7', value: 7 },
          { name: 'dano-8', value: 8 },
          { name: 'dano-9', value: 9 },
          { name: 'dano-10', value: 10 },
          { name: 'dano-11', value: 11 },
          { name: 'dano-12', value: 12 },
          { name: 'dano-13', value: 13 },
          { name: 'dano-14', value: 14 },
          { name: 'dano-15', value: 15 },
          { name: 'dano-16', value: 16 },
          { name: 'dano-17', value: 17 },
          { name: 'dano-18', value: 18 },
          { name: 'dano-19', value: 19 },
          { name: 'dano-20', value: 20 }
        ]
      }
    ]
  }
];


const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

(async () => {
  try {
    console.log("Registrando Comandos...");
    await rest.put(Routes.applicationCommands(process.env.CLIENT_ID),
      {body: commands}
    )
    console.log("Comandos registrados.");
  } catch (error) {
    console.log(error);
  }
})();

