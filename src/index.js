require('dotenv').config();
const express = require('express');
const fs = require('fs');
const keep_alive = require('./keep_alive.js');
const bodyParser = require('body-parser');
const { Client, IntentsBitField, Guild, REST, Routes, Permissions, GuildMembers } = require('discord.js');
const app = express();
const port = process.env.PORT || 3000;


app.use(bodyParser.urlencoded({ extended: true }));

const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
  ]
});

// Load the configuration file
let config = {};
try {
    config = JSON.parse(fs.readFileSync('config.json'));
} catch (error) {
    console.error('Error loading configuration file:', error);
}

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
  console.log(req.body);
  const reqBody = JSON.stringify(req.body);
  const received = JSON.parse(reqBody);
  // Map over the values array and parse each value to an integer
  const values = Object.values(received).map(value => parseInt(value));
  let newKeys = Object.keys(received);
  let perIndex;
  for(var i = 0 ; i < newKeys.length; i++){
    var index = newKeys[i].indexOf('.');
    if(newKeys[i][0] == 'V') perIndex = newKeys[i].split('.')[1];
    newKeys[i] = index !== -1 ? newKeys[i].substring(0, index) : newKeys[i];
  }
  const dadosFicha = {};
  newKeys.forEach((key, index) => {
    dadosFicha[key] = values[index];
  });
  
  let channelId;
  let channel;
  const guildId = received["discordID"]; // server ID
  const guild = await client.guilds.fetch(guildId);
  
  if(config.guilds && config.guilds[guildId]){
    channelId = config.guilds[guildId]; // channel ID
    channel = guild.channels.cache.get(channelId);
  }else{
    const fetchedGuild = await client.guilds.fetch(guildId);
    const systemChannel = fetchedGuild.systemChannel;
    channel = systemChannel;
  }
  
  const resultado = dadosFicha["resultado"];
  const bonus = dadosFicha["ValorPericias"];
  const rolagem = resultado - bonus;
  const nomeTeste = qualTeste("ValorPericias."+perIndex);

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
  const cachedUser = await guild.members.fetch({ query: received["Jogador"], limit: 1 });

  sheetUser = cachedUser.first();
  console.log(received["Jogador"]);
  if(sheetUser && Object.keys(received).length > 3){
    msg = "<@" + sheetUser.id + ">\n" + msg;
  }else{
    console.log("Usuario não encontrado.");
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
  let newKeys = Object.keys(received);

  let perIndex;
  for(var i = 0 ; i < newKeys.length; i++){
    var index = newKeys[i].indexOf(' ');
    if(newKeys[i][0] == 'D') perIndex = newKeys[i].split(' ')[1];
    newKeys[i] = index !== -1 ? newKeys[i].substring(0, index) : newKeys[i];
  }
  const dadosFicha = {};
  newKeys.forEach((key, index) => {
    dadosFicha[key] = values[index];
  });

  let channelId;
  let channel;
  const guildId = received["discordID"]; // server ID
  const guild = await client.guilds.fetch(guildId);
  
  if(config.guilds && config.guilds[guildId]){
    channelId = config.guilds[guildId]; // channel ID
    channel = guild.channels.cache.get(channelId);
  }else{
    const fetchedGuild = await client.guilds.fetch(guildId);
    const systemChannel = fetchedGuild.systemChannel;
    channel = systemChannel;
  }

  const resultado = dadosFicha["resultadoDano"];
  const nvlDano = dadosFicha["Dano"];
  const rolagens = dadosFicha["rolagensDano"];
  const calcDano = dadosFicha["Rolagem"];

  let msg;
  if(calcDano == "---"){
    msg = ":mag: Dano não encontrado."
  }
  else{
    msg =  "` " + resultado + " ` ⟵ `" + rolagens + "` ⟵ Dano " + nvlDano + " [" + calcDano +"]";
  }

  const cachedUser = await guild.members.fetch({ query: received["Jogador"], limit: 1 });

  sheetUser = cachedUser.first();

  if(sheetUser && Object.keys(received).length > 5){
    msg = "<@" + sheetUser.id + ">\n" + msg;
  }else{
    console.log("Usuario não encontrado.");
  }

  await channel.send(msg);
});

