#[allow(lint(share_owned))] 

module Blackjack::init {
    use std::ascii::string;
    use Blackjack::app_key::AppKey;
    use obelisk::access_control;
    use obelisk::world;
	use Blackjack::player_schema;
	use Blackjack::game_schema;

    fun init(ctx: &mut TxContext) {
        let (mut _obelisk_world, admin_cap) = world::create(string(b"Blackjack"), string(b"Good Luck!"),ctx);
        
        // Authorize this application to access protected features of the World.
        access_control::authorize_app<AppKey>(&admin_cap, &mut _obelisk_world);

        // Add Schema
		player_schema::register(&mut _obelisk_world, &admin_cap, ctx);
		game_schema::register(&mut _obelisk_world, &admin_cap, ctx);

        transfer::public_share_object(_obelisk_world);
        transfer::public_transfer(admin_cap, tx_context::sender(ctx));
    }

    #[test_only]
    public fun init_world_for_testing(ctx: &mut TxContext){
        init(ctx)
    }
}
