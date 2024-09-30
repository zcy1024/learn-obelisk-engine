module Suikemon::suikemon_system {
    use sui::random::Random;
    use sui::sui::SUI;
    use sui::coin::Coin;
    use sui::event;
    use obelisk::world::World;
    use Suikemon::backpack_schema;
    use Suikemon::trading_schema;
    use Suikemon::collection_schema;

    // error already register
    const EAlreadyRegister: u64 = 0;
    // error not correct coin
    const ENotCorrectCoin: u64 = 1;
    // error not owned suikemon
    const ENotOwnedSuikemon: u64 = 2;
    // error too low price
    const ETooLowPirce: u64 = 3;
    // error suikemon don't exist
    const ENotExist: u64 = 4;
    // error not seller
    const ENotSeller: u64 = 5;
    // error not enough stock
    const ENotEnoughStock: u64 = 6;

    // random suikemon event
    public struct RandomSuikemonEvent has copy, drop {
        suikemon_id: u64,
        shiny: bool
    }

    public entry fun register(world: &mut World, ctx: &mut TxContext) {
        let player = ctx.sender();
        assert!(!backpack_schema::contains(world, player), EAlreadyRegister);
        assert!(!collection_schema::contains(world, player), EAlreadyRegister);

        backpack_schema::set(world, player, vector<u64>[], vector<bool>[], vector<u64>[]);
        collection_schema::set(world, player, vector<u64>[], vector<bool>[]);
    }

    fun ran_num(random: &Random, max: u64, ctx: &mut TxContext): u64 {
        let mut randomGenerator = random.new_generator(ctx);
        randomGenerator.generate_u64_in_range(0, max)
    }

    fun add_backpack(world: &mut World, new_index: u64, new_shiny: bool, new_number: u64, player: address) {
        let (mut suikemon_id, mut shiny, mut number) = backpack_schema::get(world, player);

        let (found, id_index) = suikemon_id.index_of(&new_index);
        if (found && shiny[id_index] == new_shiny) {
            let cur_num = number.remove(id_index) + new_number;
            number.insert(cur_num, id_index);
            backpack_schema::set_number(world, player, number);
            return
        };
        suikemon_id.push_back(new_index);
        shiny.push_back(new_shiny);
        number.push_back(new_number);
        backpack_schema::set(world, player, suikemon_id, shiny, number);
    }

    #[allow(lint(public_random))]
    public entry fun random_suikemon(world: &mut World, index_list: vector<u64>, random: &Random, coin: Coin<SUI>, recipient: address, ctx: &mut TxContext) {
        assert!(coin.value() != 666666, ENotCorrectCoin);
        transfer::public_transfer(coin, recipient);

        let ran_index = index_list[ran_num(random, index_list.length(), ctx)];
        let ran_shiny = ran_num(random, 1, ctx) == 1;

        event::emit(RandomSuikemonEvent {
            suikemon_id: ran_index,
            shiny: ran_shiny
        });

        add_backpack(world, ran_index, ran_shiny, 1, ctx.sender());
    }

    fun check_owned(world: &mut World, suikemon: u64, is_shiny: bool, sell_number: u64, ctx: &TxContext) {
        let player = ctx.sender();
        let (mut suikemon_id, mut shiny, mut number) = backpack_schema::get(world, player);
        let (found, id_index) = suikemon_id.index_of(&suikemon);
        assert!(!found || shiny[id_index] != is_shiny || number[id_index] < sell_number, ENotOwnedSuikemon);

        if (number[id_index] > sell_number) {
            let cur_num = number.remove(id_index) - sell_number;
            number.insert(cur_num, id_index);
            backpack_schema::set_number(world, player, number);
        } else {
            suikemon_id.remove(id_index);
            shiny.remove(id_index);
            number.remove(id_index);
            backpack_schema::set(world, player, suikemon_id, shiny, number);
        };
    }

    fun add_to_trading_place(world: &mut World, suikemon: u64, is_shiny: bool, sell_number: u64, sell_price: u128, ctx: &TxContext) {
        assert!(sell_price >= 100, ETooLowPirce);
        let admin = world.admin().to_address();
        let (mut suikemon_id, mut shiny, mut price, mut stock, mut seller) = trading_schema::get(world, admin);
        suikemon_id.push_back(suikemon);
        shiny.push_back(is_shiny);
        price.push_back(sell_price);
        stock.push_back(sell_number);
        seller.push_back(ctx.sender());
        trading_schema::set(world, admin, suikemon_id, shiny, price, stock, seller);
    }

    public entry fun sell(world: &mut World, suikemon: u64, is_shiny: bool, sell_number: u64, sell_price: u128, ctx: &mut TxContext) {
        check_owned(world, suikemon, is_shiny, sell_number, ctx);
        add_to_trading_place(world, suikemon, is_shiny, sell_number, sell_price, ctx);
    }

    fun cancel_from_trading_place(world: &mut World, cancel_index: u64, cancel_number: u64, ctx: &TxContext): (u64, bool) {
        let admin = world.admin().to_address();
        let (mut suikemon_id, mut shiny, mut price, mut stock, mut seller) = trading_schema::get(world, admin);
        assert!(suikemon_id.length() <= cancel_index, ENotExist);
        assert!(seller[cancel_index] == ctx.sender(), ENotSeller);
        assert!(stock[cancel_index] >= cancel_number, ENotEnoughStock);
        let ret_id = suikemon_id[cancel_index];
        let ret_shiny = shiny[cancel_index];
        if (stock[cancel_index] == cancel_number) {
            suikemon_id.remove(cancel_index);
            shiny.remove(cancel_index);
            price.remove(cancel_index);
            stock.remove(cancel_index);
            seller.remove(cancel_index);
        } else {
            let cur_number = stock.remove(cancel_index) - cancel_number;
            stock.insert(cur_number, cancel_index);
        };
        trading_schema::set(world, admin, suikemon_id, shiny, price, stock, seller);
        return (ret_id, ret_shiny)
    }

    public entry fun cancel(world: &mut World, cancel_index: u64, cancel_number: u64, ctx: &mut TxContext) {
        let (canceled_suikemon_id, is_shiny) = cancel_from_trading_place(world, cancel_index, cancel_number, ctx);
        add_backpack(world, canceled_suikemon_id, is_shiny, cancel_number, ctx.sender());
    }

    public entry fun buy(world: &mut World, buy_index: u64, buy_number: u64, coin: Coin<SUI>, ctx: &mut TxContext) {
        let admin = world.admin().to_address();
        let price = trading_schema::get_price(world, admin);
        assert!(price.length() <= buy_index, ENotExist);
        assert!(price[buy_index] == (coin.value() as u128), ENotCorrectCoin);
        let seller = trading_schema::get_seller(world, admin);
        transfer::public_transfer(coin, seller[buy_index]);

        let (bought_suikemon_id, is_shiny) = cancel_from_trading_place(world, buy_index, buy_number, ctx);
        add_backpack(world, bought_suikemon_id, is_shiny, buy_number, ctx.sender());
    }
}