app.post('/habilidade', async (req, res) => {
  // Handle incoming form data
  res.send();
  console.log(req.body);
  const reqBody = JSON.stringify(req.body);
  const received = JSON.parse(reqBody);
  // Map over the values array and parse each value to an integer
  const values = Object.values(received).map(value => parseInt(value));
  let newKeys = Object.keys(received);
  let perIndex;
  for(var i = 0 ; i < newKeys.length; i++){
    var index = newKeys[i].indexOf('.');
    if(newKeys[i][0] == 'r') perIndex = newKeys[i].split('.')[1];
    newKeys[i] = index !== -1 ? newKeys[i].substring(0, index) : newKeys[i];
  }
  const dadosFicha = {};
  newKeys.forEach((key, index) => {
    dadosFicha[key] = values[index];
  });
  
  let channelId;
  let channel;
  const guildId = received["discordID"]; // server ID
  const guild = await client.guilds.fetch(guildId);
  
  if(config.guilds && config.guilds[guildId]){
    channelId = config.guilds[guildId]; // channel ID
    channel = guild.channels.cache.get(channelId);
  }else{
    const fetchedGuild = await client.guilds.fetch(guildId);
    const systemChannel = fetchedGuild.systemChannel;
    channel = systemChannel;
  }
  const resultado = dadosFicha["resultado"];
  const bonus = dadosFicha["Hab"];
  const rolagem = resultado - bonus;
  const nomeTeste = perIndex;

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
  const cachedUser = await guild.members.fetch({ query: received["Jogador"], limit: 1 });

  sheetUser = cachedUser.first();
  console.log(received["Jogador"]);
  if(sheetUser && Object.keys(received).length > 3){
    msg = "<@" + sheetUser.id + ">\n" + msg;
  }else{
    console.log("Usuario não encontrado.");
  }
  
  await channel.send(msg);
});

app.post('/ataque', async (req, res) => {
  // Handle incoming form data
  res.send();
  console.log(req.body);
  const reqBody = JSON.stringify(req.body);
  const received = JSON.parse(reqBody);
  // Map over the values array and parse each value to an integer
  const values = Object.values(received);
  let newKeys = Object.keys(received);
  let perIndex;
  for(var i = 0 ; i < newKeys.length; i++){
    var index = newKeys[i].indexOf(' ');
    if(newKeys[i][0] == 'A') perIndex = newKeys[i].split(' ')[1];
    newKeys[i] = index !== -1 ? newKeys[i].substring(0, index) : newKeys[i];
  }
  const dadosFicha = {};
  newKeys.forEach((key, index) => {
    dadosFicha[key] = values[index];
  });
  
  let channelId;
  let channel;
  const guildId = received["discordID"]; // server ID
  const guild = await client.guilds.fetch(guildId);
  
  if(config.guilds && config.guilds[guildId]){
    channelId = config.guilds[guildId]; // channel ID
    channel = guild.channels.cache.get(channelId);
  }else{
    const fetchedGuild = await client.guilds.fetch(guildId);
    const systemChannel = fetchedGuild.systemChannel;
    channel = systemChannel;
  }
  console.log(dadosFicha);
  const resultadoAcerto = parseInt(dadosFicha["resultadoAc"]);
  const bonusAcerto = parseInt(dadosFicha["Acerto"]);
  const crit = parseInt(dadosFicha["Crit"]);
  const rolagemAcerto = resultadoAcerto - bonusAcerto;
  const nomeTeste = perIndex;

  let msg;
  //parte sobre o Acerto
  if(rolagemAcerto >= crit || rolagemAcerto == 1){
    msg = "Ataque " + nomeTeste + "\n` " + resultadoAcerto + " `" + " ⟵ [**" + rolagemAcerto + "**] 1d20 + " + bonusAcerto;
    if(rolagemAcerto >= crit){
      msg = ":sparkles: " + msg; 
    }else if(rolagemAcerto == 1){
      msg = ":skull: " + msg;
    }
  }else{
    msg = "Ataque " + nomeTeste + "\n` " + resultadoAcerto + " `" + " ⟵ [" + rolagemAcerto + "] 1d20 + " + bonusAcerto;
  }
  const cachedUser = await guild.members.fetch({ query: received["Jogador"], limit: 1 });

  sheetUser = cachedUser.first();
  if(sheetUser && Object.keys(received).length > 8){
    msg = "<@" + sheetUser.id + ">\n" + msg;
  }else{
    console.log("Usuario não encontrado.");
  }

  //parte sobre o dano
  console.log(dadosFicha);
  const resultadoDano = dadosFicha["resultadoDano"];
  const nvlDano = parseInt(dadosFicha["Dano"]);
  const rolDano = dadosFicha["rolagensDano"];
  const calcDano = dadosFicha["Rolagem"];

  if(calcDano == "---"){
    msg += "\n\n:mag: Dano não encontrado."
  }
  else{
    console.log(resultadoDano);
    if(rolagemAcerto >= crit){
      msg +=  "\n**` " + resultadoDano + " `** ⟵ `" + rolDano + "` ⟵ Dano " + nvlDano + " crítico! [2*(" + calcDano +")]";
    }else{
      msg +=  "\n` " + resultadoDano + " ` ⟵ `" + rolDano + "` ⟵ Dano " + nvlDano + " [" + calcDano +"]";
    }
  }
  
  await channel.send(msg);
});

