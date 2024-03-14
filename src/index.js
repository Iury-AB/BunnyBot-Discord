require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const { Client, IntentsBitField, Guild, REST, Routes } = require('discord.js');
const app = express();
const port = 3000;
//const mongoose = require('mongoose');



app.use(bodyParser.urlencoded({ extended: true }));

const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
  ]
});

/*(async () => {
  try {
    await mongoose.connect(process.env.MDBURI);
    console.log("Connected to DB");

    client.on('ready', (c) => {
      console.log(`${c.user.tag} is ready.`);
    });
    
    client.on('messageCreate', (msg) =>{
      if(msg.author.bot){
        return;
      }
    });

    client.login(process.env.TOKEN);

  } catch (error) {
    console.log(`Error: ${error}`);
  }

})();*/

client.on('ready', (c) => {
  console.log(`${c.user.tag} is ready.`);
});

client.on('messageCreate', (msg) =>{
  if(msg.author.bot){
    return;
  }
});

const qualTeste = function(nome){
  let teste = "";
  const parts = nome.split('.');
  if(parts[0][0] == "V"){
    if(parts[1] == 0){
      teste = "Acrobacia";
    }else if(parts[1] == 1){
      teste = "Atletismo";
    }else if(parts[1] == 2){
      teste = "CAC 1";
    }else if(parts[1] == 3){
      teste = "CAC 2";
    }else if(parts[1] == 4){
      teste = "CAC 3";
    }else if(parts[1] == 5){
      teste = "Enganação";
    }else if(parts[1] == 6){
      teste = "Especialidade 1";
    }else if(parts[1] == 7){
      teste = "Especialidade 2";
    }else if(parts[1] == 8){
      teste = "Especialidade 3";
    }else if(parts[1] == 9){
      teste = "Especialidade 4";
    }else if(parts[1] == 10){
      teste = "Furtividade";
    }else if(parts[1] == 11){
      teste = "Intimidação";
    }else if(parts[1] == 12){
      teste = "Intuição";
    }else if(parts[1] == 13){
      teste = "Investigação";
    }else if(parts[1] == 14){
      teste = "Percepção";
    }else if(parts[1] == 15){
      teste = "CAD 1";
    }else if(parts[1] == 16){
      teste = "CAD 2";
    }else if(parts[1] == 17){
      teste = "CAD 3";
    }else if(parts[1] == 18){
      teste = "Persuasão";
    }else if(parts[1] == 19){
      teste = "Prestidigitação";
    }else if(parts[1] == 20){
      teste = "Tecnologia";
    }else if(parts[1] == 21){
      teste = "Tratamento";
    }else if(parts[1] == 22){
      teste = "Veículos";
    }
  }else{
    teste = parts[0];
  }
  
  return teste;
};

// Define a route to handle incoming POST requests
app.post('/submit-form', async (req, res) => {
  // Handle incoming form data
  res.send();

  const reqBody = JSON.stringify(req.body);
  const received = JSON.parse(reqBody);
  // Map over the values array and parse each value to an integer
  const values = Object.values(received).map(value => parseInt(value));
  const keys = Object.keys(received);
  console.log(keys);
  console.log(values);

  const guildId = "859934102203138118"; // server ID
  const channelId = '859934102203138121'; // channel ID
  const guild = await client.guilds.fetch(guildId);
  const channel = guild.channels.cache.get(channelId);

  const resultado = keys[0][0] == 'r'? values[0] : values[1];
  const bonus = keys[0][0] != 'r'? values[0] : values[1];
  const rolagem = resultado - bonus;
  const nomeTeste = keys[0][0] == 'V'? qualTeste(keys[0]) : qualTeste(keys[1]);

  let msg;
  if(rolagem == 20 || rolagem == 1){
    msg = "` " + resultado + " `" + " ⟵ [**" + rolagem + "**] 1d20 + " + bonus + ", " + nomeTeste;
    if(rolagem == 20){
      msg = ":sparkles: " + msg; 
    }else if(rolagem == 1){
      msg = ":skull: " + msg;
    }
  }else{
    msg = "` " + resultado + " `" + " ⟵ [" + rolagem + "] 1d20 + " + bonus + ", " + nomeTeste;
  }

  
  await channel.send(msg);
});

app.post('/dano', async (req, res) => {
  // Handle incoming form data
  res.send();

  const reqBody = JSON.stringify(req.body);
  const received = JSON.parse(reqBody);
  // Map over the values array and parse each value to an integer
  const values = Object.values(received);
  const keys = Object.keys(received);
  console.log(keys);
  console.log(values);

  const guildId = "859934102203138118"; // server ID
  const channelId = '859934102203138121'; // channel ID
  const guild = await client.guilds.fetch(guildId);
  const channel = guild.channels.cache.get(channelId);

  const resultado = values[2];
  const nvlDano = values[0];
  const rolagens = values[3];
  const calcDano = values[1];

  let msg;
  if(calcDano == "---"){
    msg = ":mag: Dano não encontrado."
  }
  else{
    msg =  "` " + resultado + " ` ⟵ `" + rolagens + "` ⟵ Dano " + nvlDano + " [" + calcDano +"]";
  }
  await channel.send(msg);
});

client.on('guildCreate',async guild => {
  const systemChannel = guild.systemChannel;
  if(systemChannel){
    guild = guild.id;
  }else{
    console.log("erro");
  }
  
});

client.on('interactionCreate', async (interaction) => {
  if(!interaction.isChatInputCommand()) return;

  if(interaction.commandName === 'bind') {
    // Check if the user has permission to manage channels
    if (!interaction.member.permissions.has('MANAGE_CHANNELS')) {
      return interaction.reply({ content: 'You do not have permission to bind the bot to a channel.', ephemeral: true });
    }

    // Get the provided channel option
    const channelOption = interaction.options.getChannel('channel');

    // Update bot's configuration to store the bound channel ID
    // (You'll need to implement your own logic for this)
    // For demonstration purposes, we'll just log the channel ID
    console.log(`Bot has been bound to channel ${channelOption.id}.`);

    // Send a confirmation message
    await interaction.reply({ content: `Bot has been bound to channel <#${channelOption.id}>.`, ephemeral: true });
  }
});


// Start the server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});


client.login(process.env.TOKEN);
