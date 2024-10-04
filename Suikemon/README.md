# Suikemon

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

With the help of the `obelisk` engine, almost all game-related data of this game is stored on the chain.

This game project is for learning purposes, but there are still many shortcomings. Please bear in mind during the game.

This is a simple card drawing and selling platform. The card contents are all Pokémon with the main attribute or secondary attribute being water, so it is called Suikemon.<br>Here, you can extract suikemon and sell them at a customized price. It also provides a picture book collection function.<br>Believe in yourself, you can become a Suikémon training master!

## Custom system account

Pull your local project and create/change the following files to contain the system account information you need:

```bash
# export const PRIVATEKEY = '......'
# export const ACCOUNT = '......'
/src/chain/key.ts

# PRIVATE_KEY=...
/.env

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

