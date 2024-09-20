module Blackjack::player_schema {
	use std::option::some;
    use Blackjack::app_key;
    use Blackjack::app_key::AppKey;
    use sui::table::{Self, Table};
    use obelisk::schema;
    use obelisk::events;
    use obelisk::world::{World, AdminCap};

	/// Entity does not exist
	const EEntityDoesNotExist: u64 = 0;

	const SCHEMA_ID: vector<u8> = b"player";
	const SCHEMA_TYPE: u8 = 0;

	// value
	public struct PlayerData has copy, drop , store {
		value: u64
	}

	public fun new(value: u64): PlayerData {
		PlayerData {
			value
		}
	}

	public fun register(_obelisk_world: &mut World, admin_cap: &AdminCap, ctx: &mut TxContext) {
		schema::add<Table<address,PlayerData>>(_obelisk_world, SCHEMA_ID, table::new<address, PlayerData>(ctx), admin_cap);
	}

	public(package) fun set(_obelisk_world: &mut World, _obelisk_entity_key: address,  value: u64) {
		let _obelisk_schema = schema::get_mut<Table<address,PlayerData>, AppKey>(app_key::new(), _obelisk_world, SCHEMA_ID);
		let _obelisk_data = new( value);
		if(table::contains<address, PlayerData>(_obelisk_schema, _obelisk_entity_key)) {
			*table::borrow_mut<address, PlayerData>(_obelisk_schema, _obelisk_entity_key) = _obelisk_data;
		} else {
			table::add(_obelisk_schema, _obelisk_entity_key, _obelisk_data);
		};
		events::emit_set(SCHEMA_ID, SCHEMA_TYPE, some(_obelisk_entity_key), _obelisk_data)
	}

	public fun get(_obelisk_world: &World, _obelisk_entity_key: address): u64 {
		let _obelisk_schema = schema::get<Table<address,PlayerData>>(_obelisk_world, SCHEMA_ID);
		assert!(table::contains<address, PlayerData>(_obelisk_schema, _obelisk_entity_key), EEntityDoesNotExist);
		let _obelisk_data = table::borrow<address, PlayerData>(_obelisk_schema, _obelisk_entity_key);
		(
			_obelisk_data.value
		)
	}

	public(package) fun remove(_obelisk_world: &mut World, _obelisk_entity_key: address) {
		let _obelisk_schema = schema::get_mut<Table<address,PlayerData>, AppKey>(app_key::new(),_obelisk_world, SCHEMA_ID);
		assert!(table::contains<address, PlayerData>(_obelisk_schema, _obelisk_entity_key), EEntityDoesNotExist);
		table::remove(_obelisk_schema, _obelisk_entity_key);
		events::emit_remove(SCHEMA_ID, _obelisk_entity_key)
	}

	public fun contains(_obelisk_world: &World, _obelisk_entity_key: address): bool {
		let _obelisk_schema = schema::get<Table<address,PlayerData>>(_obelisk_world, SCHEMA_ID);
		table::contains<address, PlayerData>(_obelisk_schema, _obelisk_entity_key)
	}
}
