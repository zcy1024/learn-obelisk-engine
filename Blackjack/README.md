# Blackjack

## Usage

```bash
# Please make sure you have the relevant environment for Sui in advance.
pnpm install
pnpm run dev
# After that, you can enter http://localhost:3000/ to access.
# The command `pnpm` can be replaced by a command with the same function, such as: npm, etc.

# If nothing else is changed later, you only need the following command
pnpm next
```

## Rules

With the help of the `obelisk` engine, almost all game-related data of this game is stored on the chain. At the same time, except for connecting wallets, generating new users and recharging, other operations do not require you to actively interact with the wallet.

This game project is for learning purposes, but there are still many shortcomings. Please bear in mind during the game.

For players who are not familiar with blackjack, here is a brief explanation of the rules:

1. In this game you(player) play against machine(enemy).
2. At the beginning, you will all be randomly assigned two playing cards. Among them, your opponent will reveal one card and hide one card.
3. Based on the total points of the cards you hold and the information about your opponent's revealed cards, you can make the following choices: `Ask for cards`, `Double down`, `Admit defeat` and `Over`.
4. `Ask for cards`: You will draw another random card and the points will be accumulated. However, once you have claimed at least one card during a game, you will no longer be able to `Double down`.
5. `Double down`: Draw a card and end your turn, doubling your profit or loss for the game.
6. `Admit defeat`: End the game and lose all bets.
7. `Over`: Actively end your turn.
8. When you end your turn, game will enter your opponent's turn. It will first reveal the hidden cards, and then choose whether to draw cards based on certain logic.
9. If either side has more than 21 points, it will be considered a failure.<br>Either side wins directly if it equals 21 points.<br>If both are less than 21 points, then the number will be compared, and the one with the higher number of points wins.<br>Specially, if both sides have the same points, it is considered a draw.
10. In the card, `A` can be regarded as 1 or 11, `J/Q/K` will be regarded as 10, and `2-9` represent the number itself.
11. After the game is settled, the amount you bet will be updated in real time in the upper right corner of the interface. At the same time, the game also provides a cash withdrawal function, which can help you completely transfer your balance to your wallet.
12. In this version, each recharge is 1 Sui, each round of the game requires a bet of 666666 Balance, and there are no requirements for withdrawals.

## Custom system account

Pull your local project and create/change the following files to contain the system account information you need:

```bash
# export const PRIVATEKEY = '......'
# export const ACCOUNT = '......'
/src/chain/key.ts

# The above information needs to correspond one to one.
# Rest assured, both have been ignored in `.ignore`, so will not be committed to the code base.
```

Finally, you need to change how your project is started:

```bash
# Pull the project for the first time and install related dependencies.
pnpm install

# The first time after changing system account information.
# The purpose is to publish the contract to the chain with your customized account information.
pnpm world-publish && pnpm storeConfig

# Start the front section.(If nothing else is changed later, you only need the following command)
pnpm next
```