app.post('/ataqueNaoDano', async (req, res) => {
  // Handle incoming form data
  res.send();
  console.log(req.body);
  const reqBody = JSON.stringify(req.body);
  const received = JSON.parse(reqBody);
  // Map over the values array and parse each value to an integer
  const values = Object.values(received);
  let newKeys = Object.keys(received);
  let perIndex;
  for(var i = 0 ; i < newKeys.length; i++){
    var index = newKeys[i].indexOf(' ');
    if(newKeys[i][0] == 'A') perIndex = newKeys[i].split(' ')[1];
    newKeys[i] = index !== -1 ? newKeys[i].substring(0, index) : newKeys[i];
  }
  const dadosFicha = {};
  newKeys.forEach((key, index) => {
    dadosFicha[key] = values[index];
  });
  
  let channelId;
  let channel;
  const guildId = received["discordID"]; // server ID
  const guild = await client.guilds.fetch(guildId);
  
  if(config.guilds && config.guilds[guildId]){
    channelId = config.guilds[guildId]; // channel ID
    channel = guild.channels.cache.get(channelId);
  }else{
    const fetchedGuild = await client.guilds.fetch(guildId);
    const systemChannel = fetchedGuild.systemChannel;
    channel = systemChannel;
  }
  console.log(dadosFicha);
  const resultadoAcerto = parseInt(dadosFicha["resultadoAc"]);
  const bonusAcerto = parseInt(dadosFicha["Acerto"]);
  const crit = parseInt(dadosFicha["Crit"]);
  const rolagemAcerto = resultadoAcerto - bonusAcerto;
  const nomeTeste = perIndex;

  let msg;
  //parte sobre o Acerto
  if(rolagemAcerto >= crit || rolagemAcerto == 1){
    msg = "Ataque " + nomeTeste + "\n` " + resultadoAcerto + " `" + " ⟵ [**" + rolagemAcerto + "**] 1d20 + " + bonusAcerto;
    if(rolagemAcerto >= crit){
      msg = ":sparkles: " + msg; 
    }else if(rolagemAcerto == 1){
      msg = ":skull: " + msg;
    }
  }else{
    msg = "Ataque " + nomeTeste + "\n` " + resultadoAcerto + " `" + " ⟵ [" + rolagemAcerto + "] 1d20 + " + bonusAcerto;
  }
  const cachedUser = await guild.members.fetch({ query: received["Jogador"], limit: 1 });

  sheetUser = cachedUser.first();
  if(sheetUser && Object.keys(received).length > 4){
    msg = "<@" + sheetUser.id + ">\n" + msg;
  }else{
    console.log("Usuario não encontrado.");
  }
  
  await channel.send(msg);
});

client.on('guildCreate',async guild => {
  const systemChannel = guild.systemChannel;
  if(systemChannel){
    
  }else{
    console.log("erro");
  }
  
});

client.on('guildDelete', (guild) => {
  // Remove the guild's configuration from the config object
  delete config.guilds[guild.id];
  
  // Save the updated configuration file
  fs.writeFileSync('config.json', JSON.stringify(config, null, 2));
  
  console.log(`Removed configuration for guild ${guild.name} (${guild.id})`);
});

client.on('interactionCreate', async (interaction) => {
  if(!interaction.isChatInputCommand()) return;

  if(interaction.commandName === 'bind') {
    // Check if the user has permission to manage channels
    if (!interaction.member.permissions.has(MANAGE_CHANNELS)) {
      console.log("Sem permissao");
      return interaction.reply({ content: 'You do not have permission to bind the bot to a channel.', ephemeral: true });
    }
    const channelOption = interaction.options.getChannel('channel');
    
    // Store the ID of the specified channel in the configuration file
    config.guilds = config.guilds || {};
    config.guilds[interaction.guild.id] = channelOption.id;

    await interaction.reply("Ok, ficarei aí.");

    // Save the updated configuration file
    fs.writeFileSync('config.json', JSON.stringify(config, null, 2));
    console.log("Mudei de canal");

  }
});


// Start the server
app.listen(port, () => {
  console.log(`Server listening at 18.222.112.127:${port}`);
});


client.login(process.env.TOKEN);
