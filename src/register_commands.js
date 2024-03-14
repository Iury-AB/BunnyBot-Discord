require('dotenv').config();
const { REST, Routes } = require('discord.js');


const commands = [
  {
    name: 'bind',
    description: 'Vincula o bot à um canal específico.',
    type: 1,
    options: [
      {
        name: 'channel',
        type: 7,
        description: 'Canal para vincular o bot.',
        required: true
      }
    ]
  },
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

