module Blackjack::blackjack_system {
    use std::string::{Self, String};
    use sui::random::Random;
    use sui::sui::SUI;
    use sui::sui::Coin;
    use Blackjack::world::World;
    use Blackjack::player_schema;
    use Blackjack::game_schema;

    // error already register
    const EAlreadyRegister: u64 = 0;
    // error player don't have enough pre-save balance
    const ENotEnoughPreSaveBalance: u64 = 1;
    // error not player
    const ENotPlayer: u64 = 2;

    public entry fun register(world: &mut World, ctx: &mut TxContext) {
        let player = tx_context::sender(ctx);
        assert!(!player_schema::contains(world, player), EAlreadyRegister);
        assert!(!game_schema::contains(world, player), EAlreadyRegister);

        player_schema::set(world, player, 0);
        game_schema::set(world, player, vector<u8>[], vector<u8>[], 0);
    }

    public entry fun play_game(world: &mut World, random: &Random, bet: u128, ctx: &mut TxContext) {
        let player = ctx.sender();
        assert!(player_schema::get(world, player) >= bet, ENotEnoughPreSaveBalance);

        game_schema::set(world, player, vector<u8>[ran_num(random, ctx), ran_num(random, ctx)], vector<u8>[ran_num(random, ctx), ran_num(random, ctx)], bet);
    }

    fun ran_num(random: &Random, ctx: &mut TxContext): u8 {
        let randomGenerator = random.new_generator(ctx);
        randomGenerator.generate_u8_in_range(1, 14)
    }

    public entry fun ran_card(world: &mut World, identity: String, random: &Random, ctx: &mut TxContext) {
        let player = ctx.sender();
        assert!(player_schema::contains(world, player), ENotPlayer);

        let number = ran_num(random, ctx);
        if (identity == string::utf8(b"player")) {
            let cards = game_schema::get_player(world, player);
            cards.push_back(number);
            game_schema::set_player(world, player, cards);
        } else {
            let cards = game_schema::get_dealer(world, player);
            cards.push_back(number);
            game_schema::set_dealer(world, player, cards);
        };
    }

    public entry fun settlement(world: &mut World, changeAmount: u128, ctx: &mut TxContext) {
        let player = ctx.sender();
        assert!(player_schema::contains(world, player), ENotPlayer);
        let amount = player_schema::get(world, player) + changeAmount;
        player_schema::set(world, player, amount);
    }

    public entry fun recharge(world: &mut World, coin: Coin<SUI>, ctx: &mut TxContext) {
        let amount = coin.value();
        settlement(world, amount, ctx);
        transfer::public_transfer(coin, world.admin());
    }

    public entry fun withdraw(coin: Coin<SUI>, ctx: &mut TxContext) {
        let player = ctx.sender();
        assert!(player_schema::contains(world, player), ENotPlayer);
        transfer::public_transfer(coin, player);
    }
}
