module Blackjack::game_schema {
	use std::option::some;
    use Blackjack::app_key;
    use Blackjack::app_key::AppKey;
    use sui::table::{Self, Table};
    use obelisk::schema;
    use obelisk::events;
    use obelisk::world::{World, AdminCap};

	/// Entity does not exist
	const EEntityDoesNotExist: u64 = 0;

	const SCHEMA_ID: vector<u8> = b"game";
	const SCHEMA_TYPE: u8 = 0;

	// dealer
	// player
	// bet
	public struct GameData has copy, drop , store {
		dealer: vector<u8>,
		player: vector<u8>,
		bet: u128
	}

	public fun new(dealer: vector<u8>, player: vector<u8>, bet: u128): GameData {
		GameData {
			dealer, 
			player, 
			bet
		}
	}

	public fun register(_obelisk_world: &mut World, admin_cap: &AdminCap, ctx: &mut TxContext) {
		schema::add<Table<address,GameData>>(_obelisk_world, SCHEMA_ID, table::new<address, GameData>(ctx), admin_cap);
	}

	public(package) fun set(_obelisk_world: &mut World, _obelisk_entity_key: address,  dealer: vector<u8>, player: vector<u8>, bet: u128) {
		let _obelisk_schema = schema::get_mut<Table<address,GameData>, AppKey>(app_key::new(), _obelisk_world, SCHEMA_ID);
		let _obelisk_data = new( dealer, player, bet);
		if(table::contains<address, GameData>(_obelisk_schema, _obelisk_entity_key)) {
			*table::borrow_mut<address, GameData>(_obelisk_schema, _obelisk_entity_key) = _obelisk_data;
		} else {
			table::add(_obelisk_schema, _obelisk_entity_key, _obelisk_data);
		};
		events::emit_set(SCHEMA_ID, SCHEMA_TYPE, some(_obelisk_entity_key), _obelisk_data)
	}

	public(package) fun set_dealer(_obelisk_world: &mut World, _obelisk_entity_key: address, dealer: vector<u8>) {
		let _obelisk_schema = schema::get_mut<Table<address,GameData>, AppKey>(app_key::new(),_obelisk_world, SCHEMA_ID);
		assert!(table::contains<address, GameData>(_obelisk_schema, _obelisk_entity_key), EEntityDoesNotExist);
		let _obelisk_data = table::borrow_mut<address, GameData>(_obelisk_schema, _obelisk_entity_key);
		_obelisk_data.dealer = dealer;
		events::emit_set(SCHEMA_ID, SCHEMA_TYPE, some(_obelisk_entity_key), *_obelisk_data)
	}

	public(package) fun set_player(_obelisk_world: &mut World, _obelisk_entity_key: address, player: vector<u8>) {
		let _obelisk_schema = schema::get_mut<Table<address,GameData>, AppKey>(app_key::new(),_obelisk_world, SCHEMA_ID);
		assert!(table::contains<address, GameData>(_obelisk_schema, _obelisk_entity_key), EEntityDoesNotExist);
		let _obelisk_data = table::borrow_mut<address, GameData>(_obelisk_schema, _obelisk_entity_key);
		_obelisk_data.player = player;
		events::emit_set(SCHEMA_ID, SCHEMA_TYPE, some(_obelisk_entity_key), *_obelisk_data)
	}

	public(package) fun set_bet(_obelisk_world: &mut World, _obelisk_entity_key: address, bet: u128) {
		let _obelisk_schema = schema::get_mut<Table<address,GameData>, AppKey>(app_key::new(),_obelisk_world, SCHEMA_ID);
		assert!(table::contains<address, GameData>(_obelisk_schema, _obelisk_entity_key), EEntityDoesNotExist);
		let _obelisk_data = table::borrow_mut<address, GameData>(_obelisk_schema, _obelisk_entity_key);
		_obelisk_data.bet = bet;
		events::emit_set(SCHEMA_ID, SCHEMA_TYPE, some(_obelisk_entity_key), *_obelisk_data)
	}

	public fun get(_obelisk_world: &World, _obelisk_entity_key: address): (vector<u8>,vector<u8>,u128) {
		let _obelisk_schema = schema::get<Table<address,GameData>>(_obelisk_world, SCHEMA_ID);
		assert!(table::contains<address, GameData>(_obelisk_schema, _obelisk_entity_key), EEntityDoesNotExist);
		let _obelisk_data = table::borrow<address, GameData>(_obelisk_schema, _obelisk_entity_key);
		(
			_obelisk_data.dealer,
			_obelisk_data.player,
			_obelisk_data.bet
		)
	}

	public fun get_dealer(_obelisk_world: &World, _obelisk_entity_key: address): vector<u8> {
		let _obelisk_schema = schema::get<Table<address,GameData>>(_obelisk_world, SCHEMA_ID);
		assert!(table::contains<address, GameData>(_obelisk_schema, _obelisk_entity_key), EEntityDoesNotExist);
		let _obelisk_data = table::borrow<address, GameData>(_obelisk_schema, _obelisk_entity_key);
		_obelisk_data.dealer
	}

	public fun get_player(_obelisk_world: &World, _obelisk_entity_key: address): vector<u8> {
		let _obelisk_schema = schema::get<Table<address,GameData>>(_obelisk_world, SCHEMA_ID);
		assert!(table::contains<address, GameData>(_obelisk_schema, _obelisk_entity_key), EEntityDoesNotExist);
		let _obelisk_data = table::borrow<address, GameData>(_obelisk_schema, _obelisk_entity_key);
		_obelisk_data.player
	}

	public fun get_bet(_obelisk_world: &World, _obelisk_entity_key: address): u128 {
		let _obelisk_schema = schema::get<Table<address,GameData>>(_obelisk_world, SCHEMA_ID);
		assert!(table::contains<address, GameData>(_obelisk_schema, _obelisk_entity_key), EEntityDoesNotExist);
		let _obelisk_data = table::borrow<address, GameData>(_obelisk_schema, _obelisk_entity_key);
		_obelisk_data.bet
	}

	public(package) fun remove(_obelisk_world: &mut World, _obelisk_entity_key: address) {
		let _obelisk_schema = schema::get_mut<Table<address,GameData>, AppKey>(app_key::new(),_obelisk_world, SCHEMA_ID);
		assert!(table::contains<address, GameData>(_obelisk_schema, _obelisk_entity_key), EEntityDoesNotExist);
		table::remove(_obelisk_schema, _obelisk_entity_key);
		events::emit_remove(SCHEMA_ID, _obelisk_entity_key)
	}

	public fun contains(_obelisk_world: &World, _obelisk_entity_key: address): bool {
		let _obelisk_schema = schema::get<Table<address,GameData>>(_obelisk_world, SCHEMA_ID);
		table::contains<address, GameData>(_obelisk_schema, _obelisk_entity_key)
	}
}
