module Suikemon::deploy_hook {
    use obelisk::world::{World, AdminCap};
    use Suikemon::trading_schema;

    /// Not the right admin for this world
    const ENotAdmin: u64 = 0;

    public entry fun run(world: &mut World, admin_cap: &AdminCap) {
         assert!(world.admin() == object::id(admin_cap), ENotAdmin);
        
        // Logic that needs to be automated once the contract is deployed
        
        let admin = world.admin().to_address();
        trading_schema::set(world, admin, vector<u64>[], vector<bool>[], vector<u128>[], vector<u64>[], vector<address>[]);
    }

    #[test_only]
    public fun deploy_hook_for_testing(world: &mut World, admin_cap: &AdminCap){
        run(world, admin_cap)
    }
}
