# Discord Channel Message Bridger

This script contains parts for a selfbot that beams messages from specified Servers to your own Server.
It is designed for personal use and educational purposes. Users must comply with Discord's Terms of Service when using this bot.

## Disclaimer

This script uses `discord.js-selfbot-v13`, which is not officially supported by Discord and is against Discord's Terms of Service. Usage of selfbots can lead to account suspension. Use this script at your own risk.

## Features

- Message relaying from multiple source channels to a single target channel.
- Embeds user roles and messages content into a rich embed for forwarding.
- Supports image URLs and attachments.

## Setup

### Prerequisites

- Node.js
- Discord.js and discord.js-selfbot-v13 libraries

### Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/QDaves/Selfbot-Discord-Channel-Bridger
   ```
2. Install the required packages:
   ```sh
   npm install discord.js discord.js-selfbot-v13
   ```
3. Configure your `guildsChannelsMappings` and `roleWhitelist` in the script to match your server and channel IDs.

### Usage

1. Insert your Discord selfbot token and bot token at the bottom of the script.
2. Run the script using Node.js:
   ```sh
   node discordchannelbridge.js
   ```
   Replace `discordchannelbridge.js` with the path to your script file if necessary.

## Contribution

Contributions are welcome. Please open an issue or submit a pull request if you have any improvements or suggestions.

