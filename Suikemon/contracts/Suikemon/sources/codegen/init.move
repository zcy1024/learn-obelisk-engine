#[allow(lint(share_owned))] 

module Suikemon::init {
    use std::ascii::string;
    use Suikemon::app_key::AppKey;
    use obelisk::access_control;
    use obelisk::world;
	use Suikemon::backpack_schema;
	use Suikemon::trading_schema;
	use Suikemon::collection_schema;

    fun init(ctx: &mut TxContext) {
        let (mut _obelisk_world, admin_cap) = world::create(string(b"Suikemon"), string(b"Please enjoy your card drawing and pet raising journey!"),ctx);
        
        // Authorize this application to access protected features of the World.
        access_control::authorize_app<AppKey>(&admin_cap, &mut _obelisk_world);

        // Add Schema
		backpack_schema::register(&mut _obelisk_world, &admin_cap, ctx);
		trading_schema::register(&mut _obelisk_world, &admin_cap, ctx);
		collection_schema::register(&mut _obelisk_world, &admin_cap, ctx);

        transfer::public_share_object(_obelisk_world);
        transfer::public_transfer(admin_cap, tx_context::sender(ctx));
    }

    #[test_only]
    public fun init_world_for_testing(ctx: &mut TxContext){
        init(ctx)
    }
}
